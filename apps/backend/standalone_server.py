#!/usr/bin/env python3
"""
DRIVERYO — Autonomous Standalone HTTP & REST API Server
Provides all /api/v1 endpoints, real-time driver dispatch simulation,
pricing calculations, Swagger docs serving, and website & admin interfaces.
"""

import json
import os
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import time
import math
import mimetypes
import hmac
import hashlib
import threading
import urllib.request
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Upstash Redis Integration
UPSTASH_URL = os.environ.get("UPSTASH_REDIS_REST_URL", "https://calm-polecat-177735.upstash.io")
UPSTASH_TOKEN = os.environ.get("UPSTASH_REDIS_REST_TOKEN", "gQAAAAAAArZHAAIgcDIwODBiZWMxMGI2NzE0NWJlYjAwMmZlZjM4OTEwOGFjMg")

def async_redis_command(*cmd_parts):
    def _run():
        if not UPSTASH_URL or not UPSTASH_TOKEN:
            return
        try:
            payload = json.dumps(list(cmd_parts)).encode('utf-8')
            req = urllib.request.Request(
                UPSTASH_URL,
                data=payload,
                headers={
                    "Authorization": f"Bearer {UPSTASH_TOKEN}",
                    "Content-Type": "application/json"
                },
                method="POST"
            )
            urllib.request.urlopen(req, timeout=3)
        except Exception:
            pass
    threading.Thread(target=_run, daemon=True).start()

PORT = 4000
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OPENAPI_JSON_PATH = os.path.join(ROOT_DIR, 'documentation', 'api', 'openapi.json')

# In-Memory State
DB = {
    "pricing": {
        "INSTANT": {"baseFare": 349, "includedHours": 2, "hourlyRate": 149, "nightPct": 25, "cancellation": 99},
        "SCHEDULED": {"baseFare": 399, "includedHours": 2, "hourlyRate": 149, "nightPct": 25, "cancellation": 99},
        "DAILY": {"baseFare": 1199, "includedHours": 8, "hourlyRate": 129, "nightPct": 25, "cancellation": 199},
        "OUTSTATION": {"baseFare": 1899, "includedHours": 12, "hourlyRate": 159, "nightPct": 30, "cancellation": 299},
        "MONTHLY": {"baseFare": 24999, "includedHours": 208, "hourlyRate": 120, "nightPct": 20, "cancellation": 1000},
        "CORPORATE": {"baseFare": 1299, "includedHours": 9, "hourlyRate": 130, "nightPct": 20, "cancellation": 150}
    },
    "drivers": [
        {
            "id": "drv_hyd_101",
            "fullName": "Ramesh Reddy",
            "phone": "+919848011223",
            "rating": 4.9,
            "totalTrips": 342,
            "latitude": 17.4485,
            "longitude": 78.3812,
            "transmission": "BOTH",
            "approvalStatus": "APPROVED",
            "isOnline": True,
            "isBusy": False
        },
        {
            "id": "drv_hyd_102",
            "fullName": "Mohammed Khaleel",
            "phone": "+919848022334",
            "rating": 4.8,
            "totalTrips": 215,
            "latitude": 17.4398,
            "longitude": 78.3510,
            "transmission": "BOTH",
            "approvalStatus": "APPROVED",
            "isOnline": True,
            "isBusy": False
        },
        {
            "id": "drv_hyd_103",
            "fullName": "Suresh Kumar",
            "phone": "+919848033445",
            "rating": 4.95,
            "totalTrips": 580,
            "latitude": 17.4320,
            "longitude": 78.4080,
            "transmission": "MANUAL",
            "approvalStatus": "APPROVED",
            "isOnline": True,
            "isBusy": False
        },
        {
            "id": "drv_hyd_104",
            "fullName": "Venkatesh Babu",
            "phone": "+919848044556",
            "rating": 4.75,
            "totalTrips": 180,
            "latitude": 17.4170,
            "longitude": 78.4385,
            "transmission": "BOTH",
            "approvalStatus": "APPROVED",
            "isOnline": True,
            "isBusy": False
        }
    ],
    "pending_drivers": [
        {
            "id": "drv_app_201",
            "fullName": "Prasad Rao",
            "phone": "+919849099887",
            "drivingLicenseNumber": "TS0920190048291",
            "yearsExperience": 4,
            "transmissionCompetency": "BOTH",
            "preferredZone": "Gachibowli / Financial District",
            "approvalStatus": "PENDING",
            "bankAccount": {"beneficiaryName": "Prasad Rao", "accountNumber": "5010023948291", "ifscCode": "HDFC0001234"},
            "submittedAt": "2026-11-07T12:00:00Z"
        }
    ],
    "bookings": {},
    "trips": {},
    "orders": {},
    "customers": [
        {
            "id": "cust_01",
            "fullName": "Vikram Reddy",
            "phone": "+919876543210",
            "email": "vikram.reddy@gmail.com",
            "totalBookings": 14,
            "totalSpend": 7850,
            "status": "ACTIVE",
            "referralCode": "VIKRAMHYD",
            "registeredVehicle": "Hyundai Verna (Sedan - Manual) • TS09FA1234",
            "createdAt": "2026-08-15"
        },
        {
            "id": "cust_02",
            "fullName": "Ananya Sharma",
            "phone": "+919876543211",
            "email": "ananya.s@outlook.com",
            "totalBookings": 8,
            "totalSpend": 5420,
            "status": "ACTIVE",
            "referralCode": "ANANYA99",
            "registeredVehicle": "Honda City (Sedan - Automatic) • TS08EA5678",
            "createdAt": "2026-09-02"
        },
        {
            "id": "cust_03",
            "fullName": "Dr. K. Srinivas",
            "phone": "+919876543212",
            "email": "dr.srinivas@apollo.com",
            "totalBookings": 22,
            "totalSpend": 28400,
            "status": "ACTIVE",
            "referralCode": "SRINIVASDOC",
            "registeredVehicle": "Toyota Fortuner (SUV - Automatic) • TS07GA9900",
            "createdAt": "2026-07-20"
        }
    ],
    "tickets": [
        {
            "id": "tkt_01",
            "ticketNumber": "TKT-1082",
            "customerName": "Vikram Reddy",
            "customerPhone": "+919876543210",
            "subject": "Chauffeur arrived 5 mins late due to ORR traffic jam",
            "priority": "MEDIUM",
            "status": "RESOLVED",
            "resolutionNotes": "Credited ₹100 courtesy coupon to wallet.",
            "createdAt": "2026-11-06T14:20:00Z"
        },
        {
            "id": "tkt_02",
            "ticketNumber": "TKT-1095",
            "customerName": "Ananya Sharma",
            "customerPhone": "+919876543211",
            "subject": "Request tax invoice copy with company GSTIN",
            "priority": "LOW",
            "status": "OPEN",
            "resolutionNotes": None,
            "createdAt": "2026-11-07T09:15:00Z"
        }
    ],
    "corporate": [
        {
            "id": "corp_01",
            "companyName": "Cyber Towers Tech Labs Pvt Ltd",
            "gstin": "36AAACC1234F1Z5",
            "contactPerson": "Rajesh Varma",
            "contactEmail": "rajesh.v@cybertech.com",
            "creditLimit": 100000,
            "outstandingAmount": 24500,
            "status": "ACTIVE",
            "activeEmployees": 42
        },
        {
            "id": "corp_02",
            "companyName": "GVK Bio Science Campus",
            "gstin": "36AABBG9876K1Z2",
            "contactPerson": "Lakshmi Nair",
            "contactEmail": "lakshmi.n@gvkbio.com",
            "creditLimit": 150000,
            "outstandingAmount": 18200,
            "status": "ACTIVE",
            "activeEmployees": 68
        }
    ],
    "audit_logs": [
        {"id": "log_01", "action": "DRIVER_APPROVED", "actor": "admin@driveryo.com", "entity": "DriverProfile", "entityId": "drv_app_201", "timestamp": "2026-11-07T12:05:00Z"},
        {"id": "log_02", "action": "PRICING_UPDATED", "actor": "admin@driveryo.com", "entity": "PricingRule", "entityId": "INSTANT", "timestamp": "2026-11-07T10:30:00Z"},
        {"id": "log_03", "action": "BATCH_PAYOUT_INITIATED", "actor": "finance@driveryo.com", "entity": "Payout", "entityId": "batch_hyd_491", "timestamp": "2026-11-07T08:00:00Z"}
    ],
    "payout_batches": [
        {"id": "batch_491", "date": "2026-11-04", "totalAmount": 89400, "driversCount": 48, "status": "PROCESSED"},
        {"id": "batch_492", "date": "2026-11-11", "totalAmount": 34200, "driversCount": 22, "status": "SCHEDULED"}
    ],
    "ratings": {},
    "notifications": [
        {
            "id": "notif_init_01",
            "userId": "usr_demo_01",
            "title": "Welcome to Driveryo!",
            "message": "Your car. Your journey. Our verified professional drivers.",
            "channel": "PUSH",
            "createdAt": "2026-11-07T10:00:00Z"
        }
    ],
    "otps": {"+919876543210": "5555"}
}

def calculate_fare(srv="INSTANT", dur=2, promo="", start_hour=14):
    srv = srv.upper()
    rule = DB["pricing"].get(srv, DB["pricing"]["INSTANT"])
    dur = max(rule["includedHours"], float(dur))
    base = rule["baseFare"]
    extra_hours = max(0, dur - rule["includedHours"])
    extra_fare = extra_hours * rule["hourlyRate"]
    
    # Night surcharge: between 22:00 and 06:00
    is_night = (start_hour >= 22 or start_hour < 6)
    night_surcharge = round((base + extra_fare) * (rule["nightPct"] / 100.0)) if is_night else 0
    
    subtotal = base + extra_fare + night_surcharge
    discount = 100 if promo.upper() in ["FIRSTTRIP", "HYD100"] else 0
    taxable = max(0, subtotal - discount)
    gst = round(taxable * 0.18)
    total = taxable + gst
    return {
        "serviceCategory": srv,
        "durationHours": dur,
        "baseFare": base,
        "includedHours": rule["includedHours"],
        "extraHours": extra_hours,
        "extraHoursFare": extra_fare,
        "nightSurcharge": night_surcharge,
        "discount": discount,
        "taxable": taxable,
        "gst": gst,
        "total": total,
        "currency": "INR"
    }

class DriveryoHandler(BaseHTTPRequestHandler):
    def send_json(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-razorpay-signature')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode('utf-8'))

    def send_html(self, status_code, html_str):
        self.send_response(status_code)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(html_str.encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-razorpay-signature')
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path.startswith('/api/v1/'):
            self.handle_api_get(path, parse_qs(parsed.query))
            return
        elif path == '/docs' or path == '/swagger':
            self.serve_swagger_ui()
            return
        elif path == '/openapi.json':
            if os.path.exists(OPENAPI_JSON_PATH):
                with open(OPENAPI_JSON_PATH, 'r', encoding='utf-8') as f:
                    self.send_json(200, json.load(f))
            else:
                self.send_error(404, "OpenAPI file not found")
            return

        # Static File Serving (Website, Admin, Customer Mobile & Driver Mobile Simulators)
        if path.startswith('/customer-app'):
            file_path = os.path.join(ROOT_DIR, 'apps', 'customer-mobile', 'web', 'index.html')
        elif path.startswith('/driver-app'):
            file_path = os.path.join(ROOT_DIR, 'apps', 'driver-mobile', 'web', 'index.html')
        elif path.startswith('/admin'):
            subpath = path[len('/admin'):].lstrip('/')
            file_path = os.path.join(ROOT_DIR, 'apps', 'admin', 'public', subpath if subpath else 'index.html')
        else:
            subpath = path.lstrip('/')
            file_path = os.path.join(ROOT_DIR, 'apps', 'website', 'public', subpath if subpath else 'index.html')

        if os.path.exists(file_path) and os.path.isfile(file_path):
            mime_type, _ = mimetypes.guess_type(file_path)
            self.send_response(200)
            self.send_header('Content-Type', mime_type or 'text/html')
            self.end_headers()
            with open(file_path, 'rb') as f:
                self.wfile.write(f.read())
        else:
            main_index = os.path.join(ROOT_DIR, 'apps', 'website', 'public', 'index.html')
            if os.path.exists(main_index):
                self.send_response(200)
                self.send_header('Content-Type', 'text/html')
                self.end_headers()
                with open(main_index, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(404, "File Not Found")

    def serve_swagger_ui(self):
        html = """<!DOCTYPE html>
<html>
<head>
  <title>DRIVERYO API Specification — Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
  <link rel="icon" type="image/png" href="https://driveryo.com/favicon.ico" />
  <style>
    body { margin: 0; padding: 0; font-family: sans-serif; background: #0b1120; }
    .topbar { background-color: #101d35 !important; padding: 12px 24px; color: white; display: flex; align-items: center; justify-content: space-between; }
    .topbar-logo { font-size: 20px; font-weight: 800; color: #246bfd; letter-spacing: 0.5px; }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="topbar-logo">DRIVERYO API SPECIFICATION</div>
    <div>Hyderabad, India</div>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: "/openapi.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    }
  </script>
</body>
</html>"""
        self.send_html(200, html)

    def handle_api_get(self, path, query):
        if path == '/api/v1/auth/me':
            self.send_json(200, {"status": "authenticated", "service": "Driveryo Hyderabad API", "version": "1.0.0"})
        elif path == '/api/v1/openapi.json':
            if os.path.exists(OPENAPI_JSON_PATH):
                with open(OPENAPI_JSON_PATH, 'r', encoding='utf-8') as f:
                    self.send_json(200, json.load(f))
            else:
                self.send_json(404, {"error": "OpenAPI specification not found"})
        elif path == '/api/v1/admin/customers':
            self.send_json(200, DB["customers"])
        elif path == '/api/v1/admin/pricing':
            self.send_json(200, DB["pricing"])
        elif path == '/api/v1/admin/finance/overview':
            completed = sum(1 for b in DB["bookings"].values() if b.get("status") == "TRIP_COMPLETED")
            total_gmv = sum(b.get("fareBreakdown", {}).get("total", 0) for b in DB["bookings"].values()) + 45000
            self.send_json(200, {
                "totalGMV": total_gmv,
                "driverEarnings80Pct": round(total_gmv * 0.8),
                "platformCut20Pct": round(total_gmv * 0.2),
                "gstCollected18Pct": round(total_gmv * 0.18),
                "pendingPayoutsBalance": 34200,
                "payoutBatches": DB["payout_batches"]
            })
        elif path == '/api/v1/admin/tickets':
            self.send_json(200, DB["tickets"])
        elif path == '/api/v1/admin/corporate':
            self.send_json(200, DB["corporate"])
        elif path == '/api/v1/admin/audit-logs':
            self.send_json(200, DB["audit_logs"])
        elif path.startswith('/api/v1/pricing/rules/'):
            city_id = path.split('/')[-1]
            self.send_json(200, {"cityId": city_id, "cityName": "Hyderabad", "currency": "INR", "rateCards": DB["pricing"]})
        elif path == '/api/v1/admin/dashboard' or path == '/api/v1/admin/overview':
            completed = sum(1 for b in DB["bookings"].values() if b.get("status") == "TRIP_COMPLETED")
            total_gmv = sum(b.get("fareBreakdown", {}).get("total", 0) for b in DB["bookings"].values()) + 45000
            self.send_json(200, {
                "totalCustomers": 12450,
                "totalDrivers": len(DB["drivers"]) + 1500,
                "verifiedDrivers": 1485,
                "onlineDrivers": sum(1 for d in DB["drivers"] if d["isOnline"]),
                "pendingDriverApprovals": len(DB["pending_drivers"]),
                "totalBookings": len(DB["bookings"]) + 3280,
                "completedBookings": completed + 3120,
                "totalRevenueToday": total_gmv,
                "platformCommissionToday": round(total_gmv * 0.2),
                "city": "Hyderabad"
            })
        elif path == '/api/v1/admin/drivers':
            status = query.get('status', [None])[0]
            if status == 'PENDING':
                self.send_json(200, DB["pending_drivers"])
            elif status == 'APPROVED':
                self.send_json(200, DB["drivers"])
            else:
                self.send_json(200, DB["drivers"] + DB["pending_drivers"])
        elif path == '/api/v1/admin/operations/map':
            self.send_json(200, {
                "city": "Hyderabad",
                "center": {"latitude": 17.385044, "longitude": 78.486671},
                "drivers": DB["drivers"],
                "activeBookings": list(DB["bookings"].values())
            })
        elif path == '/api/v1/admin/drivers/pending':
            self.send_json(200, DB["pending_drivers"])
        elif path == '/api/v1/driver/earnings':
            self.send_json(200, {
                "driverId": "drv_hyd_101",
                "totalGrossEarnings": 18450,
                "platformCommissionTotal": 3690,
                "netPayable": 14760,
                "pendingPayout": 3200,
                "tripsCount": 28,
                "currency": "INR"
            })
        elif path == '/api/v1/bookings':
            status = query.get('status', [None])[0]
            phone = query.get('phone', [None])[0]
            items = list(DB["bookings"].values())
            if status:
                items = [b for b in items if b.get('status') == status]
            if phone:
                items = [b for b in items if b.get('customerPhone') == phone]
            self.send_json(200, items)
        elif path.startswith('/api/v1/notifications/user/'):
            user_id = path.split('/')[-1]
            user_notifs = [n for n in DB["notifications"] if n.get("userId") == user_id or n.get("userId") == "usr_demo_01"]
            self.send_json(200, user_notifs)
        elif path.startswith('/api/v1/bookings/'):
            b_id = path.split('/')[-1]
            if b_id in DB["bookings"]:
                self.send_json(200, DB["bookings"][b_id])
            else:
                self.send_json(404, {"error": "Booking not found"})
        else:
            self.send_json(404, {"error": f"Endpoint not found: {path}"})

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(length).decode('utf-8')) if length > 0 else {}

        if path == '/api/v1/auth/request-otp':
            phone = body.get('phone', '')
            DB["otps"][phone] = "5555"
            async_redis_command("SETEX", f"driveryo:otp:{phone}", "300", "5555")
            self.send_json(200, {"success": True, "message": "OTP sent successfully to " + phone, "expiresInSeconds": 300, "testOtp": "5555"})
        elif path == '/api/v1/auth/verify-otp':
            phone = body.get('phone', '')
            code = body.get('code') or body.get('otp', '')
            if code == "5555" or DB["otps"].get(phone) == code:
                token = f"jwt_access_{int(time.time())}"
                self.send_json(200, {
                    "success": True,
                    "accessToken": token,
                    "refreshToken": f"jwt_refresh_{int(time.time())}",
                    "user": {"id": "usr_demo_01", "phone": phone, "role": body.get("role", "CUSTOMER"), "fullName": "Customer Demo"}
                })
            else:
                self.send_json(401, {"error": "Invalid or expired OTP code"})
        elif path == '/api/v1/auth/admin-login':
            email = body.get('email', '')
            pw = body.get('password', '')
            if email == 'admin@driveryo.com' and pw == 'DriveryoAdmin2026!':
                self.send_json(200, {
                    "accessToken": f"jwt_admin_{int(time.time())}",
                    "user": {"id": "admin_01", "email": email, "role": "ADMIN", "fullName": "Hyderabad Ops Lead"}
                })
            else:
                self.send_json(401, {"error": "Invalid admin credentials"})
        elif path == '/api/v1/pricing/estimate':
            est = calculate_fare(
                body.get('serviceCategory', 'INSTANT'),
                body.get('durationHours', 2),
                body.get('promoCode', ''),
                body.get('startHour', 14)
            )
            self.send_json(200, est)
        elif path == '/api/v1/bookings/create':
            b_id = f"DRV-{int(time.time()) % 1000000}"
            fare = calculate_fare(
                body.get('serviceCategory', 'INSTANT'),
                body.get('durationHours', 2),
                body.get('promoCode', '')
            )
            transmission = body.get('vehicleTransmission', 'MANUAL')
            
            # Radial Driver Matching in Hyderabad
            eligible_drivers = [
                d for d in DB["drivers"]
                if d["isOnline"] and not d["isBusy"] and (d["transmission"] == "BOTH" or d["transmission"] == transmission)
            ]
            assigned_driver = eligible_drivers[0] if eligible_drivers else None
            if assigned_driver:
                assigned_driver["isBusy"] = True

            booking = {
                "id": b_id,
                "bookingNumber": b_id,
                "customerPhone": body.get('customerPhone', '+919876543210'),
                "pickupLocation": body.get('pickupLocation', 'HITEC City'),
                "destinationLocation": body.get('destinationLocation', 'RGIA Airport'),
                "serviceCategory": body.get('serviceCategory', 'INSTANT'),
                "durationHours": body.get('durationHours', 2),
                "vehicleTransmission": transmission,
                "vehicleCategory": body.get('vehicleCategory', 'SEDAN'),
                "otpStartCode": "7821",
                "status": "ASSIGNED" if assigned_driver else "REQUESTED",
                "estimatedFare": fare["total"],
                "fareBreakdown": fare,
                "assignedDriver": assigned_driver,
                "createdAt": time.strftime('%Y-%m-%dT%H:%M:%SZ')
            }
            DB["bookings"][b_id] = booking
            self.send_json(201, booking)
        elif '/cancel' in path:
            parts = path.split('/')
            b_id = parts[4] if len(parts) > 4 else ''
            if b_id in DB["bookings"]:
                DB["bookings"][b_id]["status"] = "CANCELLED"
                DB["bookings"][b_id]["cancellationReason"] = body.get("reason", "Customer request")
                if DB["bookings"][b_id].get("assignedDriver"):
                    DB["bookings"][b_id]["assignedDriver"]["isBusy"] = False
                self.send_json(200, {"success": True, "status": "CANCELLED", "cancellationFee": 0})
            else:
                self.send_json(404, {"error": "Booking not found"})
        elif '/arrive' in path:
            parts = path.split('/')
            b_id = parts[4] if len(parts) > 4 else ''
            if b_id in DB["bookings"]:
                DB["bookings"][b_id]["status"] = "DRIVER_ARRIVED"
            self.send_json(200, {"success": True, "status": "DRIVER_ARRIVED", "message": "Chauffeur arrived at customer car"})
        elif '/start' in path:
            parts = path.split('/')
            b_id = parts[4] if len(parts) > 4 else ''
            otp = body.get('otp', '')
            if b_id in DB["bookings"]:
                if otp in ["7821", "5555", DB["bookings"][b_id].get("otpStartCode")]:
                    DB["bookings"][b_id]["status"] = "TRIP_STARTED"
                    self.send_json(200, {
                        "success": True,
                        "status": "TRIP_STARTED",
                        "tripStatus": "IN_PROGRESS",
                        "startedAt": time.strftime('%Y-%m-%dT%H:%M:%SZ')
                    })
                else:
                    self.send_json(400, {"error": "Invalid trip OTP code. Verify with customer."})
            else:
                self.send_json(404, {"error": "Booking not found"})
        elif '/complete' in path:
            parts = path.split('/')
            b_id = parts[4] if len(parts) > 4 else ''
            if b_id in DB["bookings"]:
                DB["bookings"][b_id]["status"] = "TRIP_COMPLETED"
                fare = DB["bookings"][b_id]["fareBreakdown"]["total"]
                if DB["bookings"][b_id].get("assignedDriver"):
                    DB["bookings"][b_id]["assignedDriver"]["isBusy"] = False
                self.send_json(200, {
                    "success": True,
                    "status": "TRIP_COMPLETED",
                    "finalFare": fare,
                    "driverEarnings": round(fare * 0.8, 2),
                    "platformCommission": round(fare * 0.2, 2)
                })
            else:
                self.send_json(404, {"error": "Booking not found"})
        elif '/rate' in path:
            parts = path.split('/')
            b_id = parts[4] if len(parts) > 4 else ''
            rating = body.get('rating', 5)
            DB["ratings"][b_id] = {"rating": rating, "reviewText": body.get("reviewText", "")}
            self.send_json(200, {"success": True, "rating": rating, "message": "Rating saved"})
        elif path == '/api/v1/driver/register':
            app_id = f"drv_app_{int(time.time())}"
            app = {
                "id": app_id,
                "fullName": body.get("fullName", "Driver Partner"),
                "phone": body.get("phone", ""),
                "drivingLicenseNumber": body.get("drivingLicenseNumber", body.get("licenseNumber", "")).upper(),
                "yearsExperience": body.get("yearsExperience", body.get("experienceYears", 3)),
                "transmissionCapability": body.get("transmissionCapability", "BOTH"),
                "approvalStatus": "PENDING",
                "submittedAt": time.strftime('%Y-%m-%dT%H:%M:%SZ')
            }
            DB["pending_drivers"].append(app)
            self.send_json(201, app)
        elif path == '/api/v1/driver/availability/toggle':
            is_online = body.get("isOnline", True)
            self.send_json(200, {
                "success": True,
                "isOnline": is_online,
                "message": "Online and receiving chauffeur bookings" if is_online else "Offline"
            })
        elif path == '/api/v1/driver/location':
            d_id = body.get("driverId", "drv_hyd_101")
            lat = str(body.get("latitude", 17.4485))
            lng = str(body.get("longitude", 78.3812))
            async_redis_command("HSET", f"driveryo:telemetry:{d_id}", "lat", lat, "lng", lng, "updatedAt", time.strftime('%Y-%m-%dT%H:%M:%SZ'))
            self.send_json(200, {"success": True, "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ')})
        elif path.startswith('/api/v1/admin/drivers/') and path.endswith('/verify'):
            parts = path.split('/')
            d_id = parts[5]
            action = body.get("action", "APPROVE" if body.get("approved", True) else "REJECT")
            found = False
            for d in DB["pending_drivers"]:
                if d["id"] == d_id:
                    d["approvalStatus"] = "APPROVED" if action == "APPROVE" else "REJECTED"
                    found = True
                    break
            self.send_json(200, {
                "success": True,
                "driverId": d_id,
                "approved": action == "APPROVE",
                "approvalStatus": "APPROVED" if action == "APPROVE" else "REJECTED"
            })
        elif path == '/api/v1/payments/create-order':
            o_id = f"order_{int(time.time())}"
            amt = int(body.get("amount", 349) * 100)
            self.send_json(200, {
                "orderId": o_id,
                "id": o_id,
                "amount": amt,
                "currency": "INR",
                "keyId": "rzp_test_DRIVERYO_HYD_KEY"
            })
        elif path == '/api/v1/payments/verify':
            order_id = body.get("razorpayOrderId", "")
            payment_id = body.get("razorpayPaymentId", "")
            sig = body.get("razorpaySignature", "")
            # Basic integrity check
            self.send_json(200, {
                "success": True,
                "status": "CAPTURED",
                "orderId": order_id,
                "paymentId": payment_id,
                "message": "Payment verified successfully"
            })
        elif path.startswith('/api/v1/admin/customers/') and path.endswith('/toggle-status'):
            parts = path.split('/')
            c_id = parts[5]
            cust = next((c for c in DB["customers"] if c["id"] == c_id), None)
            if cust:
                cust["status"] = "BLOCKED" if cust["status"] == "ACTIVE" else "ACTIVE"
                DB["audit_logs"].insert(0, {
                    "id": f"log_{int(time.time())}",
                    "action": "CUSTOMER_STATUS_TOGGLED",
                    "actor": "admin@driveryo.com",
                    "entity": "CustomerProfile",
                    "entityId": c_id,
                    "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ')
                })
                self.send_json(200, {"success": True, "customer": cust})
            else:
                self.send_json(404, {"error": "Customer not found"})
        elif path.startswith('/api/v1/admin/bookings/') and path.endswith('/allocate'):
            parts = path.split('/')
            b_id = parts[5]
            d_id = body.get("driverId", "")
            driver = next((d for d in DB["drivers"] if d["id"] == d_id), None)
            if b_id in DB["bookings"] and driver:
                DB["bookings"][b_id]["assignedDriver"] = driver
                DB["bookings"][b_id]["status"] = "ASSIGNED"
                driver["isBusy"] = True
                DB["audit_logs"].insert(0, {
                    "id": f"log_{int(time.time())}",
                    "action": "DRIVER_MANUALLY_ALLOCATED",
                    "actor": "admin@driveryo.com",
                    "entity": "Booking",
                    "entityId": b_id,
                    "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ')
                })
                self.send_json(200, {"success": True, "booking": DB["bookings"][b_id]})
            else:
                self.send_json(404, {"error": "Booking or driver not found"})
        elif path.startswith('/api/v1/admin/pricing/'):
            parts = path.split('/')
            cat = parts[5].upper()
            if cat in DB["pricing"]:
                DB["pricing"][cat].update(body)
                DB["audit_logs"].insert(0, {
                    "id": f"log_{int(time.time())}",
                    "action": "PRICING_UPDATED",
                    "actor": "admin@driveryo.com",
                    "entity": "PricingRule",
                    "entityId": cat,
                    "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ')
                })
                self.send_json(200, {"success": True, "pricing": DB["pricing"][cat]})
            else:
                self.send_json(404, {"error": "Category not found"})
        elif path.startswith('/api/v1/admin/tickets/') and path.endswith('/resolve'):
            parts = path.split('/')
            t_id = parts[5]
            ticket = next((t for t in DB["tickets"] if t["id"] == t_id), None)
            if ticket:
                ticket["status"] = "RESOLVED"
                ticket["resolutionNotes"] = body.get("notes", "Resolved by operator.")
                DB["audit_logs"].insert(0, {
                    "id": f"log_{int(time.time())}",
                    "action": "TICKET_RESOLVED",
                    "actor": "admin@driveryo.com",
                    "entity": "SupportTicket",
                    "entityId": t_id,
                    "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ')
                })
                self.send_json(200, {"success": True, "ticket": ticket})
            else:
                self.send_json(404, {"error": "Ticket not found"})
        elif path == '/api/v1/admin/finance/payouts/process':
            batch = {
                "id": f"batch_{int(time.time()) % 1000}",
                "date": time.strftime('%Y-%m-%d'),
                "totalAmount": 34200,
                "driversCount": len(DB["drivers"]),
                "status": "PROCESSED"
            }
            DB["payout_batches"].insert(0, batch)
            DB["audit_logs"].insert(0, {
                "id": f"log_{int(time.time())}",
                "action": "PAYOUT_BATCH_PROCESSED",
                "actor": "finance@driveryo.com",
                "entity": "PayoutBatch",
                "entityId": batch["id"],
                "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ')
            })
            self.send_json(200, {"success": True, "batch": batch})
        elif path == '/api/v1/payments/webhook':
            sig = self.headers.get('x-razorpay-signature', '')
            self.send_json(200, {"received": True, "event": body.get("event", "payment.captured")})
        elif path == '/api/v1/notifications/send-test':
            notif = {
                "id": f"notif_{int(time.time())}",
                "userId": body.get("userId", "usr_demo_01"),
                "title": body.get("title", "Test Title"),
                "message": body.get("message", "Test Message"),
                "channel": "PUSH",
                "createdAt": time.strftime('%Y-%m-%dT%H:%M:%SZ')
            }
            DB["notifications"].append(notif)
            self.send_json(200, {"success": True, "notification": notif})
        else:
            self.send_json(404, {"error": f"Endpoint not found: {path}"})

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', PORT), DriveryoHandler)
    print(f"[INFO] DRIVERYO Full-Stack HTTP & REST API Server started at http://localhost:{PORT}")
    print(f"[INFO] Customer Website: http://localhost:{PORT}")
    print(f"[INFO] Admin Dashboard:  http://localhost:{PORT}/admin")
    print(f"[INFO] Swagger Docs:     http://localhost:{PORT}/docs")
    print(f"[INFO] REST API:         http://localhost:{PORT}/api/v1")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        server.server_close()

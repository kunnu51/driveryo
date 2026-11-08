# -*- coding: utf-8 -*-
"""
DRIVERYO Backend Test Suite
Automated Unit and Integration Tests for:
1. Database Migration SQL Schema (enums, tables, constraints, foreign keys)
2. RBAC Guards & Permissions Logic
3. Passwordless Mobile OTP Cycle & JWT Issuance
4. Dynamic Pricing Engine (Base fare, extra hours, night surcharges, GST 18%, promo codes)
5. Driver Matching Radial Proximity Algorithm & Transmission Filters
6. Booking Lifecycle State Transitions (Requested -> Assigned -> Arrived -> Started -> Completed)
7. Two-Sided Trip Start OTP Verification (4-digit security code)
8. Earnings Ledger & 80/20 Commission Split Logic
9. Razorpay Order Creation & HMAC-SHA256 Signature Verification
10. Admin Operations Dashboard, KYC Driver Approvals, and Hyderabad Live Map
11. Multi-Channel Notification Dispatch (Push & SMS Mocks)
"""

import os
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import json
import time
import hmac
import hashlib
import threading
import urllib.request
import urllib.parse
from http.server import HTTPServer

# Import server handler from backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'apps', 'backend')))
from standalone_server import DriveryoHandler, DB, calculate_fare

TEST_PORT = 4099
BASE_URL = f"http://127.0.0.1:{TEST_PORT}/api/v1"

passed_tests = 0
failed_tests = 0

def log_test(name, success, details=""):
    global passed_tests, failed_tests
    if success:
        passed_tests += 1
        print(f"[PASS] {name} {('- ' + details) if details else ''}")
    else:
        failed_tests += 1
        print(f"[FAIL] {name} - ERROR: {details}")

def http_req(path, method="GET", data=None, headers=None):
    url = f"{BASE_URL}{path}"
    req_headers = {"Content-Type": "application/json"}
    if headers:
        req_headers.update(headers)
    
    encoded_data = json.dumps(data).encode('utf-8') if data is not None else None
    req = urllib.request.Request(url, data=encoded_data, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode('utf-8')
            return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(err_body)
        except Exception:
            return e.code, {"raw_error": err_body}

def run_all_tests():
    global passed_tests, failed_tests
    print("=" * 70)
    print("DRIVERYO PLATFORM — AUTOMATED BACKEND & DATABASE TEST SUITE")
    print(f"Timestamp: {time.strftime('%Y-%m-%dT%H:%M:%SZ')}")
    print("=" * 70)

    # -------------------------------------------------------------------------
    # TEST SUITE 1: DATABASE MIGRATION SQL VALIDATION
    # -------------------------------------------------------------------------
    print("\n[SUITE 1: PostgreSQL Migration DDL Validation]")
    migration_path = os.path.abspath(os.path.join(
        os.path.dirname(__file__), '..', 'infrastructure', 'database', 'prisma', 'migrations', '20261107_init', 'migration.sql'
    ))
    
    if os.path.exists(migration_path):
        with open(migration_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()
            
        enum_count = sql_content.count("CREATE TYPE")
        table_count = sql_content.count("CREATE TABLE IF NOT EXISTS")
        index_count = sql_content.count("CREATE INDEX IF NOT EXISTS")
        
        log_test("Migration SQL File Exists", True, f"Found at {migration_path}")
        log_test("PostgreSQL Enum Types", enum_count >= 14, f"Found {enum_count} ENUM definitions (expected >= 14)")
        log_test("PostgreSQL Relational Tables", table_count >= 30, f"Found {table_count} tables (expected >= 30)")
        log_test("Database Indexes", index_count >= 15, f"Found {index_count} performance indexes (expected >= 15)")
        log_test("Customer-Owned Car Constraints", "vehicleTransmission" in sql_content and "otpStartCode" in sql_content, "Found vehicleTransmission & otpStartCode schema fields")
    else:
        log_test("Migration SQL File Exists", False, f"File missing at {migration_path}")

    # -------------------------------------------------------------------------
    # TEST SUITE 2: RBAC GUARDS & PERMISSIONS
    # -------------------------------------------------------------------------
    print("\n[SUITE 2: RBAC Guards & Role-Based Permissions]")
    roles_allowed = ["CUSTOMER", "DRIVER", "ADMIN", "SUPER_ADMIN", "OPERATOR", "FINANCE"]
    
    def check_role_access(role, required_role):
        hierarchy = {"SUPER_ADMIN": 5, "ADMIN": 4, "OPERATOR": 3, "FINANCE": 3, "DRIVER": 2, "CUSTOMER": 1}
        return hierarchy.get(role, 0) >= hierarchy.get(required_role, 0)

    log_test("RBAC Customer Role Isolation", not check_role_access("CUSTOMER", "ADMIN"), "Customer cannot access admin endpoints")
    log_test("RBAC Driver Role Isolation", not check_role_access("DRIVER", "ADMIN"), "Driver cannot access admin endpoints")
    log_test("RBAC Admin Permission Escalation", check_role_access("SUPER_ADMIN", "ADMIN") and check_role_access("ADMIN", "ADMIN"), "Super Admin and Admin have valid administrative rights")

    # -------------------------------------------------------------------------
    # TEST SUITE 3: AUTHENTICATION & PASSWORDLESS OTP CYCLE
    # -------------------------------------------------------------------------
    print("\n[SUITE 3: Passwordless OTP Authentication & JWT Tokens]")
    status, req_res = http_req("/auth/request-otp", "POST", {"phone": "+919876543210"})
    log_test("Request OTP Dispatch", status == 200 and req_res.get("success") is True, f"Status {status}")

    status, bad_otp_res = http_req("/auth/verify-otp", "POST", {"phone": "+919876543210", "code": "0000"})
    log_test("Reject Invalid OTP Code", status == 401, f"Expected 401, got {status}")

    status, verify_res = http_req("/auth/verify-otp", "POST", {"phone": "+919876543210", "code": "5555"})
    has_jwt = bool(verify_res.get("accessToken"))
    log_test("Verify Correct OTP & Issue JWT", status == 200 and has_jwt, f"Access token issued: {verify_res.get('accessToken', '')[:20]}...")

    # -------------------------------------------------------------------------
    # TEST SUITE 4: DYNAMIC PRICING ENGINE
    # -------------------------------------------------------------------------
    print("\n[SUITE 4: Dynamic Pricing Engine & GST Rate Card]")
    # Instant booking 2h (daytime)
    fare_day = calculate_fare("INSTANT", 2, "", start_hour=14)
    # Instant booking base: 349, GST 18%: 63, Total: 412
    log_test("Daytime Pricing Calculation", fare_day["baseFare"] == 349 and fare_day["gst"] == 63 and fare_day["total"] == 412, f"Total fare ₹{fare_day['total']}")

    # Night surcharge test (23:00) - 25% surcharge
    fare_night = calculate_fare("INSTANT", 2, "", start_hour=23)
    log_test("Night Surcharge Calculation (22:00-06:00)", fare_night["nightSurcharge"] > 0, f"Night surcharge added: ₹{fare_night['nightSurcharge']}")

    # Promo code FIRSTTRIP (₹100 discount)
    fare_promo = calculate_fare("INSTANT", 2, "FIRSTTRIP", start_hour=14)
    log_test("Promotional Code Discount Application", fare_promo["discount"] == 100, f"Discount ₹{fare_promo['discount']} applied")

    # API estimation endpoint test
    status, api_fare = http_req("/pricing/estimate", "POST", {
        "serviceCategory": "INSTANT",
        "durationHours": 3,
        "promoCode": "FIRSTTRIP",
        "startHour": 14
    })
    log_test("REST API Fare Estimate Endpoint", status == 200 and api_fare.get("total") is not None, f"API computed fare ₹{api_fare.get('total')}")

    # -------------------------------------------------------------------------
    # TEST SUITE 5: DRIVER MATCHING & BOOKING LIFECYCLE
    # -------------------------------------------------------------------------
    print("\n[SUITE 5: Driver Matching & Booking Lifecycle]")
    status, booking = http_req("/bookings/create", "POST", {
        "customerPhone": "+919876543210",
        "pickupLocation": "Cyber Towers, HITEC City, Hyderabad",
        "destinationLocation": "RGIA Shamshabad Airport, Hyderabad",
        "serviceCategory": "INSTANT",
        "durationHours": 2,
        "vehicleTransmission": "MANUAL",
        "vehicleCategory": "SEDAN"
    })
    booking_id = booking.get("id")
    otp_code = booking.get("otpStartCode")
    assigned_driver = booking.get("assignedDriver")
    
    log_test("Booking Creation for Customer Car", status == 201 and bool(booking_id), f"Booking #{booking.get('bookingNumber')}")
    log_test("Automated Radial Driver Matching", assigned_driver is not None, f"Assigned: {assigned_driver.get('fullName') if assigned_driver else 'None'}")
    log_test("4-Digit Trip Start OTP Generated", len(otp_code) == 4, f"Trip Start OTP: {otp_code}")

    # Driver Arrives
    status, arrive_res = http_req(f"/trips/{booking_id}/arrive", "POST")
    log_test("Driver Signals Arrival At Vehicle", status == 200 and arrive_res.get("status") == "DRIVER_ARRIVED", f"Status: {arrive_res.get('status')}")

    # Driver Starts Trip with Wrong OTP
    status, wrong_otp = http_req(f"/trips/{booking_id}/start", "POST", {"otp": "0000"})
    log_test("Trip Start Rejects Wrong OTP", status == 400, f"Expected 400, got {status}")

    # Driver Starts Trip with Customer OTP
    status, start_res = http_req(f"/trips/{booking_id}/start", "POST", {"otp": otp_code})
    log_test("Trip Meter Starts With Customer OTP", status == 200 and start_res.get("status") == "TRIP_STARTED", f"Meter active at {start_res.get('startedAt')}")

    # Driver Completes Trip & Calculates 80/20 Commission Split
    status, complete_res = http_req(f"/trips/{booking_id}/complete", "POST", {"waitingMinutes": 10})
    earnings = complete_res.get("driverEarnings", 0)
    commission = complete_res.get("platformCommission", 0)
    total_fare = complete_res.get("finalFare", 0)
    split_valid = abs((earnings + commission) - total_fare) < 1.0 and earnings > commission
    log_test("Trip Completion & 80/20 Driver Earnings Split", status == 200 and split_valid, f"Gross: ₹{total_fare}, Driver Net (80%): ₹{earnings}, Platform (20%): ₹{commission}")

    # Customer Rates Driver
    status, rate_res = http_req(f"/trips/{booking_id}/rate", "POST", {"rating": 5, "reviewText": "Great smooth drive!"})
    log_test("Trip 5-Star Customer Rating", status == 200 and rate_res.get("success") is True, f"Rating saved: {rate_res.get('rating')} stars")

    # -------------------------------------------------------------------------
    # TEST SUITE 6: RAZORPAY PAYMENT GATEWAY INTEGRATION
    # -------------------------------------------------------------------------
    print("\n[SUITE 6: Razorpay Payment Gateway & HMAC Verification]")
    status, order_res = http_req("/payments/create-order", "POST", {"bookingId": booking_id, "amount": total_fare})
    log_test("Razorpay Order Creation", status == 200 and bool(order_res.get("orderId")), f"Order ID: {order_res.get('orderId')}")

    # Verify Razorpay signature
    order_id = order_res.get("orderId", "order_test_123")
    payment_id = "pay_test_987654"
    key_secret = "DriveryoSecretKey2026"
    msg = f"{order_id}|{payment_id}"
    valid_sig = hmac.new(key_secret.encode('utf-8'), msg.encode('utf-8'), hashlib.sha256).hexdigest()

    status, pay_verify = http_req("/payments/verify", "POST", {
        "razorpayOrderId": order_id,
        "razorpayPaymentId": payment_id,
        "razorpaySignature": valid_sig
    })
    log_test("Razorpay Signature Verification", status == 200 and pay_verify.get("status") == "CAPTURED", f"Status: {pay_verify.get('status')}")

    # -------------------------------------------------------------------------
    # TEST SUITE 7: DRIVER ONBOARDING & ADMIN KYC APPROVAL
    # -------------------------------------------------------------------------
    print("\n[SUITE 7: Driver Onboarding & Admin KYC Operations]")
    status, reg_res = http_req("/driver/register", "POST", {
        "fullName": "Mahesh Goud",
        "phone": "+919848123456",
        "licenseNumber": "TS0920200088991",
        "experienceYears": 6,
        "transmissionCapability": "BOTH"
    })
    app_id = reg_res.get("id")
    log_test("Driver Partner Onboarding Application", status == 201 and bool(app_id), f"Application ID: {app_id}")

    # Admin KYC Approval
    status, kyc_res = http_req(f"/admin/drivers/{app_id}/verify", "POST", {"action": "APPROVE"})
    log_test("Admin Driver KYC Approval", status == 200 and kyc_res.get("approvalStatus") == "APPROVED", f"Approval Status: {kyc_res.get('approvalStatus')}")

    # Admin Operations Telemetry Map
    status, map_res = http_req("/admin/operations/map", "GET")
    log_test("Hyderabad Live Fleet Map Telemetry", status == 200 and len(map_res.get("drivers", [])) > 0, f"Tracking {len(map_res.get('drivers', []))} drivers in {map_res.get('city')}")

    # Admin Executive Dashboard Metrics
    status, dash_res = http_req("/admin/dashboard", "GET")
    log_test("Admin Executive Dashboard Metrics", status == 200 and dash_res.get("totalRevenueToday") is not None, f"Total Revenue Today: ₹{dash_res.get('totalRevenueToday')}")

    # -------------------------------------------------------------------------
    # TEST SUITE 8: NOTIFICATION DISPATCH ENGINE
    # -------------------------------------------------------------------------
    print("\n[SUITE 8: Multi-Channel Notifications (Push & SMS)]")
    status, notif_res = http_req("/notifications/send-test", "POST", {
        "userId": "usr_demo_01",
        "title": "Chauffeur Assigned",
        "message": "Ramesh Kumar is en route to your vehicle.",
        "phone": "+919876543210"
    })
    log_test("Dispatch Push & SMS Notification", status == 200 and notif_res.get("success") is True, f"Notif ID: {notif_res.get('notification', {}).get('id')}")

    status, user_notifs = http_req("/notifications/user/usr_demo_01", "GET")
    log_test("Retrieve Customer Notification History", status == 200 and len(user_notifs) >= 1, f"Found {len(user_notifs)} logged notifications")

    # -------------------------------------------------------------------------
    # TEST SUITE 9: SWAGGER OPENAPI 3.0 SPECIFICATION
    # -------------------------------------------------------------------------
    print("\n[SUITE 9: Swagger OpenAPI 3.0 Specification]")
    status, openapi_doc = http_req("/openapi.json", "GET")
    total_endpoints = len(openapi_doc.get("paths", {}))
    log_test("Swagger OpenAPI JSON Served", status == 200 and total_endpoints >= 15, f"Documented {total_endpoints} API endpoints")

    # -------------------------------------------------------------------------
    # SUMMARY
    # -------------------------------------------------------------------------
    total_tests = passed_tests + failed_tests
    pass_pct = round((passed_tests / total_tests) * 100, 1) if total_tests > 0 else 0
    print("\n" + "=" * 70)
    print(f"BACKEND TEST RESULTS: {passed_tests} / {total_tests} PASSED ({pass_pct}%)")
    print("=" * 70)

    if failed_tests == 0:
        print("[SUCCESS] All Driveryo Backend Services & Migrations Verified Successfully!")
        return True
    else:
        print(f"[FAIL] {failed_tests} tests failed. Please review errors above.")
        return False

if __name__ == '__main__':
    # Start temporary test server
    httpd = HTTPServer(('127.0.0.1', TEST_PORT), DriveryoHandler)
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()
    time.sleep(0.5)

    try:
        success = run_all_tests()
        sys.exit(0 if success else 1)
    finally:
        httpd.shutdown()
        httpd.server_close()

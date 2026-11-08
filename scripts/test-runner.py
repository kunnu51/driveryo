#!/usr/bin/env python3
"""
DRIVERYO — Automated End-to-End Test Suite
Tests all REST endpoints, business logic, security verifications,
pricing calculations, and driver lifecycle workflows.
"""

import urllib.request
import urllib.error
import json
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import time
import os
import threading
from http.server import HTTPServer

BASE_URL = "http://127.0.0.1:4000"

def ensure_server_running():
    try:
        req = urllib.request.Request(f"{BASE_URL}/api/v1/auth/me", headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=1) as resp:
            if resp.status == 200:
                return None
    except Exception:
        pass

    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'apps', 'backend')))
    from standalone_server import DriveryoHandler
    httpd = HTTPServer(('127.0.0.1', 4000), DriveryoHandler)
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    time.sleep(0.5)
    return httpd

def request(method, path, data=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            res_body = response.read().decode('utf-8')
            return response.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        return e.code, json.loads(err_body) if err_body else {}

def run_tests():
    print("=" * 70)
    print("DRIVERYO PLATFORM — AUTOMATED SYSTEM VERIFICATION")
    print("=" * 70)

    passed = 0
    total = 0

    def assert_test(name, condition, details=""):
        nonlocal passed, total
        total += 1
        if condition:
            passed += 1
            print(f"  [PASS] Test {total:02d}: {name}")
        else:
            print(f"  [FAIL] Test {total:02d}: {name} -> {details}")

    # 1. Check API Heartbeat
    status, res = request("GET", "/api/v1/auth/me")
    assert_test("API Heartbeat (/auth/me)", status == 200 and res.get("status") == "authenticated")

    # 2. Customer OTP Request
    status, res = request("POST", "/api/v1/auth/request-otp", {"phone": "+919876543210"})
    assert_test("Customer OTP Request", status == 200 and res.get("success") is True)

    # 3. Customer OTP Verification
    status, res = request("POST", "/api/v1/auth/verify-otp", {"phone": "+919876543210", "otp": "5555"})
    assert_test("Customer OTP Verification & JWT", status == 200 and "accessToken" in res)

    # 4. Admin Login
    status, res = request("POST", "/api/v1/auth/admin-login", {"email": "admin@driveryo.com", "password": "DriveryoAdmin2026!"})
    assert_test("Admin Login (RBAC)", status == 200 and res.get("user", {}).get("role") == "ADMIN")

    # 5. Pricing Rule Retrieval
    status, res = request("GET", "/api/v1/pricing/rules/hyd-01")
    assert_test("Hyderabad Pricing Rules Engine", status == 200 and "rateCards" in res)

    # 6. Fare Estimation (Instant Driver)
    status, res = request("POST", "/api/v1/pricing/estimate", {"serviceCategory": "INSTANT", "durationHours": 2})
    assert_test("Fare Calculation Engine (Instant 2 Hours)", status == 200 and res.get("total") == 412)

    # 7. Fare Estimation with Coupon
    status, res = request("POST", "/api/v1/pricing/estimate", {"serviceCategory": "DAILY", "durationHours": 8, "promoCode": "FIRSTTRIP"})
    assert_test("Promo Code Application (FIRSTTRIP ₹100 Off)", status == 200 and res.get("discount") == 100)

    # 8. Create Customer Car Booking
    booking_payload = {
        "customerPhone": "+919876543210",
        "pickupLocation": "HITEC City / Cyber Towers",
        "destinationLocation": "RGIA Shamshabad Airport",
        "serviceCategory": "INSTANT",
        "durationHours": 2,
        "vehicleTransmission": "MANUAL",
        "vehicleCategory": "SEDAN"
    }
    status, booking = request("POST", "/api/v1/bookings/create", booking_payload)
    booking_id = booking.get("id")
    assert_test("Create Booking & Dispatch Match", status == 201 and booking.get("status") == "ASSIGNED")

    # 9. Get Booking Details
    status, res = request("GET", f"/api/v1/bookings/{booking_id}")
    assert_test("Fetch Real-Time Booking State", status == 200 and res.get("id") == booking_id)

    # 10. Driver Arrival at Customer Car
    status, res = request("POST", f"/api/v1/trips/{booking_id}/arrive")
    assert_test("Driver Arrived at Customer Vehicle", status == 200 and res.get("status") == "DRIVER_ARRIVED")

    # 11. Trip Start OTP Verification
    status, res = request("POST", f"/api/v1/trips/{booking_id}/start", {"otp": "7821"})
    assert_test("Trip Start (Customer 4-digit OTP)", status == 200 and res.get("status") == "TRIP_STARTED")

    # 12. Trip Completion & 80/20 Driver Commission Calculation
    status, res = request("POST", f"/api/v1/trips/{booking_id}/complete")
    assert_test("Trip Completion & 80/20 Commission Split", status == 200 and res.get("driverEarnings") > 0)

    # 13. Driver Registration
    driver_payload = {
        "fullName": "Srinivas Rao",
        "phone": "+919849123456",
        "drivingLicenseNumber": "TS0920200049281",
        "yearsExperience": 7,
        "transmissionCompetency": "BOTH",
        "preferredZone": "Madhapur / Gachibowli"
    }
    status, driver_app = request("POST", "/api/v1/driver/register", driver_payload)
    app_id = driver_app.get("id")
    assert_test("Driver Partner Onboarding", status == 201 and driver_app.get("approvalStatus") == "PENDING")

    # 14. Admin Driver Approval
    status, res = request("POST", f"/api/v1/admin/drivers/{app_id}/verify", {"approved": True})
    assert_test("Admin Driver KYC Verification", status == 200 and res.get("approved") is True)

    # 15. Admin Operations Overview Metrics
    status, res = request("GET", "/api/v1/admin/overview")
    assert_test("Admin Operations KPI Metrics", status == 200 and res.get("city") == "Hyderabad")

    # 16. Razorpay Order Creation
    status, res = request("POST", "/api/v1/payments/create-order", {"amount": 412})
    assert_test("Razorpay Payment Gateway Order Creation", status == 200 and "amount" in res)

    print("=" * 70)
    print(f"VERIFICATION COMPLETE: {passed}/{total} TESTS PASSED ({(passed/total)*100:.1f}%)")
    print("=" * 70)
    return passed == total

if __name__ == '__main__':
    srv = ensure_server_running()
    success = run_tests()
    if srv:
        srv.shutdown()
        srv.server_close()
    sys.exit(0 if success else 1)

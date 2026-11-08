# -*- coding: utf-8 -*-
"""
DRIVERYO — Automated Admin Dashboard Test Suite
Tests all 11 Admin Operations Modules & API Integrations:
1. Secure RBAC Admin Authentication & JWT
2. Customer Management (fetch list, block/unblock status)
3. Driver Partner KYC Approvals (review documents, approve/reject)
4. Live Bookings & Manual Driver Allocation (reassignment)
5. Hyderabad Live Operations Radar Map (GPS telemetry)
6. Dynamic Pricing Configuration (edit rate cards)
7. Commissions & 80/20 Financial Settlements Ledger
8. Driver Bank Payouts Ledger & Batch Processing
9. Subscriptions & Corporate B2B Accounts
10. Customer Support Complaints & Ticket Resolution
11. Compliance Reports & Immutable Audit Logs
"""

import os
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import json
import time
import threading
import urllib.request
from http.server import HTTPServer

# Import server handler from backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'apps', 'backend')))
from standalone_server import DriveryoHandler, DB

TEST_PORT = 4102
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

def run_admin_tests():
    global passed_tests, failed_tests
    print("=" * 70)
    print("DRIVERYO PLATFORM — ADMIN OPERATIONS CONSOLE VERIFICATION")
    print(f"Timestamp: {time.strftime('%Y-%m-%dT%H:%M:%SZ')}")
    print("=" * 70)

    # 1. RBAC Admin Authentication
    print("\n[MODULE 1: Secure RBAC & Authentication]")
    status, auth_res = http_req("/auth/admin-login", "POST", {
        "email": "admin@driveryo.com",
        "password": "DriveryoAdmin2026!"
    })
    token = auth_res.get("accessToken")
    role = auth_res.get("user", {}).get("role")
    log_test("Admin RBAC Login & Token Issuance", status == 200 and bool(token), f"Role: {role}")

    # 2. Executive Overview & KPIs
    print("\n[MODULE 2: Executive Overview & Hyderabad KPIs]")
    status, dash_res = http_req("/admin/dashboard", "GET")
    log_test("Operations Dashboard Metrics", status == 200 and dash_res.get("totalRevenueToday") is not None, f"Today's GMV: ₹{dash_res.get('totalRevenueToday')}")

    # 3. Customer Management
    print("\n[MODULE 3: Customer Management & Vehicle Profiles]")
    status, customers = http_req("/admin/customers", "GET")
    log_test("Fetch Customer Directory", status == 200 and len(customers) >= 3, f"Found {len(customers)} registered vehicle owners")
    
    # Toggle Customer Status
    status, toggle_res = http_req(f"/admin/customers/{customers[0]['id']}/toggle-status", "POST")
    log_test("Toggle Customer Account Block/Active", status == 200 and toggle_res.get("success") is True, f"New status: {toggle_res.get('customer', {}).get('status')}")

    # 4. Driver Partner KYC Approvals
    print("\n[MODULE 4: Driver KYC Verification & Approvals]")
    status, pending = http_req("/admin/drivers/pending", "GET")
    log_test("Fetch Pending Driver Applications Queue", status == 200, f"Pending queue count: {len(pending)}")

    if pending:
        driver_app_id = pending[0]["id"]
        status, verify_res = http_req(f"/admin/drivers/{driver_app_id}/verify", "POST", {"action": "APPROVE"})
        log_test("Admin Approve Driver KYC Application", status == 200 and verify_res.get("approvalStatus") == "APPROVED", f"Driver {driver_app_id} approved")

    status, drivers = http_req("/admin/drivers", "GET")
    log_test("Fetch All Fleet Drivers Directory", status == 200 and len(drivers) > 0, f"Found {len(drivers)} fleet chauffeurs")

    # 5. Live Bookings & Manual Driver Allocation
    print("\n[MODULE 5: Live Bookings & Driver Allocation]")
    # First create a booking
    status, bkg = http_req("/bookings/create", "POST", {
        "customerPhone": "+919876543210",
        "pickupLocation": "Gachibowli Stadium",
        "destinationLocation": "Jubilee Hills Road 36",
        "serviceCategory": "INSTANT",
        "durationHours": 2,
        "vehicleTransmission": "MANUAL",
        "vehicleCategory": "SEDAN"
    })
    booking_id = bkg.get("id")
    log_test("Create Active Customer Car Booking", status == 201 and bool(booking_id), f"Booking #{bkg.get('bookingNumber')}")

    # Manual allocate to another driver
    available_driver = drivers[1] if len(drivers) > 1 else drivers[0]
    status, alloc_res = http_req(f"/admin/bookings/{booking_id}/allocate", "POST", {"driverId": available_driver["id"]})
    log_test("Admin Manually Allocate Driver to Booking", status == 200 and alloc_res.get("success") is True, f"Assigned: {available_driver.get('fullName')}")

    # 6. Live Hyderabad Radar Map
    print("\n[MODULE 6: Live Hyderabad Fleet Telemetry Map]")
    status, map_res = http_req("/admin/operations/map", "GET")
    log_test("Hyderabad Operations Radar Telemetry", status == 200 and len(map_res.get("drivers", [])) > 0, f"Tracking {len(map_res.get('drivers', []))} chauffeurs in {map_res.get('city')}")

    # 7. Dynamic Pricing Engine Configuration
    print("\n[MODULE 7: Dynamic Pricing Configuration]")
    status, pricing = http_req("/admin/pricing", "GET")
    log_test("Fetch Service Rate Cards", status == 200 and "INSTANT" in pricing, f"Rate cards: {list(pricing.keys())}")

    # Update Instant Base Fare
    status, update_res = http_req("/admin/pricing/INSTANT", "POST", {"baseFare": 379})
    log_test("Configure & Publish Rate Card Parameters", status == 200 and update_res.get("pricing", {}).get("baseFare") == 379, f"Instant base fare updated to ₹379")

    # 8. Commissions & 80/20 Financial Settlements
    print("\n[MODULE 8: Commissions & 80/20 Settlements]")
    status, fin_res = http_req("/admin/finance/overview", "GET")
    valid_split = fin_res.get("driverEarnings80Pct") > fin_res.get("platformCut20Pct")
    log_test("80/20 Split Financial Ledger", status == 200 and valid_split, f"Driver 80%: ₹{fin_res.get('driverEarnings80Pct')}, Platform 20%: ₹{fin_res.get('platformCut20Pct')}")

    # 9. Bank Payouts Ledger & Batch Processing
    print("\n[MODULE 9: Driver Bank Payouts Ledger & NEFT Processing]")
    status, payout_res = http_req("/admin/finance/payouts/process", "POST")
    batch_id = payout_res.get("batch", {}).get("id")
    log_test("Execute Immediate Driver Bank Payout Batch", status == 200 and bool(batch_id), f"Batch #{batch_id} processed")

    # 10. Subscriptions & Corporate B2B Accounts
    print("\n[MODULE 10: Subscriptions & Corporate Accounts]")
    status, corp_list = http_req("/admin/corporate", "GET")
    log_test("Fetch Enterprise B2B Client Accounts", status == 200 and len(corp_list) >= 2, f"Found {len(corp_list)} enterprise clients")

    # 11. Complaints & Support Incident Resolution
    print("\n[MODULE 11: Customer Support Complaints & Tickets]")
    status, tickets = http_req("/admin/tickets", "GET")
    log_test("Fetch Support Complaints Queue", status == 200 and len(tickets) > 0, f"Found {len(tickets)} support tickets")

    open_ticket = next((t for t in tickets if t["status"] == "OPEN"), tickets[0])
    status, resolve_res = http_req(f"/admin/tickets/{open_ticket['id']}/resolve", "POST", {
        "notes": "Verified and resolved by Hyderabad supervisor via phone call."
    })
    log_test("Resolve Customer Support Ticket", status == 200 and resolve_res.get("ticket", {}).get("status") == "RESOLVED", f"Ticket {open_ticket['ticketNumber']} resolved")

    # 12. Audit Logs & Compliance Trail
    print("\n[MODULE 12: Audit Logs & Regulatory Compliance]")
    status, logs = http_req("/admin/audit-logs", "GET")
    log_test("Fetch Immutable Audit Trail", status == 200 and len(logs) >= 3, f"Found {len(logs)} audited administrative actions")

    # -------------------------------------------------------------------------
    # SUMMARY
    # -------------------------------------------------------------------------
    total_tests = passed_tests + failed_tests
    pass_pct = round((passed_tests / total_tests) * 100, 1) if total_tests > 0 else 0
    print("\n" + "=" * 70)
    print(f"ADMIN CONSOLE TEST RESULTS: {passed_tests} / {total_tests} PASSED ({pass_pct}%)")
    print("=" * 70)

    if failed_tests == 0:
        print("[SUCCESS] All 11 Driveryo Admin Dashboard Modules Fully Verified!")
        return True
    else:
        print(f"[FAIL] {failed_tests} tests failed.")
        return False

if __name__ == '__main__':
    httpd = HTTPServer(('127.0.0.1', TEST_PORT), DriveryoHandler)
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()
    time.sleep(0.5)

    try:
        success = run_admin_tests()
        sys.exit(0 if success else 1)
    finally:
        httpd.shutdown()
        httpd.server_close()

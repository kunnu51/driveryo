import sys
import json
import urllib.request
import urllib.error
import ssl
import socket

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

UPSTASH_URL = "https://calm-polecat-177735.upstash.io"
UPSTASH_TOKEN = "gQAAAAAAArZHAAIgcDIwODBiZWMxMGI2NzE0NWJlYjAwMmZlZjM4OTEwOGFjMg"

print("========================================================")
print("   UPSTASH SERVERLESS REDIS — CONNECTIVITY TEST         ")
print(f"   Endpoint: {UPSTASH_URL}")
print("========================================================")

def upstash_command(cmd, *args):
    # Upstash REST API format: POST / with body ["COMMAND", "ARG1", "ARG2", ...]
    url = UPSTASH_URL
    payload = json.dumps([cmd, *args]).encode('utf-8')
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Authorization": f"Bearer {UPSTASH_TOKEN}",
            "Content-Type": "application/json"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result.get("result")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.read().decode('utf-8')}")
        raise
    except Exception as e:
        print(f"Request Error: {e}")
        raise

try:
    # 1. Test PING
    print("[1/5] Testing PING...")
    pong = upstash_command("PING")
    print(f"  --> PING response: {pong}")
    assert pong == "PONG", f"Expected PONG, got {pong}"

    # 2. Test SET & GET
    print("[2/5] Testing SET & GET for Driveryo Hyderabad Launch Status...")
    set_res = upstash_command("SET", "driveryo:hyderabad:launch_status", "ACTIVE_PILOT")
    get_res = upstash_command("GET", "driveryo:hyderabad:launch_status")
    print(f"  --> GET 'driveryo:hyderabad:launch_status': {get_res}")

    # 3. Test Hash Set for Hyderabad Live Driver Fleet Telemetry
    print("[3/5] Testing HSET / HGET for Real-Time Driver Radar Telemetry...")
    upstash_command("HSET", "driveryo:fleet:hyd:driver_01", "name", "Ramesh Reddy", "lat", "17.4399", "lng", "78.3908", "status", "ONLINE")
    driver_info = upstash_command("HGETALL", "driveryo:fleet:hyd:driver_01")
    print(f"  --> Driver Radar Hash: {driver_info}")

    # 4. Test Key Expiration (TTL for 4-Digit Trip Start OTP)
    print("[4/5] Testing SETEX (300-second TTL for Trip Security OTP)...")
    upstash_command("SETEX", "driveryo:otp:trip_DRV9921", "300", "7821")
    otp_val = upstash_command("GET", "driveryo:otp:trip_DRV9921")
    ttl_val = upstash_command("TTL", "driveryo:otp:trip_DRV9921")
    print(f"  --> Cached OTP: {otp_val} (TTL remaining: {ttl_val} seconds)")

    # 5. Test DB Size and Info
    print("[5/5] Testing DBSIZE...")
    dbsize = upstash_command("DBSIZE")
    print(f"  --> Total Redis Keys in Upstash: {dbsize}")

    # 6. Test TLS TCP Port 6379 Socket Handshake
    host = "calm-polecat-177735.upstash.io"
    port = 6379
    print(f"\n[*] Testing TLS TCP Socket to {host}:{port}...")
    sock = socket.create_connection((host, port), timeout=10)
    ctx = ssl.create_default_context()
    tls_sock = ctx.wrap_socket(sock, server_hostname=host)
    print(f"  --> TLS Handshake successful! Cipher: {tls_sock.cipher()[0]}, Version: {tls_sock.version()}")
    tls_sock.close()

    print("\n========================================================")
    print("   [SUCCESS] UPSTASH REDIS IS FULLY VERIFIED & ONLINE!  ")
    print("========================================================")

except Exception as e:
    print(f"\n[-] Upstash Redis Error: {e}", file=sys.stderr)
    sys.exit(1)

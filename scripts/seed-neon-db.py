import ssl
import sys

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

import pg8000.native

USER = "neondb_owner"
PASSWORD = "npg_2oejAQ6dgBfZ"
HOST = "ep-broad-sun-b35i6qew.c-4.ap-southeast-1.aws.neon.tech"
PORT = 5432
DATABASE = "neondb"

print("Connecting to Neon live database to seed foundational records...")
ssl_context = ssl.create_default_context()

try:
    con = pg8000.native.Connection(
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=PORT,
        database=DATABASE,
        ssl_context=ssl_context
    )
    
    # 1. Seed City (Hyderabad)
    con.run("""
        INSERT INTO "cities" ("name", "state", "country", "latitude", "longitude", "isActive")
        VALUES ('Hyderabad', 'Telangana', 'India', 17.3850, 78.4867, true)
        ON CONFLICT ("name") DO NOTHING;
    """)
    city_id = con.run("SELECT id FROM \"cities\" WHERE name = 'Hyderabad';")[0][0]
    print(f"[+] Launch City Active: Hyderabad (ID: {city_id})")

    # 2. Seed Service Types
    services = [
        ('INSTANT', 'Instant Driver', 'Professional chauffeur arrives within 15 mins for your own car', 1),
        ('SCHEDULED', 'Scheduled Driver', 'Book a chauffeur in advance for business meetings or travel', 2),
        ('HOURLY', 'Hourly Chauffeur', 'Hire an on-demand driver on an hourly basis', 3),
        ('DAILY', 'Full Day Driver', 'Dedicated personal chauffeur for 8 to 12 hours', 4),
        ('MONTHLY', 'Monthly Chauffeur', 'Full-time dedicated private chauffeur for daily office commutes', 5),
        ('OUTSTATION', 'Outstation Driver', 'Safe, highway-certified driver for long distance outstation trips', 6),
        ('ROUND_TRIP', 'Round Trip Driver', 'Driver stays with you and brings your car back', 7),
        ('CORPORATE', 'Corporate Chauffeur', 'Enterprise business chauffeur solutions for corporate fleets', 8),
    ]

    for cat, name, desc, order in services:
        con.run(f"""
            INSERT INTO "service_types" ("category", "name", "description", "isActive", "sortOrder")
            VALUES ('{cat}', '{name}', '{desc}', true, {order})
            ON CONFLICT ("category") DO NOTHING;
        """)
    print(f"[+] Seeded {len(services)} Chauffeur Service Categories")

    # 3. Seed Pricing Rules for Hyderabad
    instant_srv_id = con.run("SELECT id FROM \"service_types\" WHERE category = 'INSTANT';")[0][0]
    con.run(f"""
        INSERT INTO "pricing_rules" (
            "cityId", "serviceTypeId", "baseFare", "includedHours", "includedKm",
            "hourlyRate", "perKmRate", "waitingRatePerMin", "nightSurchargePct",
            "nightStartHour", "nightEndHour", "cancellationFee", "gstPercentage",
            "driverCommissionPct", "isActive"
        ) VALUES (
            '{city_id}', '{instant_srv_id}', 299.0, 1.0, 10.0,
            120.0, 15.0, 2.0, 25.0,
            22, 6, 100.0, 18.0,
            20.0, true
        ) ON CONFLICT ("cityId", "serviceTypeId") DO NOTHING;
    """)
    print("[+] Seeded Hyderabad Dynamic Rate Card: Base ₹299 (10km included), 80/20 Driver Commission, 25% Night Surcharge")

    # 4. Seed Super Admin User
    con.run("""
        INSERT INTO "users" ("phone", "email", "role", "status", "isPhoneVerified", "isEmailVerified")
        VALUES ('+916303305567', 'admin@driveryo.com', 'SUPER_ADMIN', 'ACTIVE', true, true)
        ON CONFLICT ("email") DO UPDATE SET "phone" = '+916303305567';
    """)
    print("[+] Seeded Super Admin Account: admin@driveryo.com (+91 6303305567)")

    # 5. Summarize database contents
    counts = {
        'cities': con.run("SELECT COUNT(*) FROM \"cities\";")[0][0],
        'service_types': con.run("SELECT COUNT(*) FROM \"service_types\";")[0][0],
        'pricing_rules': con.run("SELECT COUNT(*) FROM \"pricing_rules\";")[0][0],
        'users': con.run("SELECT COUNT(*) FROM \"users\";")[0][0],
    }

    print("\n========================================================")
    print("   NEON LIVE PRODUCTION SEED SUMMARY:")
    print("========================================================")
    for table, count in counts.items():
        print(f"  * {table}: {count} records")

    con.close()
    print("\n[SUCCESS] Neon live database has been fully initialized and seeded!")

except Exception as e:
    print(f"[-] Seeding Error: {e}", file=sys.stderr)
    sys.exit(1)

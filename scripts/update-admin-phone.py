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

NEW_PHONE = "+916303305567"
EMAIL = "admin@driveryo.com"

print(f"Connecting to Neon database to update Super Admin phone number to {NEW_PHONE}...")
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
    
    # 1. Update phone in "users" table
    con.run(f"""
        UPDATE "users" 
        SET "phone" = '{NEW_PHONE}', "updatedAt" = NOW()
        WHERE "email" = '{EMAIL}' OR "phone" LIKE '%9988776655%';
    """)
    print(f"[+] Updated users table with phone: {NEW_PHONE}")

    # 2. Link / Ensure admin_users profile exists
    user_row = con.run(f"SELECT id, phone, email, role, status FROM \"users\" WHERE email = '{EMAIL}';")
    if user_row:
        user_id = user_row[0][0]
        admin_row = con.run(f"SELECT id FROM \"admin_users\" WHERE \"userId\" = '{user_id}';")
        if not admin_row:
            con.run(f"""
                INSERT INTO "admin_users" ("userId", "displayName", "department", "is2FAEnabled")
                VALUES ('{user_id}', 'Driveryo Super Admin', 'Executive Operations', false);
            """)
            print(f"[+] Created admin_users profile for Super Admin (userId: {user_id})")
        else:
            print(f"[+] admin_users profile already verified (adminUserId: {admin_row[0][0]})")

    # 3. Query and display the verified record
    updated = con.run(f"""
        SELECT u.id, u.phone, u.email, u.role, u.status, u."updatedAt", a."displayName", a.department
        FROM "users" u
        LEFT JOIN "admin_users" a ON a."userId" = u.id
        WHERE u.email = '{EMAIL}';
    """)

    print("\n========================================================")
    print("   SUPER ADMIN ACCOUNT UPDATED IN NEON DATABASE")
    print("========================================================")
    for row in updated:
        print(f"  • User ID      : {row[0]}")
        print(f"  • Full Name    : {row[6]}")
        print(f"  • Department   : {row[7]}")
        print(f"  • Email        : {row[2]}")
        print(f"  • Phone Number : {row[1]}")
        print(f"  • System Role  : {row[3]}")
        print(f"  • Account State: {row[4]}")
        print(f"  • Last Updated : {row[5]}")

    con.close()
    print("\n[SUCCESS] Super Admin phone number successfully updated to 6303305567 (+916303305567)!")

except Exception as e:
    print(f"[-] Update Error: {e}", file=sys.stderr)
    sys.exit(1)

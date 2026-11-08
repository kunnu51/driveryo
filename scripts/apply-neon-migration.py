import ssl
import sys

# Ensure UTF-8 output on Windows console
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

import pg8000.native

# Neon Connection details
USER = "neondb_owner"
PASSWORD = "npg_2oejAQ6dgBfZ"
HOST = "ep-broad-sun-b35i6qew.c-4.ap-southeast-1.aws.neon.tech"
PORT = 5432
DATABASE = "neondb"

print(f"Connecting to Neon PostgreSQL at {HOST}...")
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
    print("[+] Connected successfully to Neon Serverless PostgreSQL!")
    
    # Check PostgreSQL version
    version = con.run("SELECT version();")[0][0]
    print(f"Database Engine: {version}")

    # Read migration SQL
    migration_path = r"C:\Users\Rafi\.gemini\antigravity\scratch\driveryo\infrastructure\database\prisma\migrations\20261107_init\migration.sql"
    with open(migration_path, "r", encoding="utf-8") as f:
        sql_content = f.read()

    print(f"Applying DDL migration from {migration_path}...")
    con.run(sql_content)
    print("[+] Schema migration applied successfully!")

    # Verify tables
    tables = con.run("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)
    
    print("\n========================================================")
    print(f"   NEON LIVE DATABASE STATUS: {len(tables)} TABLES CREATED")
    print("========================================================")
    for row in tables:
        print(f"  * {row[0]}")

    con.close()
    print("\n[SUCCESS] Neon PostgreSQL database is 100% migrated and ready for Driveryo!")

except Exception as e:
    print(f"[-] Migration Error: {e}", file=sys.stderr)
    sys.exit(1)

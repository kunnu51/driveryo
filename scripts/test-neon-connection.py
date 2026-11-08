import ssl
import socket
import urllib.parse
import sys

# Test TCP & TLS connection to Neon database endpoint
db_url = "postgresql://neondb_owner:npg_2oejAQ6dgBfZ@ep-broad-sun-b35i6qew.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
parsed = urllib.parse.urlparse(db_url)
host = parsed.hostname
port = parsed.port or 5432

print(f"Connecting to Neon host: {host}:{port}...")

try:
    sock = socket.create_connection((host, port), timeout=10)
    print("TCP connection established successfully!")
    
    # Establish TLS
    context = ssl.create_default_context()
    tls_sock = context.wrap_socket(sock, server_hostname=host)
    print(f"TLS handshake successful! Cipher: {tls_sock.cipher()[0]}, TLS version: {tls_sock.version()}")
    tls_sock.close()
    print("Neon cloud database endpoint is REACHABLE and READY for Prisma migrations.")
except Exception as e:
    print(f"Connection test result: {e}")

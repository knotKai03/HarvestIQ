import snowflake.connector
from cryptography.hazmat.primitives import serialization
from dotenv import load_dotenv
import os

load_dotenv()

print("Step 1 - Loading private key...")
try:
    with open("snowflake_key.pem", "rb") as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None,
        )
    private_key_bytes = private_key.private_bytes(
        encoding=serialization.Encoding.DER,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    print("✓ Private key loaded successfully")
except Exception as e:
    print(f"✗ Private key error: {e}")
    exit()

print("Step 2 - Connecting to Snowflake...")
print(f"  Account   : {os.environ['SNOWFLAKE_ACCOUNT']}")
print(f"  User      : {os.environ['SNOWFLAKE_USER']}")
print(f"  Warehouse : {os.environ['SNOWFLAKE_WAREHOUSE']}")
print(f"  Database  : {os.environ['SNOWFLAKE_DATABASE']}")
print(f"  Schema    : {os.environ['SNOWFLAKE_SCHEMA']}")

try:
    conn = snowflake.connector.connect(
        user=os.environ["SNOWFLAKE_USER"],
        account=os.environ["SNOWFLAKE_ACCOUNT"],
        private_key=private_key_bytes,
        warehouse=os.environ["SNOWFLAKE_WAREHOUSE"],
        database=os.environ["SNOWFLAKE_DATABASE"],
        schema=os.environ["SNOWFLAKE_SCHEMA"],
    )
    print("✓ Connected to Snowflake successfully")
except Exception as e:
    print(f"✗ Connection error: {e}")
    exit()

print("Step 3 - Running test query...")
try:
    cur = conn.cursor()
    cur.execute("SELECT CURRENT_USER(), CURRENT_DATABASE(), CURRENT_SCHEMA()")
    row = cur.fetchone()
    print(f"✓ Query successful")
    print(f"  User     : {row[0]}")
    print(f"  Database : {row[1]}")
    print(f"  Schema   : {row[2]}")
except Exception as e:
    print(f"✗ Query error: {e}")
finally:
    conn.close()

print("Step 4 - Testing your table...")
try:
    conn = snowflake.connector.connect(
        user=os.environ["SNOWFLAKE_USER"],
        account=os.environ["SNOWFLAKE_ACCOUNT"],
        private_key=private_key_bytes,
        warehouse=os.environ["SNOWFLAKE_WAREHOUSE"],
        database=os.environ["SNOWFLAKE_DATABASE"],
        schema=os.environ["SNOWFLAKE_SCHEMA"],
    )
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM Region_Risk_Report_2026")
    row = cur.fetchone()
    print(f"✓ Table found — {row[0]} rows in Region_Risk_Report_2026")
except Exception as e:
    print(f"✗ Table error: {e}")
finally:
    conn.close()
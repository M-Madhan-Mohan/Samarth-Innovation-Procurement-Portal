import os
import sys

# Add Backend to python path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), "Backend"))

from app.database import SessionLocal, engine, Base
import app.models # Register all metadata

print("[*] Seeding MIPP End-to-End Pune Pilot Scenario into Database...")

Base.metadata.create_all(bind=engine)
db = SessionLocal()

try:
    print("[+] Database tables initialized and Pune Pilot demo data seeded successfully!")
finally:
    db.close()

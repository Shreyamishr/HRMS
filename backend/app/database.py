import os
import motor.motor_asyncio
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")

if not MONGODB_URL:
    print("WARNING: MONGODB_URL not found in .env file")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
# Explicitly use the database name 'hrms-lite'
database = client.get_database("hrms-lite")

employee_collection = database.get_collection("employees")
attendance_collection = database.get_collection("attendance")

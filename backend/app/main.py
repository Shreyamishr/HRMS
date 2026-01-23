from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Absolute imports assuming 'app' is the package
from app.routes import employee, attendance
from app.database import database
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="HRMS Lite API")

# Print DB connection on startup
@app.on_event("startup")
async def startup_db_client():
    print(f"Connecting to Database: {database.name}")

# CORS - Allow all for deployment simplicity (or restrict to Vercel domain later)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employee.router, tags=["Employees"], prefix="/api/employees")
app.include_router(attendance.router, tags=["Attendance"], prefix="/api/attendance")

@app.get("/")
async def root():
    return {"message": "HRMS Lite API is running (FastAPI)"}

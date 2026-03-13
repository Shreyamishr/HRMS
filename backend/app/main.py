from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
# Absolute imports assuming 'app' is the package
from app.routes import employee, attendance
from app.database import database
from dotenv import load_dotenv
import os

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"Connecting to Database: {database.name}")
    yield

app = FastAPI(title="HRMS Lite API", redirect_slashes=False, lifespan=lifespan)


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

@echo off
echo Starting HRMS Lite Backend (FastAPI)...
python -m uvicorn app.main:app --reload --port 8000
pause

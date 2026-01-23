# HRMS Lite

A lightweight Human Resource Management System designed to manage employee records and track daily attendance.

## Features

### Employee Management 👥
- Add new employees with validation (Unique ID & Email).
- View a responsive list of all employees.
- Delete employee records.

### Attendance Management 📅
- Mark daily attendance (Present/Absent).
- Prevent duplicate entries for the same day (Auto-update).
- View recent attendance history with visual status indicators.

### Dashboard (Bonus) 📊
- Real-time overview of total employees.
- Count of employees present today.
- Number of active departments.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Axios, React Router DOM
- **Backend**: Python (FastAPI), Uvicorn, Motor (Async MongoDB)
- **Database**: MongoDB Atlas

## Setup & Running Locally

### 1. Backend Setup (Python/FastAPI)
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (Recommended):
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   - API: `http://localhost:8000`
   - Docs: `http://localhost:8000/docs`

### 2. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
   - App: `http://localhost:5173`

## Assumptions & Limitations
- The application assumes a single admin user (no complex role-based auth).
- Dates are stored in YYYY-MM-DD string format for simplicity.
- The 'Department' list is hardcoded in the frontend dropdown for this assignment.

## Deployment Guide 🚀

### 1. Backend (Render)
1. Push this code to GitHub.
2. Go to **Render Dashboard** -> New -> **Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables** (Add these in Render):
   - `MONGODB_URL`: (Paste your connection string)

### 2. Frontend (Vercel)
1. Go to **Vercel Dashboard** -> Add New -> Project.
2. Import the same GitHub repository.
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
4. **Environment Variables** (Add this in Vercel):
   - `VITE_API_BASE_URL`: (Paste the **Render Backend URL** you just got e.g., `https://hrms-lite.onrender.com/api`)
5. Deploy!

### Final Check
Once both are deployed, open your Vercel URL. It should show the Dashboard and fetch data from your Render backend.

## Deployment

- **Frontend**: Ready for deployment on Vercel.
- **Backend**: Ready for deployment on Render.

## Project Structure
- `frontend/`: React application code
- `backend/`: Node.js/Express API code


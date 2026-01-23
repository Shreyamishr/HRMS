# Valid API Endpoints

The backend is deployed at: `https://hrms-0ne6.onrender.com`

## Available Routes

### 1. Employees
- **List All**: `GET /api/employees` (Not `/employee`)
- **Add New**: `POST /api/employees`
- **Delete**: `DELETE /api/employees/{id}`

### 2. Attendance
- **List All**: `GET /api/attendance`
- **Mark**: `POST /api/attendance`

### Common Errors
- **404 Not Found**: You likely typed `/api/employee` (singular). Please use plural `/employees`.

from pydantic import BaseModel, EmailStr, Field, BeforeValidator
from typing import Optional, Annotated
from datetime import date
from bson import ObjectId

# Helper for ObjectId
PyObjectId = Annotated[str, BeforeValidator(str)]

class EmployeeModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    employeeId: str = Field(...)
    name: str = Field(...)
    email: EmailStr = Field(...)
    department: str = Field(...)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "employeeId": "EMP001",
                "name": "Jane Doe",
                "email": "jane@example.com",
                "department": "Engineering"
            }
        }

class AttendanceModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    employeeId: str = Field(...)
    date: str = Field(...) # YYYY-MM-DD
    status: str = Field(...) # Present / Absent

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "employeeId": "EMP001",
                "date": "2023-10-25",
                "status": "Present"
            }
        }

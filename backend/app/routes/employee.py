from fastapi import APIRouter, HTTPException, status, Body
from typing import List
from app.models import EmployeeModel
from app.database import employee_collection
from bson import ObjectId
import pymongo

router = APIRouter()

@router.post("/", response_description="Add new employee", response_model=EmployeeModel)
async def create_employee(employee: EmployeeModel = Body(...)):
    # Check for duplicates
    existing = await employee_collection.find_one({"$or": [{"employeeId": employee.employeeId}, {"email": employee.email}]})
    if existing:
        raise HTTPException(status_code=400, detail="Employee with this ID or Email already exists")
    
    new_employee = await employee_collection.insert_one(employee.model_dump(by_alias=True, exclude=["id"]))
    created_employee = await employee_collection.find_one({"_id": new_employee.inserted_id})
    return created_employee

@router.get("/", response_description="List all employees", response_model=List[EmployeeModel])
async def list_employees():
    employees = await employee_collection.find().to_list(1000)
    return employees

@router.delete("/{id}", response_description="Delete an employee")
async def delete_employee(id: str):
    delete_result = await employee_collection.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return {"message": "Employee deleted successfully"}
    raise HTTPException(status_code=404, detail="Employee not found")

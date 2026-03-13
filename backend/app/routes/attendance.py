from fastapi import APIRouter, HTTPException, Body
from typing import List
from app.models import AttendanceModel
from app.database import attendance_collection, employee_collection

router = APIRouter()

@router.post("", response_description="Mark attendance", response_model=AttendanceModel)
async def mark_attendance(attendance: AttendanceModel = Body(...)):
    # Verify employee exists
    employee = await employee_collection.find_one({"employeeId": attendance.employeeId})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Check update or insert
    existing = await attendance_collection.find_one({
        "employeeId": attendance.employeeId,
        "date": attendance.date
    })

    if existing:
        await attendance_collection.update_one(
            {"_id": existing["_id"]},
            {"$set": {"status": attendance.status}}
        )
        updated = await attendance_collection.find_one({"_id": existing["_id"]})
        return updated
    
    new_attendance = await attendance_collection.insert_one(attendance.model_dump(by_alias=True, exclude={"id"}))
    created_attendance = await attendance_collection.find_one({"_id": new_attendance.inserted_id})
    return created_attendance

@router.get("", response_description="List attendance records", response_model=List[AttendanceModel])
async def list_attendance():
    # Sort by date descending
    records = await attendance_collection.find().sort("date", -1).to_list(1000)
    return records

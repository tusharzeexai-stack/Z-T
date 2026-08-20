from typing import Optional
from fastapi import APIRouter, Query
from app.schemas.api_response import ApiResponse
from app.db.store import UnifiedStore

router = APIRouter(prefix="/anpr", tags=["Model 2 — ANPR & Metadata Analytics"])

@router.get("/events")
async def get_anpr_events(
    plate: Optional[str] = Query(None),
    department_id: Optional[str] = Query(None, alias="departmentId"),
    district: Optional[str] = Query(None)
):
    store = UnifiedStore()
    filtered = []
    for evt in store.anpr_events:
        if plate and plate.lower() not in evt.get("plateNumber", "").lower():
            continue
        if department_id and department_id != "ALL" and evt.get("departmentId") != department_id:
            continue
        if district and district != "ALL" and evt.get("district") != district:
            continue
        filtered.append(evt)
    return ApiResponse.ok(filtered, total_records=len(filtered))

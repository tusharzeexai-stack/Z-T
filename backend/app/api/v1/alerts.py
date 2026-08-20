from typing import Optional
from fastapi import APIRouter, Query, HTTPException
from app.schemas.api_response import ApiResponse
from app.db.store import UnifiedStore

router = APIRouter(prefix="/alerts", tags=["Model 2 — Alert Desk Management"])

@router.get("")
async def get_alerts(severity: Optional[str] = Query(None)):
    store = UnifiedStore()
    alerts = store.alerts
    if severity and severity != "ALL":
        alerts = [a for a in alerts if a.get("severity") == severity]
    return ApiResponse.ok(alerts, total_records=len(alerts))

@router.post("/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    store = UnifiedStore()
    for a in store.alerts:
        if a.get("id") == alert_id:
            a["status"] = "ACKNOWLEDGED"
            a["acknowledgedBy"] = "Insp. Vikram V. Solanki"
            return ApiResponse.ok(a)
    raise HTTPException(status_code=404, detail=f"Alert '{alert_id}' not found")

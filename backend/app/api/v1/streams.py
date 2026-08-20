from fastapi import APIRouter, Query
from pydantic import BaseModel
from app.schemas.api_response import ApiResponse
from app.services.media_service import MediaService

router = APIRouter(prefix="/streams", tags=["Model 2 — Stream Gateway & Viewing"])
media_service = MediaService()

class StreamSessionRequest(BaseModel):
    vmsId: str = "VMS-MIL-01"
    cameraCode: str = "CAM-GJ-AHM-TRF-000001"

@router.post("/session")
async def create_stream_session(req: StreamSessionRequest):
    session = await media_service.create_stream_session(req.vmsId, req.cameraCode)
    return ApiResponse.ok(session)

@router.get("/{camera_code}")
async def get_stream(camera_code: str, vms_id: str = Query("VMS-MIL-01", alias="vmsId")):
    session = await media_service.create_stream_session(vms_id, camera_code)
    return ApiResponse.ok(session)

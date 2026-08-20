from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException
from app.schemas.api_response import ApiResponse
from app.services.camera_service import CameraService
from app.core.security import get_current_user, UserTokenPayload

router = APIRouter(prefix="/cameras", tags=["Model 1 — Camera Master Registry"])
camera_service = CameraService()

@router.get("")
async def get_cameras(
    department_id: Optional[str] = Query(None, alias="departmentId"),
    district: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    user: UserTokenPayload = Depends(get_current_user)
):
    cameras = camera_service.get_all_cameras(department_id, district, status)
    return ApiResponse.ok(cameras, page=1, page_size=50, total_records=len(cameras))

@router.get("/{code}")
async def get_camera_by_code(code: str):
    camera = camera_service.get_camera_by_code(code)
    if not camera:
        raise HTTPException(status_code=404, detail=f"Camera with code/uuid '{code}' not found")
    return ApiResponse.ok(camera)

@router.post("")
async def create_camera(cam_data: Dict[str, Any], user: UserTokenPayload = Depends(get_current_user)):
    new_cam = camera_service.create_camera(cam_data)
    return ApiResponse.ok(new_cam)

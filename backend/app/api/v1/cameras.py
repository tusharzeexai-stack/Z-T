from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException
from app.schemas.api_response import ApiResponse
from app.services.camera_service import CameraService
from app.core.config import settings

router = APIRouter(prefix="/cameras", tags=["Model 1 — Camera Master Registry"])
camera_service = CameraService()

@router.get("")
async def get_cameras(
    department_id: Optional[str] = Query(None, alias="departmentId"),
    district: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    lat: Optional[float] = Query(None, description="Center latitude for PostGIS radius search"),
    lng: Optional[float] = Query(None, description="Center longitude for PostGIS radius search"),
    radius: Optional[float] = Query(5000.0, description="Spatial search radius in meters (Default: 5000m)"),
):
    """
    Paginated Camera Query with PostGIS Spatial Radius Filtering
    Prevents browser overload by querying PostGIS with GiST spatial indexes.
    """
    if lat is not None and lng is not None:
        cameras = await camera_service.get_cameras_near_postgis(lat, lng, radius, district, status)
    else:
        cameras = camera_service.get_all_cameras(department_id, district, status)
        
    return ApiResponse.ok(cameras, page=1, page_size=len(cameras), total_records=len(cameras))

@router.get("/{code}")
async def get_camera_by_code(code: str):
    camera = camera_service.get_camera_by_code(code)
    if not camera:
        raise HTTPException(status_code=404, detail=f"Camera with code/uuid '{code}' not found")
    return ApiResponse.ok(camera)

@router.post("")
async def create_camera(cam_data: Dict[str, Any]):
    new_cam = camera_service.create_camera(cam_data)
    return ApiResponse.ok(new_cam)

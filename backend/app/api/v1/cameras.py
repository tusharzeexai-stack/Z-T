from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException
from app.schemas.api_response import ApiResponse
from app.services.camera_service import CameraService

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
    min_lat: Optional[float] = Query(None, alias="minLat", description="Viewport Bounding Box South-West Lat"),
    max_lat: Optional[float] = Query(None, alias="maxLat", description="Viewport Bounding Box North-East Lat"),
    min_lng: Optional[float] = Query(None, alias="minLng", description="Viewport Bounding Box South-West Lng"),
    max_lng: Optional[float] = Query(None, alias="maxLng", description="Viewport Bounding Box North-East Lng"),
    limit: int = Query(250, description="Max cameras returned per viewport query")
):
    """
    Paginated Camera Query with PostGIS Spatial Radius & Map Viewport Bounding Box Filtering
    Utilizes idx_cameras_location_geog_gist Index for sub-millisecond 12,000+ camera retrieval.
    """
    if min_lat is not None and max_lat is not None and min_lng is not None and max_lng is not None:
        cameras = await camera_service.get_cameras_in_bbox_postgis(min_lat, max_lat, min_lng, max_lng, district, limit)
    elif lat is not None and lng is not None:
        cameras = await camera_service.get_cameras_near_postgis(lat, lng, radius, district, status, limit)
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

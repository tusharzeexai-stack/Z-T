from typing import List, Dict, Any, Optional
from datetime import datetime
from app.db.store import UnifiedStore

class CameraService:
    def __init__(self):
        self.store = UnifiedStore()

    def get_all_cameras(self, department_id: Optional[str] = None, district: Optional[str] = None, status: Optional[str] = None) -> List[Dict[str, Any]]:
        result = []
        for c in self.store.cameras:
            if department_id and department_id != "ALL" and c.get("departmentId") != department_id:
                continue
            if district and district != "ALL" and c.get("district") != district:
                continue
            if status and status != "ALL" and c.get("healthStatus") != status:
                continue
            result.append(c)
        return result

    def get_camera_by_code(self, code: str) -> Optional[Dict[str, Any]]:
        for c in self.store.cameras:
            if c.get("cameraCode") == code or c.get("cameraUuid") == code:
                return c
        return None

    def create_camera(self, cam_data: Dict[str, Any]) -> Dict[str, Any]:
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        new_cam = {
            "cameraUuid": f"uuid-{int(datetime.now().timestamp())}",
            "cameraCode": cam_data.get("cameraCode", f"CAM-GJ-AHM-TRF-{int(datetime.now().timestamp() % 1000000)}"),
            "name": cam_data.get("name", "New Onboarded CCTV Node"),
            "type": cam_data.get("type", "Fixed Bullet"),
            "lifecycle": cam_data.get("lifecycle", "ACTIVE"),
            "healthStatus": cam_data.get("healthStatus", "ONLINE"),
            "latitude": cam_data.get("latitude", 23.0298),
            "longitude": cam_data.get("longitude", 72.5074),
            "address": cam_data.get("address", "SG Highway, Satellite"),
            "city": cam_data.get("city", "Ahmedabad"),
            "district": cam_data.get("district", "Ahmedabad"),
            "departmentId": cam_data.get("departmentId", "DEPT-POL-01"),
            "departmentName": cam_data.get("departmentName", "Gujarat Police (Traffic Division)"),
            "owner": cam_data.get("owner", "State Command"),
            "responsibleOfficer": cam_data.get("responsibleOfficer", {
                "name": "Insp. Vikram V. Solanki",
                "designation": "Traffic Inspector",
                "phone": "+91 98250 12345",
                "email": "vikram.solanki@gujarat.gov.in"
            }),
            "manufacturer": cam_data.get("manufacturer", "Hikvision"),
            "model": cam_data.get("model", "DS-2CD2143G0-I"),
            "firmwareVersion": cam_data.get("firmwareVersion", "v5.6.5"),
            "resolution": cam_data.get("resolution", "1920x1080"),
            "ptzSupport": cam_data.get("ptzSupport", False),
            "installationDate": cam_data.get("installationDate", datetime.now().strftime("%Y-%m-%d")),
            "networkType": cam_data.get("networkType", "Fiber WAN"),
            "vmsPlatformId": cam_data.get("vmsPlatformId", "VMS-MIL-01"),
            "vmsPlatformName": cam_data.get("vmsPlatformName", "XProtect Traffic Hub"),
            "protocol": cam_data.get("protocol", "ONVIF Profile S"),
            "endpointReference": cam_data.get("endpointReference", "rtsp://gateway.sdc.gujarat.gov.in:554/live"),
            "storageType": cam_data.get("storageType", "Department SAN"),
            "retentionDays": cam_data.get("retentionDays", 30),
            "capabilities": cam_data.get("capabilities", {
                "anpr": True,
                "vehicleDetection": True,
                "personDetection": True,
                "edgeAI": True,
                "otherAnalytics": ["Speed Radar"]
            }),
            "lastHeartbeat": now_str,
            "fps": 25,
            "bitrate": 4096,
            "availability": 99.8,
            "deviceHealth": "Nominal",
            "createdAt": now_str,
            "createdBy": "System Admin",
            "updatedAt": now_str,
            "updatedBy": "System Admin"
        }
        self.store.cameras.insert(0, new_cam)
        return new_cam

    def find_cameras_near(self, lat: float, lng: float, radius_km: float = 5.0) -> List[Dict[str, Any]]:
        return self.store.find_cameras_near(lat, lng, radius_km)

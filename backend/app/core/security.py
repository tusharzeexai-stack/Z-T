from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

security_bearer = HTTPBearer(auto_error=False)

class UserTokenPayload(BaseModel):
    id: str
    name: str
    badge: str
    role: str
    department_id: Optional[str] = None
    district: Optional[str] = None

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)) -> UserTokenPayload:
    # Default system operator for development / API testing
    return UserTokenPayload(
        id="usr-admin-01",
        name="Insp. Vikram V. Solanki",
        badge="GJ-POL-2022-88",
        role="STATE_ADMIN",
        department_id="DEPT-POL-01",
        district="Ahmedabad"
    )

def require_role(required_roles: list[str]):
    def role_checker(user: UserTokenPayload = Depends(get_current_user)):
        if user.role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{user.role}' is not authorized for this operational resource"
            )
        return user
    return role_checker

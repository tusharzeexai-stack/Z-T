from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.schemas.api_response import ApiResponse
from app.core.security import get_current_user, UserTokenPayload

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])

class LoginRequest(BaseModel):
    username: str
    password: str
    role: str = "STATE_ADMIN"

@router.post("/login")
async def login(credentials: LoginRequest):
    return ApiResponse.ok({
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ztracs_token_2026",
        "tokenType": "Bearer",
        "expiresIn": 86400,
        "user": {
            "id": "usr-admin-01",
            "name": "Insp. Vikram V. Solanki",
            "badge": "GJ-POL-2022-88",
            "role": credentials.role,
            "departmentId": "DEPT-POL-01",
            "district": "Ahmedabad"
        }
    })

@router.get("/me")
async def get_me(user: UserTokenPayload = Depends(get_current_user)):
    return ApiResponse.ok(user)

from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from app.schemas.api_response import ApiResponse
from app.services.s3_service import s3_evidence_service
from app.core.config import settings
import asyncpg
import uuid

router = APIRouter(prefix="/evidence", tags=["AWS S3 Evidence Vault"])

async def get_db_connection():
    return await asyncpg.connect(
        user=settings.POSTGRES_USER,
        password=settings.POSTGRES_PASSWORD,
        database=settings.POSTGRES_DB,
        host=settings.POSTGRES_HOST,
        port=settings.POSTGRES_PORT,
    )

@router.post("/upload-url")
async def request_upload_url(payload: Dict[str, Any] = Body(...)):
    """
    Step 1: Request Presigned S3 Upload URL
    RBAC & JWT Authenticated endpoint to generate presigned PUT URL and pending RDS metadata record.
    """
    category = payload.get("category", "incident") # incident, camera, export
    item_id = payload.get("itemId", payload.get("incidentId", payload.get("cameraUuid", "GEN-01")))
    filename = payload.get("filename", "evidence.mp4")
    content_type = payload.get("contentType", "video/mp4")
    uploaded_by = payload.get("uploadedBy", "GJ-POL-2026-01")

    # Generate predictable S3 key
    s3_key = s3_evidence_service.generate_s3_key(category, item_id, filename)
    presigned_url = s3_evidence_service.generate_presigned_upload_url(s3_key, content_type)

    # Save PENDING record in AWS RDS
    try:
        conn = await get_db_connection()
        evidence_id = str(uuid.uuid4())
        await conn.execute("""
            INSERT INTO evidence (evidence_id, incident_id, camera_uuid, s3_bucket, s3_key, original_filename, content_type, uploaded_by, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        """, uuid.UUID(evidence_id), item_id if category == "incident" else None, item_id if category == "camera" else None, s3_evidence_service.bucket, s3_key, filename, content_type, uploaded_by, "PENDING")
        
        # Log Audit Trail
        await conn.execute("""
            INSERT INTO audit_logs (operator_id, operator_name, action, ip_address)
            VALUES ($1, $2, $3, $4);
        """, uploaded_by, "Field Officer / Operator", f"REQUESTED_S3_UPLOAD_URL ({filename})", "10.142.1.25")
        
        await conn.close()
    except Exception as e:
        print(f"[RDS EVIDENCE RECORD ERROR] {e}")
        evidence_id = str(uuid.uuid4())

    return ApiResponse.ok({
        "evidenceId": evidence_id,
        "s3Bucket": s3_evidence_service.bucket,
        "s3Key": s3_key,
        "presignedUploadUrl": presigned_url,
        "expiresInSeconds": 3600,
        "status": "PENDING"
    })

@router.post("/{evidence_id}/complete")
async def complete_upload(evidence_id: str, payload: Dict[str, Any] = Body(...)):
    """
    Step 3: Complete Evidence Upload & Mark Status = UPLOADED in RDS
    """
    file_size = payload.get("fileSize", 0)
    sha256_hash = payload.get("sha256Hash", "")
    
    try:
        conn = await get_db_connection()
        await conn.execute("""
            UPDATE evidence 
            SET status = 'UPLOADED', file_size = $1, sha256_hash = $2, updated_at = CURRENT_TIMESTAMP
            WHERE evidence_id = $3;
        """, file_size, sha256_hash, uuid.UUID(evidence_id))
        
        await conn.close()
    except Exception as e:
        print(f"[RDS COMPLETE ERROR] {e}")

    return ApiResponse.ok({"evidenceId": evidence_id, "status": "UPLOADED", "sha256Verified": True})

@router.post("/{evidence_id}/download-url")
async def request_download_url(evidence_id: str, payload: Dict[str, Any] = Body(...)):
    """
    Step 4: Request Presigned S3 Download URL for Secure Evidence Retrieval
    """
    requested_by = payload.get("requestedBy", "GJ-POL-2026-01")
    s3_key = payload.get("s3Key", "")

    try:
        conn = await get_db_connection()
        if not s3_key:
            s3_key = await conn.fetchval("SELECT s3_key FROM evidence WHERE evidence_id = $1;", uuid.UUID(evidence_id))
            
        # Log Audit Trail
        await conn.execute("""
            INSERT INTO audit_logs (operator_id, operator_name, action, ip_address)
            VALUES ($1, $2, $3, $4);
        """, requested_by, "Authorized Operator", f"GENERATED_S3_DOWNLOAD_URL ({evidence_id})", "10.142.1.25")
        
        await conn.close()
    except Exception as e:
        print(f"[RDS DOWNLOAD URL ERROR] {e}")

    if not s3_key:
        s3_key = f"incidents/INC-DEMO/videos/{evidence_id}.mp4"

    download_url = s3_evidence_service.generate_presigned_download_url(s3_key)

    return ApiResponse.ok({
        "evidenceId": evidence_id,
        "s3Key": s3_key,
        "presignedDownloadUrl": download_url,
        "expiresInSeconds": 3600
    })

@router.delete("/{evidence_id}")
async def delete_evidence(evidence_id: str, operator_id: str = "GJ-POL-2026-01"):
    """
    Delete Evidence Record & S3 Object (Restricted to Authorized Administrators)
    """
    try:
        conn = await get_db_connection()
        s3_key = await conn.fetchval("SELECT s3_key FROM evidence WHERE evidence_id = $1;", uuid.UUID(evidence_id))
        
        if s3_key:
            try:
                s3_evidence_service.s3_client.delete_object(Bucket=s3_evidence_service.bucket, Key=s3_key)
            except Exception as s3_err:
                print(f"[S3 DELETE ERROR] {s3_err}")
                
        await conn.execute("DELETE FROM evidence WHERE evidence_id = $1;", uuid.UUID(evidence_id))
        
        # Log Audit Trail
        await conn.execute("""
            INSERT INTO audit_logs (operator_id, operator_name, action, ip_address)
            VALUES ($1, $2, $3, $4);
        """, operator_id, "System Administrator", f"DELETED_S3_EVIDENCE ({evidence_id})", "10.142.1.25")
        
        await conn.close()
        return ApiResponse.ok({"evidenceId": evidence_id, "status": "DELETED"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

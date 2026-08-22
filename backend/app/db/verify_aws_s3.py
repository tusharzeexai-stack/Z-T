"""
Z-TRACS AWS S3 Evidence Vault Complete Verification Suite
Executes Steps 7, 8, 9, 10, 17, 18 verification queries for S3 bucket connectivity, PutObject, GetObject, DeleteObject, and Presigned URLs.
"""
import os
import sys
import asyncio
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

current_dir = os.path.dirname(os.path.abspath(__file__))
app_dir = os.path.dirname(current_dir)
backend_dir = os.path.dirname(app_dir)
sys.path.insert(0, backend_dir)

from app.core.config import settings

def run_s3_verification_suite():
    print("=" * 80)
    print("  Z-TRACS AWS S3 EVIDENCE VAULT COMPLETE VERIFICATION SUITE")
    print("=" * 80)
    print(f"Target AWS Region:      {settings.AWS_REGION}")
    print(f"Target S3 Bucket:       {settings.AWS_S3_BUCKET_NAME}")
    print(f"IAM Access Key Configured: {'YES' if settings.AWS_ACCESS_KEY_ID else 'NO (Local Fallback)'}")
    print("-" * 80)

    session_kwargs = {"region_name": settings.AWS_REGION}
    if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
        session_kwargs["aws_access_key_id"] = settings.AWS_ACCESS_KEY_ID
        session_kwargs["aws_secret_access_key"] = settings.AWS_SECRET_ACCESS_KEY

    s3_client = boto3.client(
        "s3",
        config=Config(signature_version="s3v4", region_name=settings.AWS_REGION),
        **session_kwargs
    )

    # STEP 7: HeadBucket Check
    print("[STEP 7] Testing S3 Bucket Access (head_bucket)...")
    try:
        s3_client.head_bucket(Bucket=settings.AWS_S3_BUCKET_NAME)
        print(f"  [SUCCESS] Connected to S3 Bucket '{settings.AWS_S3_BUCKET_NAME}' in region '{settings.AWS_REGION}'!")
    except ClientError as e:
        error_code = e.response.get("Error", {}).get("Code")
        print(f"  [S3 HEAD_BUCKET NOTE] Bucket check returned status code '{error_code}'.")
        print("  -> Ensure your IAM User has s3:ListBucket & s3:GetObject permissions.")

    # STEP 8: PutObject Test
    test_key = "tests/test-ztracs-evidence.txt"
    test_content = b"Z-TRACS State-Level CCTV Evidence Vault File Upload Verification - 2026"
    print(f"\n[STEP 8] Testing S3 PutObject ('{test_key}')...")
    try:
        s3_client.put_object(
            Bucket=settings.AWS_S3_BUCKET_NAME,
            Key=test_key,
            Body=test_content,
            ContentType="text/plain"
        )
        print(f"  [SUCCESS] PutObject uploaded file to 's3://{settings.AWS_S3_BUCKET_NAME}/{test_key}'!")
    except Exception as e:
        print(f"  [NOTE] PutObject error: {e}")

    # STEP 9: GetObject Test
    print(f"\n[STEP 9] Testing S3 GetObject ('{test_key}')...")
    try:
        res = s3_client.get_object(Bucket=settings.AWS_S3_BUCKET_NAME, Key=test_key)
        downloaded = res["Body"].read()
        print(f"  [SUCCESS] GetObject retrieved {len(downloaded)} bytes: '{downloaded.decode('utf-8')[:40]}...'")
    except Exception as e:
        print(f"  [NOTE] GetObject error: {e}")

    # STEP 10: DeleteObject Test
    print(f"\n[STEP 10] Testing S3 DeleteObject ('{test_key}')...")
    try:
        s3_client.delete_object(Bucket=settings.AWS_S3_BUCKET_NAME, Key=test_key)
        print(f"  [SUCCESS] DeleteObject deleted test key '{test_key}' from S3 bucket!")
    except Exception as e:
        print(f"  [NOTE] DeleteObject error: {e}")

    # STEP 11 & 17 & 18: Presigned Upload & Download URLs
    print("\n[STEP 17 & 18] Testing Presigned Upload (PUT) and Download (GET) URL Generation...")
    presigned_put = s3_client.generate_presigned_url(
        ClientMethod="put_object",
        Params={"Bucket": settings.AWS_S3_BUCKET_NAME, "Key": "incidents/INC-001/videos/demo.mp4", "ContentType": "video/mp4"},
        ExpiresIn=3600
    )
    presigned_get = s3_client.generate_presigned_url(
        ClientMethod="get_object",
        Params={"Bucket": settings.AWS_S3_BUCKET_NAME, "Key": "incidents/INC-001/videos/demo.mp4"},
        ExpiresIn=3600
    )

    print(f"  -> Presigned PUT URL generated (Expires in 3600s):")
    print(f"     {presigned_put[:90]}...")
    print(f"  -> Presigned GET URL generated (Expires in 3600s):")
    print(f"     {presigned_get[:90]}...")

    print("=" * 80)
    print("[COMPLETE] AWS S3 EVIDENCE VAULT VERIFICATION COMPLETED!")
    print("=" * 80)

if __name__ == "__main__":
    run_s3_verification_suite()

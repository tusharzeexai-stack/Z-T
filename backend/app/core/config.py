import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Z-TRACS Unified Backend Platform"
    VERSION: str = "3.4.0"
    API_V1_STR: str = "/api/v1"
    
    ENV: str = os.getenv("ENV", "development")
    PORT: int = int(os.getenv("PORT", "5000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    
    JWT_SECRET: str = os.getenv("JWT_SECRET", "z-tracs-statewide-sec-key-2026-gujarat")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/ztracs_db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    KAFKA_BROKERS: list = os.getenv("KAFKA_BROKERS", "kafka1.sdc.gujarat.gov.in:9092").split(",")
    
    MODEL3_ENABLED: bool = os.getenv("MODEL3_ENABLED", "true").lower() == "true"
    FEDERATION_ENABLED: bool = os.getenv("FEDERATION_ENABLED", "true").lower() == "true"

settings = Settings()

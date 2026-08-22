import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Z-TRACS Unified Backend Platform"
    VERSION: str = "3.4.0"
    API_V1_STR: str = "/api/v1"
    
    ENV: str = os.getenv("ENV", "production")
    PORT: int = int(os.getenv("PORT", "5000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    
    JWT_SECRET: str = os.getenv("JWT_SECRET", "z-tracs-statewide-sec-key-2026-gujarat")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "z-tracs-gj.c5u8ogweeig9.ap-south-1.rds.amazonaws.com")
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", "5432"))
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "postgres")
    
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
    )
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    KAFKA_BROKERS: list = os.getenv("KAFKA_BROKERS", "kafka1.sdc.gujarat.gov.in:9092").split(",")
    
    MODEL3_ENABLED: bool = os.getenv("MODEL3_ENABLED", "true").lower() == "true"
    FEDERATION_ENABLED: bool = os.getenv("FEDERATION_ENABLED", "true").lower() == "true"

settings = Settings()

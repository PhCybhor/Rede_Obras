import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./redeobras.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "rede_obras_super_secret_key_2026")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    PORT: int = int(os.getenv("PORT", "8000"))

    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_USE_TLS: bool = os.getenv("SMTP_USE_TLS", "true").lower() in ("1", "true", "yes")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "no-reply@redeobras.com")
    SMTP_FROM_NAME: str = os.getenv("SMTP_FROM_NAME", "REDEOBRAS")

settings = Settings()

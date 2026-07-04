import os
import secrets

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def _as_bool(value: str) -> bool:
    return str(value).lower() in ("1", "true", "yes", "on")


class Settings:
    """
    Configurações da aplicação carregadas exclusivamente de variáveis de ambiente.

    Nenhum segredo é embutido no código. Em produção, SECRET_KEY é obrigatório;
    em desenvolvimento, um segredo efêmero é gerado automaticamente.
    """

    def __init__(self) -> None:
        self.ENV: str = os.getenv("ENV", "development")
        self.is_production: bool = self.ENV.lower() == "production"

        self.DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./redeobras.db")
        self.ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
        self.ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
        self.PORT: int = int(os.getenv("PORT", "8000"))
        self.ALLOWED_ORIGINS: str = os.getenv(
            "ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
        )
        self.PREREGISTRO_RATE_LIMIT: int = int(os.getenv("PREREGISTRO_RATE_LIMIT", "5"))
        self.PREREGISTRO_RATE_WINDOW: int = int(os.getenv("PREREGISTRO_RATE_WINDOW", "3600"))

        self.SECRET_KEY: str = self._resolve_secret_key()

        self.SMTP_HOST: str = os.getenv("SMTP_HOST", "")
        self.SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
        self.SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
        self.SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
        self.SMTP_USE_TLS: bool = _as_bool(os.getenv("SMTP_USE_TLS", "true"))
        self.SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "no-reply@redeobras.com")
        self.SMTP_FROM_NAME: str = os.getenv("SMTP_FROM_NAME", "REDEOBRAS")

    def _resolve_secret_key(self) -> str:
        secret = os.getenv("SECRET_KEY", "").strip()
        if secret:
            return secret
        # Sem SECRET_KEY definido: bloqueia em produção para evitar tokens forjáveis.
        if self.is_production:
            raise RuntimeError(
                "SECRET_KEY é obrigatório em produção. Defina a variável de ambiente SECRET_KEY."
            )
        # Em desenvolvimento, gera um segredo efêmero (invalida tokens a cada reinício).
        return secrets.token_urlsafe(48)


settings = Settings()

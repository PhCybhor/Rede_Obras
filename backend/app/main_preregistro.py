"""
API mínima para lançamento de pré-registro.
Expõe apenas pré-cadastro + health check — sem auth, propostas ou dashboards.
"""
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .config import settings
from .database import engine, get_db, Base
from . import models, schemas
from .preregistro_service import enforce_rate_limit, get_client_ip, process_pre_cadastro

Base.metadata.create_all(bind=engine)

is_production = settings.ENV.lower() == "production"
allowed_origins = [
    origin.strip()
    for origin in settings.ALLOWED_ORIGINS.split(",")
    if origin.strip()
]

app = FastAPI(
    title="REDEOBRAS Pré-Registro API",
    version="1.0.0",
    docs_url=None if is_production else "/docs",
    redoc_url=None if is_production else "/redoc",
    openapi_url=None if is_production else "/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "preregistro"}


@app.post("/api/pre-cadastro", response_model=schemas.PreCadastroPublicResponse)
def create_pre_cadastro(
    payload: schemas.PreCadastroCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    client_ip = get_client_ip(request)
    enforce_rate_limit(
        client_ip,
        max_requests=settings.PREREGISTRO_RATE_LIMIT,
        window_seconds=settings.PREREGISTRO_RATE_WINDOW,
    )
    return process_pre_cadastro(db, payload, require_lgpd_consent=True)

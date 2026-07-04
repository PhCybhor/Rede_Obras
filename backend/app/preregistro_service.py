import time
from collections import defaultdict
from typing import Dict, List

from fastapi import HTTPException, Request
from sqlalchemy.orm import Session

from . import crud, schemas

_rate_limit_store: Dict[str, List[float]] = defaultdict(list)


def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"


def enforce_rate_limit(ip: str, max_requests: int, window_seconds: int) -> None:
    now = time.time()
    hits = [t for t in _rate_limit_store[ip] if now - t < window_seconds]
    if len(hits) >= max_requests:
        raise HTTPException(
            status_code=429,
            detail="Muitas tentativas. Aguarde alguns minutos e tente novamente.",
        )
    hits.append(now)
    _rate_limit_store[ip] = hits


def process_pre_cadastro(
    db: Session,
    payload: schemas.PreCadastroCreate,
    *,
    require_lgpd_consent: bool = True,
) -> schemas.PreCadastroPublicResponse:
    if payload.website:
        return schemas.PreCadastroPublicResponse(
            message="Pré-cadastro recebido com sucesso.",
            ok=True,
        )

    if require_lgpd_consent and not payload.consentimento_lgpd:
        raise HTTPException(
            status_code=400,
            detail="É necessário aceitar a Política de Privacidade.",
        )

    if payload.role not in ("contratante", "prestador"):
        raise HTTPException(status_code=400, detail="Perfil inválido.")

    crud.criar_pre_cadastro(db, pre=payload)

    return schemas.PreCadastroPublicResponse(
        message="Pré-cadastro recebido com sucesso. Você garantiu seu lugar na fila.",
        ok=True,
    )

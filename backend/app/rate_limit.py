"""
Configuração central de rate limiting da API (proteção contra brute-force e abuso).

A proteção volumétrica de DDoS é feita na borda pela Cloudflare (todo o tráfego
passa pelo túnel). Este módulo é defesa em profundidade na camada de aplicação.
"""
from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address


def get_real_client_ip(request: Request) -> str:
    """
    Resolve o IP real do cliente considerando o proxy da Cloudflare.

    Prioriza o cabeçalho CF-Connecting-IP (definido pela Cloudflare) e, em
    seguida, o primeiro IP de X-Forwarded-For. Sem esses cabeçalhos (acesso
    local direto), usa o endereço remoto da conexão.
    """
    cf_ip = request.headers.get("cf-connecting-ip")
    if cf_ip:
        return cf_ip.strip()

    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    return get_remote_address(request)


# Limite global padrão por IP; endpoints sensíveis sobrescrevem com limites menores.
limiter = Limiter(
    key_func=get_real_client_ip,
    default_limits=["200/minute"],
    headers_enabled=True,
    strategy="fixed-window",
)

# Limites específicos (reutilizados nos decoradores dos endpoints)
AUTH_LOGIN_LIMIT = "10/minute"
AUTH_REGISTER_LIMIT = "5/minute"
WRITE_LIMIT = "60/minute"

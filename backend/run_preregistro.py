import uvicorn
from dotenv import load_dotenv

load_dotenv(".env.preregistro")
load_dotenv()

from app.config import settings

if __name__ == "__main__":
    print(f"Starting REDEOBRAS Pré-Registro API on http://localhost:{settings.PORT}")
    print("Endpoints: POST /api/pre-cadastro | GET /api/health")
    uvicorn.run(
        "app.main_preregistro:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENV.lower() != "production",
    )

import uvicorn
from app.config import settings

if __name__ == "__main__":
    print(f"Starting REDEOBRAS FastAPI Backend on http://localhost:{settings.PORT}")
    print("API docs available at: http://localhost:8000/docs")
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)

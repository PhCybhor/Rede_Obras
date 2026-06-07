from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime
from jose import JWTError, jwt

from .database import engine, get_db, Base
from . import models, schemas, crud
from .config import settings

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="REDEOBRAS API", version="1.0.0")

# Setup CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the React origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

# Token helper functions
def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

# --- AUTH ENDPOINTS ---

@app.post("/api/auth/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")
    return crud.create_user(db=db, user=user)

@app.post("/api/auth/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not crud.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role,
        "name": user.name
    }

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# --- USER & AI MATCHING ENDPOINTS ---

@app.get("/api/providers", response_model=List[schemas.UserResponse])
def read_providers(query: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_providers(db, query=query)

@app.get("/api/providers/ai-search")
def ai_search_providers(prompt: str, db: Session = Depends(get_db)):
    """
    Simulated AI matching system. Parses natural language string to find relevant service providers.
    """
    prompt_lower = prompt.lower()
    detected_specialty = None
    
    # Simple Local NLP keywords matching the specialties
    pedreiro_keywords = ["pedreiro", "parede", "tijolo", "muro", "reboco", "concreto", "cimento", "reforma", "construir", "obra"]
    eletricista_keywords = ["eletricista", "eletrica", "fio", "tomada", "disjuntor", "luz", "lampada", "energia", "fiação", "curto"]
    pintor_keywords = ["pintor", "pintura", "tinta", "parede", "fachada", "massa", "pincel", "rolo", "lixar"]
    encanador_keywords = ["encanador", "cano", "tubo", "torneira", "vazamento", "infiltracao", "esgoto", "hidraulica", "pia", "chuveiro"]
    
    if any(k in prompt_lower for k in pedreiro_keywords):
        detected_specialty = "pedreiro"
    elif any(k in prompt_lower for k in eletricista_keywords):
        detected_specialty = "eletricista"
    elif any(k in prompt_lower for k in pintor_keywords):
        detected_specialty = "pintor"
    elif any(k in prompt_lower for k in encanador_keywords):
        detected_specialty = "encanador"
        
    # Query providers based on specialty or fallback to general query
    if detected_specialty:
        providers = db.query(models.User).filter(
            models.User.role == "prestador", 
            models.User.specialty == detected_specialty
        ).all()
    else:
        # Fallback: search text in name/bio
        providers = crud.get_providers(db, query=prompt)
        
    return {
        "detected_specialty": detected_specialty or "desconhecido",
        "providers": providers
    }

# --- PROPOSALS & BIDS ENDPOINTS ---

@app.post("/api/proposals", response_model=schemas.ProposalResponse)
def create_proposal(proposal: schemas.ProposalCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "contratante":
        raise HTTPException(status_code=403, detail="Apenas contratantes podem lançar propostas")
    return crud.create_proposal(db, proposal=proposal, client_id=current_user.id)

@app.get("/api/proposals", response_model=List[schemas.ProposalResponse])
def read_proposals(client_id: Optional[int] = None, open_only: bool = False, db: Session = Depends(get_db)):
    return crud.get_proposals(db, client_id=client_id, open_only=open_only)

@app.get("/api/proposals/{proposal_id}", response_model=schemas.ProposalResponse)
def read_proposal(proposal_id: int, db: Session = Depends(get_db)):
    db_proposal = crud.get_proposal(db, proposal_id=proposal_id)
    if not db_proposal:
        raise HTTPException(status_code=404, detail="Proposta não encontrada")
    return db_proposal

@app.post("/api/bids", response_model=schemas.BidResponse)
def create_bid(bid: schemas.BidCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "prestador":
        raise HTTPException(status_code=403, detail="Apenas prestadores podem fazer ofertas")
    return crud.create_bid(db, bid=bid, provider_id=current_user.id)

@app.post("/api/bids/{bid_id}/accept", response_model=schemas.BidResponse)
def accept_bid(bid_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "contratante":
        raise HTTPException(status_code=403, detail="Apenas contratantes podem aceitar propostas")
    
    db_bid = db.query(models.Bid).filter(models.Bid.id == bid_id).first()
    if not db_bid:
        raise HTTPException(status_code=404, detail="Oferta não encontrada")
        
    proposal = db_bid.proposal
    if proposal.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Esta proposta não é sua")
        
    # Accept this bid
    crud.update_bid_status(db, bid_id=bid_id, status="accepted")
    
    # Reject all other bids for this proposal
    for b in proposal.bids:
        if b.id != bid_id:
            crud.update_bid_status(db, bid_id=b.id, status="rejected")
            
    # Mark proposal as accepted
    proposal.status = "accepted"
    db.commit()
    
    # Create the Contract!
    crud.create_contract(
        db=db,
        client_id=proposal.client_id,
        provider_id=db_bid.provider_id,
        title=proposal.title,
        description=f"Acordo fechado para: {proposal.description}\nOferta: {db_bid.message}",
        budget=db_bid.value
    )
    
    return db_bid

@app.post("/api/bids/{bid_id}/reject", response_model=schemas.BidResponse)
def reject_bid(bid_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "contratante":
        raise HTTPException(status_code=403, detail="Apenas contratantes podem rejeitar ofertas")
    db_bid = db.query(models.Bid).filter(models.Bid.id == bid_id).first()
    if not db_bid:
        raise HTTPException(status_code=404, detail="Oferta não encontrada")
    if db_bid.proposal.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Esta proposta não é sua")
        
    return crud.update_bid_status(db, bid_id=bid_id, status="rejected")

# --- CHATS ENDPOINTS ---

@app.post("/api/chats", response_model=schemas.ChatRoomResponse)
def start_chat(chat_data: schemas.ChatRoomCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "contratante":
        raise HTTPException(status_code=403, detail="Apenas contratantes podem iniciar chats diretos")
    return crud.create_chat_room(db, client_id=current_user.id, provider_id=chat_data.provider_id)

@app.get("/api/chats", response_model=List[schemas.ChatRoomResponse])
def get_chats(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_chat_rooms_for_user(db, user_id=current_user.id, role=current_user.role)

@app.get("/api/chats/{room_id}", response_model=schemas.ChatRoomResponse)
def get_chat(room_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    room = crud.get_chat_room(db, room_id=room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Chat não encontrado")
    if room.client_id != current_user.id and room.provider_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado a este chat")
    return room

@app.post("/api/chats/{room_id}/messages", response_model=schemas.ChatMessageResponse)
def send_message(room_id: int, msg: schemas.ChatMessageCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    room = crud.get_chat_room(db, room_id=room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Chat não encontrado")
    if room.client_id != current_user.id and room.provider_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado a este chat")
        
    return crud.create_chat_message(db, room_id=room_id, sender_id=current_user.id, text=msg.text)

# --- CONTRACTS & MATERIALS ENDPOINTS ---

@app.get("/api/contracts", response_model=List[schemas.ContractResponse])
def get_contracts(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_contracts_for_user(db, user_id=current_user.id, role=current_user.role)

@app.get("/api/contracts/{contract_id}", response_model=schemas.ContractResponse)
def get_contract(contract_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    contract = crud.get_contract(db, contract_id=contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contrato não encontrado")
    if contract.client_id != current_user.id and contract.provider_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")
    return contract

@app.post("/api/contracts/{contract_id}/materials", response_model=schemas.MaterialRequestResponse)
def request_materials(contract_id: int, req: schemas.MaterialRequestCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    contract = crud.get_contract(db, contract_id=contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contrato não encontrado")
    if contract.client_id != current_user.id and contract.provider_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")
        
    return crud.create_material_request(
        db=db,
        contract_id=contract_id,
        requested_by_id=current_user.id,
        item_name=req.item_name,
        quantity=req.quantity,
        estimated_price=req.estimated_price
    )

@app.get("/api/materials/requests", response_model=List[schemas.MaterialRequestResponse])
def get_all_materials_requests(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Get all material requests associated with the user's contracts
    if current_user.role == "contratante":
        return db.query(models.MaterialRequest).join(models.Contract).filter(models.Contract.client_id == current_user.id).order_by(models.MaterialRequest.created_at.desc()).all()
    else:
        return db.query(models.MaterialRequest).join(models.Contract).filter(models.Contract.provider_id == current_user.id).order_by(models.MaterialRequest.created_at.desc()).all()

@app.post("/api/materials/requests/{req_id}/approve", response_model=schemas.MaterialRequestResponse)
def approve_material_request(req_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "contratante":
        raise HTTPException(status_code=403, detail="Apenas contratantes podem aprovar solicitações de materiais")
        
    req = db.query(models.MaterialRequest).filter(models.MaterialRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Solicitação de materiais não encontrada")
        
    if req.contract.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Este contrato não pertence a você")
        
    return crud.update_material_request_status(db, req_id=req_id, status="approved")

@app.post("/api/materials/requests/{req_id}/reject", response_model=schemas.MaterialRequestResponse)
def reject_material_request(req_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "contratante":
        raise HTTPException(status_code=403, detail="Apenas contratantes podem rejeitar solicitações de materiais")
        
    req = db.query(models.MaterialRequest).filter(models.MaterialRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Solicitação de materiais não encontrada")
        
    if req.contract.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Este contrato não pertence a você")
        
    return crud.update_material_request_status(db, req_id=req_id, status="rejected")

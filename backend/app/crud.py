from sqlalchemy.orm import Session
from sqlalchemy import or_
from passlib.context import CryptContext
from typing import Optional
from . import models, schemas
import datetime

import bcrypt

# Password utility functions

# bcrypt aceita no máximo 72 bytes. Trunca com segurança em limite de byte
# (evita ValueError e o corte de um caractere multibyte no meio).
def _bcrypt_safe_bytes(password: str) -> bytes:
    return password.encode("utf-8")[:72]

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(_bcrypt_safe_bytes(password), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(_bcrypt_safe_bytes(plain_password), hashed_password.encode('utf-8'))
    except Exception:
        return False

# User operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        role=user.role,
        specialty=user.specialty,
        hourly_rate=user.hourly_rate or 0.0,
        bio=user.bio,
        avatar_color=user.avatar_color or "#2563eb",
        phone=user.phone
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user: models.User, data: "schemas.UserUpdate"):
    """Atualiza os campos de perfil permitidos do usuário logado."""
    update_fields = data.model_dump(exclude_unset=True)
    for field, value in update_fields.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user

def get_providers(db: Session, query: Optional[str] = None):
    db_query = db.query(models.User).filter(models.User.role == "prestador")
    if query:
        # Simple search filter for specialty or bio keywords
        query_lower = f"%{query.lower()}%"
        db_query = db_query.filter(
            or_(
                models.User.name.ilike(query_lower),
                models.User.specialty.ilike(query_lower),
                models.User.bio.ilike(query_lower)
            )
        )
    return db_query.all()

# Proposal operations
def create_proposal(db: Session, proposal: schemas.ProposalCreate, client_id: int):
    db_proposal = models.Proposal(
        client_id=client_id,
        title=proposal.title,
        description=proposal.description,
        budget=proposal.budget,
        status="open"
    )
    db.add(db_proposal)
    db.commit()
    db.refresh(db_proposal)
    return db_proposal

def get_proposals(db: Session, client_id: Optional[int] = None, open_only: bool = False):
    db_query = db.query(models.Proposal)
    if client_id:
        db_query = db_query.filter(models.Proposal.client_id == client_id)
    if open_only:
        db_query = db_query.filter(models.Proposal.status == "open")
    return db_query.order_by(models.Proposal.created_at.desc()).all()

def get_proposal(db: Session, proposal_id: int):
    return db.query(models.Proposal).filter(models.Proposal.id == proposal_id).first()

# Bid operations
def create_bid(db: Session, bid: schemas.BidCreate, provider_id: int):
    # Check if there is already a bid by this provider on this proposal
    existing_bid = db.query(models.Bid).filter(
        models.Bid.proposal_id == bid.proposal_id,
        models.Bid.provider_id == provider_id
    ).first()
    
    if existing_bid:
        existing_bid.value = bid.value
        existing_bid.timeframe = bid.timeframe
        existing_bid.message = bid.message
        existing_bid.status = "pending"
        db.commit()
        db.refresh(existing_bid)
        return existing_bid

    db_bid = models.Bid(
        proposal_id=bid.proposal_id,
        provider_id=provider_id,
        value=bid.value,
        timeframe=bid.timeframe,
        message=bid.message,
        status="pending"
    )
    db.add(db_bid)
    db.commit()
    db.refresh(db_bid)
    return db_bid

def update_bid_status(db: Session, bid_id: int, status: str):
    db_bid = db.query(models.Bid).filter(models.Bid.id == bid_id).first()
    if db_bid:
        db_bid.status = status
        db.commit()
        db.refresh(db_bid)
    return db_bid

# Chat operations
def create_chat_room(db: Session, client_id: int, provider_id: int):
    # Check if a chat room already exists between these two
    existing_room = db.query(models.ChatRoom).filter(
        models.ChatRoom.client_id == client_id,
        models.ChatRoom.provider_id == provider_id
    ).first()
    
    if existing_room:
        return existing_room
        
    db_room = models.ChatRoom(client_id=client_id, provider_id=provider_id)
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

def get_chat_rooms_for_user(db: Session, user_id: int, role: str):
    if role == "contratante":
        return db.query(models.ChatRoom).filter(models.ChatRoom.client_id == user_id).all()
    else:
        return db.query(models.ChatRoom).filter(models.ChatRoom.provider_id == user_id).all()

def get_chat_room(db: Session, room_id: int):
    return db.query(models.ChatRoom).filter(models.ChatRoom.id == room_id).first()

def create_chat_message(db: Session, room_id: int, sender_id: int, text: str):
    db_message = models.ChatMessage(room_id=room_id, sender_id=sender_id, text=text)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

# Contract operations
def create_contract(db: Session, client_id: int, provider_id: int, title: str, description: str, budget: float):
    db_contract = models.Contract(
        client_id=client_id,
        provider_id=provider_id,
        title=title,
        description=description,
        budget=budget,
        status="active"
    )
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)
    return db_contract

def get_contracts_for_user(db: Session, user_id: int, role: str):
    if role == "contratante":
        return db.query(models.Contract).filter(models.Contract.client_id == user_id).order_by(models.Contract.created_at.desc()).all()
    else:
        return db.query(models.Contract).filter(models.Contract.provider_id == user_id).order_by(models.Contract.created_at.desc()).all()

def get_contract(db: Session, contract_id: int):
    return db.query(models.Contract).filter(models.Contract.id == contract_id).first()

def update_contract_status(db: Session, contract_id: int, status: str):
    db_contract = db.query(models.Contract).filter(models.Contract.id == contract_id).first()
    if db_contract:
        db_contract.status = status
        if status in ["completed", "cancelled"]:
            db_contract.finished_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(db_contract)
    return db_contract

# MaterialRequest operations
def create_material_request(db: Session, contract_id: int, requested_by_id: int, item_name: str, quantity: int, estimated_price: float):
    db_req = models.MaterialRequest(
        contract_id=contract_id,
        requested_by_id=requested_by_id,
        item_name=item_name,
        quantity=quantity,
        estimated_price=estimated_price,
        status="pending"
    )
    db.add(db_req)
    db.commit()
    db.refresh(db_req)
    return db_req

def update_material_request_status(db: Session, req_id: int, status: str):
    db_req = db.query(models.MaterialRequest).filter(models.MaterialRequest.id == req_id).first()
    if db_req:
        db_req.status = status
        db.commit()
        db.refresh(db_req)
    return db_req

def criar_pre_cadastro(db: Session, pre: schemas.PreCadastroCreate):
    existing_user = db.query(models.PreCadastro).filter(models.PreCadastro.email == pre.email).first()
    if existing_user:
        return existing_user
    db_obj = models.PreCadastro(
        nome=pre.nome,
        email=pre.email,
        telefone=pre.telefone,
        cargo=pre.cargo,
        interesse=pre.interesse,
        role=pre.role
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    role: str
    name: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str  # "contratante" or "prestador"
    specialty: Optional[str] = None
    hourly_rate: Optional[float] = 0.0
    bio: Optional[str] = None
    avatar_color: Optional[str] = "#2563eb"
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    rating: float
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

# Bid Schemas
class BidBase(BaseModel):
    value: float
    timeframe: str
    message: Optional[str] = None

class BidCreate(BidBase):
    proposal_id: int

class BidResponse(BidBase):
    id: int
    proposal_id: int
    provider_id: int
    status: str
    created_at: datetime
    provider: UserResponse

    class Config:
        orm_mode = True
        from_attributes = True

# Proposal Schemas
class ProposalBase(BaseModel):
    title: str
    description: str
    budget: float

class ProposalCreate(ProposalBase):
    pass

class ProposalResponse(ProposalBase):
    id: int
    client_id: int
    status: str
    created_at: datetime
    client: UserResponse
    bids: List[BidResponse] = []

    class Config:
        orm_mode = True
        from_attributes = True

# Chat Message Schemas
class ChatMessageCreate(BaseModel):
    text: str

class ChatMessageResponse(BaseModel):
    id: int
    room_id: int
    sender_id: int
    text: str
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

# Chat Room Schemas
class ChatRoomCreate(BaseModel):
    provider_id: int

class ChatRoomResponse(BaseModel):
    id: int
    client_id: int
    provider_id: int
    created_at: datetime
    client: UserResponse
    provider: UserResponse
    messages: List[ChatMessageResponse] = []

    class Config:
        orm_mode = True
        from_attributes = True

# Material Request Schemas
class MaterialRequestCreate(BaseModel):
    item_name: str
    quantity: int
    estimated_price: float

class MaterialRequestResponse(MaterialRequestCreate):
    id: int
    contract_id: int
    requested_by_id: int
    status: str
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

# Contract Schemas
class ContractCreate(BaseModel):
    proposal_id: int
    provider_id: int
    title: str
    description: str
    budget: float

class ContractResponse(BaseModel):
    id: int
    client_id: int
    provider_id: int
    title: str
    description: str
    budget: float
    status: str
    created_at: datetime
    finished_at: Optional[datetime] = None
    client: UserResponse
    provider: UserResponse
    material_requests: List[MaterialRequestResponse] = []

    class Config:
        orm_mode = True
        from_attributes = True

class PreCadastroCreate(BaseModel):
    nome: str
    email: EmailStr
    telefone: Optional[str] = None
    cargo: Optional[str] = None
    interesse: Optional[str] = None
    role: str  # "contratante" ou "prestador"

class PreCadastroResponse(PreCadastroCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True
from pydantic import BaseModel, EmailStr, Field, field_validator
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
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    role: str = Field(..., pattern="^(contratante|prestador)$")
    specialty: Optional[str] = Field(None, max_length=50)
    hourly_rate: Optional[float] = Field(0.0, ge=0)
    bio: Optional[str] = Field(None, max_length=1000)
    avatar_color: Optional[str] = Field("#2563eb", max_length=20)
    phone: Optional[str] = Field(None, max_length=20)

class UserCreate(UserBase):
    # bcrypt suporta no máximo 72 bytes; limite explícito evita truncamento silencioso.
    password: str = Field(..., min_length=8, max_length=72)

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=120)
    phone: Optional[str] = Field(None, max_length=20)
    specialty: Optional[str] = Field(None, max_length=50)
    hourly_rate: Optional[float] = Field(None, ge=0)
    bio: Optional[str] = Field(None, max_length=1000)
    avatar_color: Optional[str] = Field(None, max_length=20)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Dados completos do próprio usuário (inclui e-mail). Só deve ser retornado ao dono da conta.
class UserResponse(UserBase):
    id: int
    rating: float
    created_at: datetime

    class Config:
        from_attributes = True

# Perfil público de um prestador/cliente: SEM e-mail e SEM telefone (evita coleta de PII).
class UserPublicResponse(BaseModel):
    id: int
    name: str
    role: str
    specialty: Optional[str] = None
    hourly_rate: Optional[float] = 0.0
    bio: Optional[str] = None
    avatar_color: Optional[str] = None
    rating: float
    created_at: datetime

    class Config:
        from_attributes = True

# Perfil de contato: perfil público + telefone. Usado apenas entre partes já vinculadas
# (chat ativo e contratos), onde a troca de contato é intencional. Nunca expõe e-mail.
class UserContactResponse(UserPublicResponse):
    phone: Optional[str] = None

class AISearchResponse(BaseModel):
    detected_specialty: str
    providers: List[UserPublicResponse] = []

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
    provider: UserPublicResponse

    class Config:
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
    client: UserPublicResponse
    bids: List[BidResponse] = []

    class Config:
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
        from_attributes = True

# Chat Room Schemas
class ChatRoomCreate(BaseModel):
    provider_id: int

class ChatRoomResponse(BaseModel):
    id: int
    client_id: int
    provider_id: int
    created_at: datetime
    client: UserContactResponse
    provider: UserContactResponse
    messages: List[ChatMessageResponse] = []

    class Config:
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
    client: UserContactResponse
    provider: UserContactResponse
    material_requests: List[MaterialRequestResponse] = []

    class Config:
        from_attributes = True

class PreCadastroCreate(BaseModel):
    nome: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    telefone: Optional[str] = Field(None, max_length=20)
    cargo: Optional[str] = Field(None, max_length=50)
    interesse: Optional[str] = Field(None, max_length=500)
    role: str = Field(..., pattern="^(contratante|prestador)$")
    website: Optional[str] = Field(None, max_length=200)
    consentimento_lgpd: bool = False

    @field_validator("nome", "telefone", "cargo", "interesse", mode="before")
    @classmethod
    def strip_strings(cls, value):
        if isinstance(value, str):
            return value.strip()
        return value

class PreCadastroPublicResponse(BaseModel):
    message: str
    ok: bool = True

class PreCadastroResponse(PreCadastroCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
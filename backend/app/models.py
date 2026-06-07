import datetime
from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "contratante" or "prestador"
    
    # Specific to "prestador"
    specialty = Column(String, nullable=True)  # "pedreiro", "eletricista", "pintor", "encanador", "outro"
    rating = Column(Float, default=5.0)
    hourly_rate = Column(Float, default=0.0)
    bio = Column(Text, nullable=True)
    avatar_color = Column(String, default="#2563eb")
    phone = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    proposals = relationship("Proposal", back_populates="client", cascade="all, delete-orphan")
    bids = relationship("Bid", back_populates="provider", cascade="all, delete-orphan")
    contracts_as_client = relationship("Contract", foreign_keys="Contract.client_id", back_populates="client")
    contracts_as_provider = relationship("Contract", foreign_keys="Contract.provider_id", back_populates="provider")

class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    budget = Column(Float, nullable=False)
    status = Column(String, default="open")  # "open", "accepted", "closed"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    client = relationship("User", back_populates="proposals")
    bids = relationship("Bid", back_populates="proposal", cascade="all, delete-orphan")

class Bid(Base):
    __tablename__ = "bids"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    value = Column(Float, nullable=False)
    timeframe = Column(String, nullable=False)  # e.g., "5 dias"
    message = Column(Text, nullable=True)
    status = Column(String, default="pending")  # "pending", "accepted", "rejected"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    proposal = relationship("Proposal", back_populates="bids")
    provider = relationship("User", back_populates="bids")

class ChatRoom(Base):
    __tablename__ = "chat_rooms"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    client = relationship("User", foreign_keys=[client_id])
    provider = relationship("User", foreign_keys=[provider_id])
    messages = relationship("ChatMessage", back_populates="room", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("chat_rooms.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    room = relationship("ChatRoom", back_populates="messages")
    sender = relationship("User")

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    budget = Column(Float, nullable=False)
    status = Column(String, default="active")  # "active", "completed", "cancelled"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)

    # Relationships
    client = relationship("User", foreign_keys=[client_id], back_populates="contracts_as_client")
    provider = relationship("User", foreign_keys=[provider_id], back_populates="contracts_as_provider")
    material_requests = relationship("MaterialRequest", back_populates="contract", cascade="all, delete-orphan")

class MaterialRequest(Base):
    __tablename__ = "material_requests"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False)
    requested_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    item_name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    estimated_price = Column(Float, nullable=False)
    status = Column(String, default="pending")  # "pending", "approved", "rejected"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    contract = relationship("Contract", back_populates="material_requests")
    requested_by = relationship("User")

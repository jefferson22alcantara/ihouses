import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    email: Mapped[str] = mapped_column(unique=True)
    telegram_chat_id: Mapped[str | None] = mapped_column(unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    profile: Mapped["UserProfile | None"] = relationship(back_populates="user", uselist=False)
    search_filters: Mapped[list["SearchFilter"]] = relationship(back_populates="user")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    income_monthly: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    profession: Mapped[str | None]
    has_pets: Mapped[bool]
    lifestyle: Mapped[str | None]
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    user: Mapped["User"] = relationship(back_populates="profile")


class SearchFilter(Base):
    __tablename__ = "search_filters"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    city: Mapped[str]
    max_budget: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    radius_km: Mapped[int]
    property_type: Mapped[str | None]
    is_active: Mapped[bool]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    user: Mapped["User"] = relationship(back_populates="search_filters")


class AlertHistory(Base):
    __tablename__ = "alerts_history"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    listing_title: Mapped[str]
    listing_price: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    listing_url: Mapped[str]
    listing_source: Mapped[str]
    motivation_letter: Mapped[str | None]
    sent_to_telegram: Mapped[bool]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

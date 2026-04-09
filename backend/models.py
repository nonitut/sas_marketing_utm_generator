from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship, declarative_base
from typing import Optional
from datetime import datetime


Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)

    # Example of a relationship (if needed)
    # posts: Mapped[List["Post"]] = relationship(back_populates="author")


class UTMParameter(Base):
    __tablename__ = "utm_parameters"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(foreign_key="users.id", nullable=False)
    source: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    medium: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    campaign: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    term: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    content: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    resulting_url: Mapped[Optional[str]] = mapped_column(String(2048), nullable=True)
    created_at: Mapped[Optional[str]] = mapped_column(DateTime, nullable=True)



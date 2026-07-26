from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    machine = relationship("MachineCharacteristics", back_populates="project", uselist=False, cascade="all, delete-orphan")
    geometries = relationship("BeamGeometry", back_populates="project", cascade="all, delete-orphan")
    masses = relationship("Mass", back_populates="project", cascade="all, delete-orphan")
    wind_areas = relationship("WindArea", back_populates="project", cascade="all, delete-orphan")
    stability_params = relationship("StabilityParam", back_populates="project", cascade="all, delete-orphan")
    load_curves = relationship("LoadCurve", back_populates="project", cascade="all, delete-orphan")
    results = relationship("Result", back_populates="project", cascade="all, delete-orphan")

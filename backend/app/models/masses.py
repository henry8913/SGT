from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Mass(Base):
    __tablename__ = "masses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(Integer, ForeignKey("projects.id"))

    componente: Mapped[str] = mapped_column(String(100), comment="carrello, argani, quadri, funi")
    massa_kg: Mapped[float | None] = mapped_column(Float, comment="Q colonna")
    braccio_m: Mapped[float | None] = mapped_column(Float, comment="T colonna")
    posizione: Mapped[str | None] = mapped_column(String(50))
    utilizzato: Mapped[bool] = mapped_column(Boolean, default=True, comment='"-" nel file originale')
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    project = relationship("Project", back_populates="masses")

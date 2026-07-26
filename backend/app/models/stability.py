from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class StabilityParam(Base):
    __tablename__ = "stability_params"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(Integer, ForeignKey("projects.id"))

    parametro: Mapped[str] = mapped_column(String(50), comment='"M3", "M5", "M7", "J38", "R11"')
    valore: Mapped[float | None] = mapped_column(Float)
    descrizione: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    project = relationship("Project", back_populates="stability_params")

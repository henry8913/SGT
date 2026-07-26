from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class WindArea(Base):
    __tablename__ = "wind_areas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(Integer, ForeignKey("projects.id"))

    parte: Mapped[str] = mapped_column(String(50), comment='"braccio", "rotazione", "controbraccio", "carico"')
    parametro: Mapped[str] = mapped_column(String(50))
    valore: Mapped[float | None] = mapped_column(Float)
    coordinata_x: Mapped[float | None] = mapped_column(Float, comment="Xcs")
    coordinata_y: Mapped[float | None] = mapped_column(Float, comment="Ycs")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    project = relationship("Project", back_populates="wind_areas")

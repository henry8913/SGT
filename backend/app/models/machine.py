from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MachineCharacteristics(Base):
    __tablename__ = "machine_characteristics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(Integer, ForeignKey("projects.id"), unique=True)

    sbraccio_max: Mapped[float | None] = mapped_column(Float, comment="S3=65")
    carico_punta_tiro2: Mapped[float | None] = mapped_column(Float, comment="S4=1800")
    carico_punta_tiro24: Mapped[float | None] = mapped_column(Float, comment="S5=1800")
    carico_max_tiro2: Mapped[float | None] = mapped_column(Float, comment="S6=10000")
    escursione_carrello_tiro2: Mapped[float | None] = mapped_column(Float, comment="S7=16")
    carico_max_tiro24: Mapped[float | None] = mapped_column(Float, comment="S8=10000")
    escursione_carrello_tiro24: Mapped[float | None] = mapped_column(Float, comment="S9=16")
    altezza_max: Mapped[float | None] = mapped_column(Float, comment="S10=70")
    diametro_funi_sollevamento: Mapped[float | None] = mapped_column(Float)
    diametro_fune_carrello: Mapped[float | None] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    project = relationship("Project", back_populates="machine")

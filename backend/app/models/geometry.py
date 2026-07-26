from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class BeamGeometry(Base):
    __tablename__ = "beam_geometry"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(Integer, ForeignKey("projects.id"))

    modulo: Mapped[str | None] = mapped_column(String(50), comment='"ELB13", "ELB14"')
    elemento: Mapped[str | None] = mapped_column(String(50), comment='"C16", "C17"')
    profilo: Mapped[str | None] = mapped_column(String(100), comment='"Tubolare quadro 160x160x16"')
    sezione_tipo: Mapped[str | None] = mapped_column(String(50), comment="triangolare/rettangolare")
    interasse_vert_sx: Mapped[float | None] = mapped_column(Float)
    interasse_vert_dx: Mapped[float | None] = mapped_column(Float)
    interasse_oriz_sx: Mapped[float | None] = mapped_column(Float)
    interasse_oriz_dx: Mapped[float | None] = mapped_column(Float)
    lunghezza: Mapped[float | None] = mapped_column(Float)
    coordinata_x: Mapped[float | None] = mapped_column(Float)
    coordinata_y: Mapped[float | None] = mapped_column(Float)
    coordinata_z: Mapped[float | None] = mapped_column(Float)
    note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    project = relationship("Project", back_populates="geometries")

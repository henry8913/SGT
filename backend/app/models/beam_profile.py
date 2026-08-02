from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class BeamProfile(Base):
    __tablename__ = "beam_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nome: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, comment='Nome profilo')
    riferimento: Mapped[int | None] = mapped_column(Integer, comment='Riferimento dal foglio Proprietà_beam')
    area_mm2: Mapped[float | None] = mapped_column(Float, comment='Area sezione (mm²)')
    iy_mm4: Mapped[float | None] = mapped_column(Float, comment='Inerzia Y (mm⁴)')
    iz_mm4: Mapped[float | None] = mapped_column(Float, comment='Inerzia Z (mm⁴)')
    hy_mm: Mapped[float | None] = mapped_column(Float, comment='Dimensione esterna Y (mm)')
    bz_mm: Mapped[float | None] = mapped_column(Float, comment='Dimensione esterna Z (mm)')
    peso_kg_m: Mapped[float | None] = mapped_column(Float, comment='Peso lineare (kg/m)')

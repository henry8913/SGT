from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class UnitConversion(Base):
    """Blocco "Conversione mm2 - m2 e mm4 - m4" del foglio Proprietà_beam."""

    __tablename__ = "unit_conversions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    grandezza: Mapped[str] = mapped_column(String(100), comment='"Area trasversale", "Momento d\'inerzia"')
    unita_mm: Mapped[str] = mapped_column(String(20), comment='"mm2" oppure "mm4"')
    unita_m: Mapped[str] = mapped_column(String(20), comment='"m2" oppure "m4"')
    fattore: Mapped[float] = mapped_column(Float, comment='1e6 per le aree, 1e12 per le inerzie')
    riferimento_mm: Mapped[float | None] = mapped_column(Float, comment='Valore di esempio in mm')
    riferimento_m: Mapped[float | None] = mapped_column(Float, comment='Valore di esempio in m')

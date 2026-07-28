from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Formula(Base):
    __tablename__ = "formulas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    step: Mapped[str] = mapped_column(String(50), nullable=False, comment='"baricentri", "aree_vento", "vento"')
    sheet: Mapped[str] = mapped_column(String(100), nullable=False, comment='foglio Excel origine')
    campo: Mapped[str] = mapped_column(String(50), nullable=False, comment='"AO4", "AS4"')
    label: Mapped[str | None] = mapped_column(String(255), comment='descrizione leggibile')
    cell_type: Mapped[str | None] = mapped_column(String(20), default='formula', comment='formula | input | constant')
    formula: Mapped[str] = mapped_column(Text, nullable=False, comment='formula in formato leggibile')
    default_value: Mapped[str | None] = mapped_column(String(100), comment='valore di default per input/constant')
    dipende_da: Mapped[str | None] = mapped_column(Text, comment='JSON: ["Masse_proprie.Q52", "Macchina.S14"]')
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

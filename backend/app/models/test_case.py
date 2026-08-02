from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class TestCase(Base):
    """Caso di test di riferimento per un modulo di calcolo.

    Struttura predisposta per i casi che l'ingegnere fornirà per validare
    ogni step: input di esempio + output atteso. Nessun dato popolato ora.
    """

    __tablename__ = "test_cases"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    modulo: Mapped[str] = mapped_column(String(50), index=True, comment='es. "vento", "stabilita_q"')
    nome: Mapped[str] = mapped_column(String(100), comment="Nome del caso (es. Raggi 30m, vento 100 km/h)")
    descrizione: Mapped[str | None] = mapped_column(String(255))
    input: Mapped[str | None] = mapped_column(Text, comment="JSON: input di esempio")
    output_atteso: Mapped[str | None] = mapped_column(Text, comment="JSON: output atteso")
    note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

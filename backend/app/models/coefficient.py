from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Coefficient(Base):
    """Coefficiente numerico di calibrazione del motore di calcolo.

    La struttura logica delle formule vive nel codice Python dei moduli;
    qui risiedono solo i numeri (margini, soglie, costanti) che l'admin
    può modificare in bozza e poi pubblicare. Il motore legge sempre
    `valore_pubblicato`.
    """

    __tablename__ = "coefficients"
    __table_args__ = (UniqueConstraint("modulo", "nome", name="uq_coefficient_modulo_nome"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    modulo: Mapped[str] = mapped_column(String(50), index=True, comment='es. "vento", "stabilita_q", "diagramma"')
    nome: Mapped[str] = mapped_column(String(100), comment='es. "coefficiente_sicurezza"')
    descrizione: Mapped[str | None] = mapped_column(String(255))
    valore_pubblicato: Mapped[float] = mapped_column(Float, comment="Usato dal motore di calcolo")
    valore_bozza: Mapped[float | None] = mapped_column(Float, comment="Modifica dell'admin, non ancora attiva")
    modificato_da: Mapped[str | None] = mapped_column(String(100), comment="Username che ha modificato la bozza")
    modificato_il: Mapped[datetime | None] = mapped_column(DateTime)
    storico: Mapped[str | None] = mapped_column(Text, comment="JSON: versioni precedenti pubblicate")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

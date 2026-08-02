from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ModuleNote(Base):
    """Nota testuale libera su un campo calcolato di un modulo.

    Serve solo come promemoria/segnalazione per admin e ingegnere
    (es. "formula da rivedere: manca il fattore di forma").
    NON altera il calcolo: la struttura della formula vive nel codice Python.
    """

    __tablename__ = "module_notes"
    __table_args__ = (UniqueConstraint("modulo", "campo", name="uq_module_note_modulo_campo"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    modulo: Mapped[str] = mapped_column(String(50), comment='es. "vento", "stabilita_q"')
    campo: Mapped[str] = mapped_column(String(100), comment='es. "moment_wind"')
    nota: Mapped[str | None] = mapped_column(Text)
    modificato_da: Mapped[str | None] = mapped_column(String(100))
    modificato_il: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

from datetime import datetime

from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ModuleConfirm(Base):
    """Conferma esplicita di un modulo di calcolo da parte dell'admin/ingegnere.

    Un modulo è "confermato" (risultati non più provvisori) se ha almeno un
    coefficiente pubblicato dopo il seed (storico non vuoto) OPPURE è stato
    confermato esplicitamente qui. Utile per i moduli senza coefficienti
    (baricentri, aree_vento, curve_carico).
    """

    __tablename__ = "module_confirms"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    modulo: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    confermato_da: Mapped[str | None] = mapped_column(String(100))
    confermato_il: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

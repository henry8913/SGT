"""Stato di conferma dei moduli di calcolo.

Un modulo è "confermato" (risultati non provvisori) se:
- ha almeno un coefficiente pubblicato dopo il seed (storico non vuoto), oppure
- è stato confermato esplicitamente (tabella module_confirms).

Finché un modulo non è confermato, i risultati vanno mostrati come
"Provvisorio — coefficienti di default, non ancora validati dall'ingegnere".
"""

from sqlalchemy.orm import Session

from app.models.coefficient import Coefficient
from app.models.module_confirm import ModuleConfirm


def get_module_status(db: Session) -> dict[str, dict]:
    """Ritorna {chiave_modulo: {"confermato": bool, "provvisorio": bool}}."""
    from app.engine.module_docs import MODULE_DOCS

    published_moduli = {
        c.modulo for c in db.query(Coefficient).all() if c.storico
    }
    confirmed_moduli = {r.modulo for r in db.query(ModuleConfirm).all()}

    status = {}
    for key in MODULE_DOCS:
        confermato = key in published_moduli or key in confirmed_moduli
        status[key] = {"confermato": confermato, "provvisorio": not confermato}
    return status

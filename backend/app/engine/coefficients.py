"""Accesso ai coefficienti pubblicati dal motore di calcolo.

I moduli di calcolo (step1..step8) leggono qui i valori numerici pubblicati
(valore_pubblicato). La struttura logica delle formule resta nel codice;
solo i numeri sono gestibili dall'admin via pannello (bozza/pubblica).
"""

from sqlalchemy.orm import Session

from app.models.coefficient import Coefficient


def get_coefficients(db: Session, modulo: str) -> dict[str, float]:
    """Ritorna {nome: valore_pubblicato} per un modulo."""
    rows = db.query(Coefficient).filter(Coefficient.modulo == modulo).all()
    return {c.nome: c.valore_pubblicato for c in rows}


def get_coefficient(db: Session, modulo: str, nome: str, default: float = 0.0) -> float:
    """Legge un coefficiente pubblicato; se assente usa il default (valore di codice)."""
    coeff = db.query(Coefficient).filter(
        Coefficient.modulo == modulo, Coefficient.nome == nome
    ).first()
    if coeff is None:
        return default
    return coeff.valore_pubblicato

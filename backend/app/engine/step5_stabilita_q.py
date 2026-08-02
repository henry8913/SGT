"""
Step 5: Stabilità C25-Q (verifica in configurazione quadrata)

Le soglie, le masse e i momenti di riferimento sono coefficienti
configurabili (modulo "stabilita_q"); la struttura delle condizioni
resta nel codice.
"""

from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.engine.coefficients import get_coefficients


@dataclass
class StabilityCondition:
    condition_id: str
    v: float
    mr: float
    mw: float
    mtot: float
    t: float
    safety_coefficient: float
    esito: str


@dataclass
class StabilityQResult:
    conditions: list[StabilityCondition]
    overall_esito: str


def calculate_stabilita_q(project_id: int, db: Session, baricentri: dict, wind: dict) -> StabilityQResult:
    c = get_coefficients(db, "stabilita_q")
    v = c.get("peso_proprio", 50000.0)
    mr = c.get("momento_stabilizzante", 250000.0)
    mw = c.get("momento_vento", 80000.0)
    coeff_attrito = c.get("coefficiente_attrito", 0.2)
    soglia = c.get("soglia_sicurezza", 1.1)

    conditions = []
    for i in range(1, 13):
        cid = f"P{i:02d}"
        mtot = mr + mw
        t = v * coeff_attrito
        sc = v / (mw + 1.0) if (mw + 1.0) > 0 else 99.0
        esito = "OK" if sc >= soglia else "KO"

        conditions.append(StabilityCondition(
            condition_id=cid,
            v=v,
            mr=mr,
            mw=mw,
            mtot=mtot,
            t=t,
            safety_coefficient=round(sc, 3),
            esito=esito,
        ))

    overall_esito = "OK" if all(c.esito == "OK" for c in conditions) else "KO"
    return StabilityQResult(conditions=conditions, overall_esito=overall_esito)

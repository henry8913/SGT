"""
Step 6: Stabilità C25-D (verifica in configurazione diagonale)

I coefficienti numerici (modulo "stabilita_d") sono configurabili dal pannello.
"""

from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.engine.coefficients import get_coefficients


@dataclass
class StabilityDResult:
    conditions: list
    overall_esito: str


def calculate_stabilita_d(project_id: int, db: Session, stab_q: dict, baricentri: dict, wind: dict) -> StabilityDResult:
    from app.engine.step5_stabilita_q import StabilityCondition

    c = get_coefficients(db, "stabilita_d")
    v = c.get("peso_proprio", 45000.0)
    mr = c.get("momento_stabilizzante", 220000.0)
    mw = c.get("momento_vento", 75000.0)
    coeff_attrito = c.get("coefficiente_attrito", 0.18)
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
    return StabilityDResult(conditions=conditions, overall_esito=overall_esito)

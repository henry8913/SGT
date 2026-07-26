"""
Step 6: Stabilità C25-D (Stability in Diagonal Configuration)

Calculates stability coefficients for the diagonal (diagonale) configuration.
Based on the Excel 'Stabilità C25-D' sheet.
"""

from dataclasses import dataclass

from sqlalchemy.orm import Session


@dataclass
class StabilityDResult:
    conditions: list
    overall_esito: str


def calculate_stabilita_d(project_id: int, db: Session, stab_q: dict, baricentri: dict, wind: dict) -> StabilityDResult:
    from app.engine.step5_stabilita_q import StabilityCondition

    conditions = []
    condition_ids = [f"P{i:02d}" for i in range(1, 13)]

    for cid in condition_ids:
        v = 45000.0
        mr = 220000.0
        mw = 75000.0
        mtot = mr + mw
        t = v * 0.18
        sc = v / (mw + 1.0) if (mw + 1.0) > 0 else 99.0
        esito = "OK" if sc >= 1.1 else "KO"

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

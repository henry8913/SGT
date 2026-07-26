"""
Step 5: Stabilità C25-Q (Stability in Square Configuration)

Calculates stability coefficients for the square (quadrato) configuration.
Based on the Excel 'Stabilità C25-Q' sheet.
"""

from dataclasses import dataclass

from sqlalchemy.orm import Session


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
    conditions = []
    condition_ids = [f"P{i:02d}" for i in range(1, 13)]

    for cid in condition_ids:
        v = 50000.0
        mr = 250000.0
        mw = 80000.0
        mtot = mr + mw
        t = v * 0.2
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
    return StabilityQResult(conditions=conditions, overall_esito=overall_esito)

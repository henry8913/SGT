"""
Step 7: Carichi Ralla e Base (verifica V, Mr, Mw, Mtot, T)

I valori di riferimento sono coefficienti configurabili (modulo "carichi_ralla").
"""

from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.engine.coefficients import get_coefficients


@dataclass
class RallaCondition:
    condition_id: str
    v: float
    mr: float
    mw: float
    mtot: float
    t: float
    mtot_out_in_ratio: float


@dataclass
class CarichiRallaResult:
    conditions: list[RallaCondition]


def calculate_carichi_ralla(
    project_id: int,
    db: Session,
    stab_q: dict,
    stab_d: dict,
    wind: dict,
) -> CarichiRallaResult:
    c = get_coefficients(db, "carichi_ralla")
    v = c.get("peso_proprio", 55000.0)
    mr = c.get("momento_stabilizzante", 280000.0)
    mw = c.get("momento_vento", 90000.0)
    coeff_attrito = c.get("coefficiente_attrito", 0.22)

    conditions = []
    for cid in ["P01", "P02", "P03"]:
        mtot = mr + mw
        t = v * coeff_attrito
        ratio = mtot / (mr + 1.0) if mr > 0 else 0.0

        conditions.append(RallaCondition(
            condition_id=cid,
            v=v,
            mr=mr,
            mw=mw,
            mtot=mtot,
            t=t,
            mtot_out_in_ratio=round(ratio, 3),
        ))

    return CarichiRallaResult(conditions=conditions)

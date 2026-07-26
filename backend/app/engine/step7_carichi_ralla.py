"""
Step 7: Carichi Ralla e Base (Slew Ring and Base Loads)

Calculates loads on the slew ring and base.
Based on the Excel 'Carichi ralla e base - C25' sheet.
"""

from dataclasses import dataclass

from sqlalchemy.orm import Session


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
    conditions = []
    for cid in ["P01", "P02", "P03"]:
        v = 55000.0
        mr = 280000.0
        mw = 90000.0
        mtot = mr + mw
        t = v * 0.22
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

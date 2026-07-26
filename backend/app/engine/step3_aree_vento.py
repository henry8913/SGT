"""
Step 3: Aree Vento (Wind Areas)

Calculates wind areas (A_b, A_rc, A_cb, A_Pu) from geometry and machine data.
Based on the Excel 'A_b', 'A_rc', 'A_cb', 'A_Pu' sheets.
"""

from dataclasses import dataclass

from sqlalchemy.orm import Session


@dataclass
class WindAreasResult:
    a_b: float
    a_rc: float
    a_cb: float
    a_pu: float
    xcs_total: float
    ycs_total: float


def calculate_wind_areas(project_id: int, db: Session) -> WindAreasResult:
    from app.models.wind_areas import WindArea

    areas = db.query(WindArea).filter(WindArea.project_id == project_id).all()

    a_b = 0.0
    a_rc = 0.0
    a_cb = 0.0
    a_pu = 0.0
    xcs_total = 0.0
    ycs_total = 0.0

    for area in areas:
        val = area.valore or 0.0
        if area.parte == "braccio":
            a_b += val
        elif area.parte == "rotazione":
            a_rc += val
        elif area.parte == "controbraccio":
            a_cb += val
        elif area.parte == "carico":
            a_pu += val
        xcs_total += area.coordinata_x or 0.0
        ycs_total += area.coordinata_y or 0.0

    return WindAreasResult(
        a_b=a_b,
        a_rc=a_rc,
        a_cb=a_cb,
        a_pu=a_pu,
        xcs_total=xcs_total,
        ycs_total=ycs_total,
    )

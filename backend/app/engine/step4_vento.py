"""
Step 4: Vento (Wind Forces)

Calculates wind forces using wind areas and pressure coefficients.
Based on the Excel 'Vento' sheet.
"""

from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.engine.dll_replacement import pw_norma
from app.engine.step3_aree_vento import WindAreasResult


@dataclass
class WindResult:
    fw_braccio: float
    fw_rotazione: float
    fw_controbraccio: float
    fw_carico: float
    fw_total: float
    moment_wind: float


def calculate_wind(
    project_id: int,
    db: Session,
    wind_areas: WindAreasResult,
    q_ref: float,
    h: float,
) -> WindResult:
    p_norma = pw_norma(q_ref, h)

    fw_braccio = wind_areas.a_b * p_norma
    fw_rotazione = wind_areas.a_rc * p_norma
    fw_controbraccio = wind_areas.a_cb * p_norma
    fw_carico = wind_areas.a_pu * p_norma
    fw_total = fw_braccio + fw_rotazione + fw_controbraccio + fw_carico
    moment_wind = fw_total * h * 0.5

    return WindResult(
        fw_braccio=fw_braccio,
        fw_rotazione=fw_rotazione,
        fw_controbraccio=fw_controbraccio,
        fw_carico=fw_carico,
        fw_total=fw_total,
        moment_wind=moment_wind,
    )

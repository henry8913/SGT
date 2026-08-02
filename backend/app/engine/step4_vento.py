"""
Step 4: Vento (Wind Forces)

Calcola le forze del vento a partire dalle aree esposte e dalla pressione
normativa. I fattori della legge di pressione e il fattore di momento sono
coefficienti configurabili (tabella `coefficients`, modulo "vento").
"""

from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.engine.coefficients import get_coefficients
from app.engine.step3_aree_vento import WindAreasResult


@dataclass
class WindResult:
    fw_braccio: float
    fw_rotazione: float
    fw_controbraccio: float
    fw_carico: float
    fw_total: float
    moment_wind: float
    p_norma: float


def pw_norma(q_ref: float, h: float, c: dict) -> float:
    """Pressione del vento normativa (C25/FEM) con fattori da coefficienti."""
    f20 = c.get("fattore_h20", 1.0)
    f50 = c.get("fattore_h50", 1.2)
    f100 = c.get("fattore_h100", 1.5)
    if h <= 20:
        return q_ref * f20
    elif h <= 50:
        return q_ref * (f20 + (f50 - f20) * (h - 20) / 30)
    elif h <= 100:
        return q_ref * (f50 + (f100 - f50) * (h - 50) / 50)
    else:
        return q_ref * f100


def calculate_wind(
    project_id: int,
    db: Session,
    wind_areas: WindAreasResult,
    q_ref: float | None = None,
    h: float | None = None,
) -> WindResult:
    from app.models.machine import MachineCharacteristics

    c = get_coefficients(db, "vento")

    if q_ref is None:
        q_ref = c.get("q_riferimento", 50.0)
    if h is None:
        machine = db.query(MachineCharacteristics).filter(
            MachineCharacteristics.project_id == project_id
        ).first()
        h = (machine.altezza_max if machine and machine.altezza_max else 70.0)

    fattore_momento = c.get("fattore_momento_braccio", 0.5)
    p = pw_norma(q_ref, h, c)

    fw_braccio = wind_areas.a_b * p
    fw_rotazione = wind_areas.a_rc * p
    fw_controbraccio = wind_areas.a_cb * p
    fw_carico = wind_areas.a_pu * p
    fw_total = fw_braccio + fw_rotazione + fw_controbraccio + fw_carico
    moment_wind = fw_total * h * fattore_momento

    return WindResult(
        fw_braccio=fw_braccio,
        fw_rotazione=fw_rotazione,
        fw_controbraccio=fw_controbraccio,
        fw_carico=fw_carico,
        fw_total=fw_total,
        moment_wind=moment_wind,
        p_norma=p,
    )

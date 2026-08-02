"""
Step 8: Diagramma di Carico (grafico carico/raggio)

I fattori di riduzione sono coefficienti configurabili (modulo "diagramma").
"""

from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.engine.coefficients import get_coefficients


@dataclass
class DiagramPoint:
    raggio: float
    carico_max: float
    carico_effettivo: float


@dataclass
class DiagrammaResult:
    points: list[DiagramPoint]


def calculate_diagramma(project_id: int, db: Session, load_curves: list, masses: list) -> DiagrammaResult:
    c = get_coefficients(db, "diagramma")
    raggio_max = c.get("raggio_max", 65.0)
    coeff_riduzione = c.get("coefficiente_riduzione_raggio", 0.3)
    massa_max = c.get("massa_max", 100000.0)
    fattore_min = c.get("fattore_minimo", 0.5)

    points = []
    total_mass = sum(m.get("massa_kg", 0) for m in masses) if masses else 0

    for lc in load_curves:
        raggio = lc.get("raggio", 0)
        carico_max = lc.get("carico_max", 0)
        fattore = max(fattore_min, 1.0 - (raggio / raggio_max) * coeff_riduzione) if raggio_max > 0 else fattore_min
        carico_effettivo = carico_max * fattore * (1 - total_mass / massa_max) if total_mass < massa_max else 0

        points.append(DiagramPoint(
            raggio=raggio,
            carico_max=carico_max,
            carico_effettivo=round(carico_effettivo, 2),
        ))

    return DiagrammaResult(points=points)

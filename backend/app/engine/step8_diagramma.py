"""
Step 8: Diagramma di Carico (Load Diagram)

Generates the final load diagram combining load curves with mass data.
Based on the Excel 'Diagramma di carico' sheet.
"""

from dataclasses import dataclass

from sqlalchemy.orm import Session


@dataclass
class DiagramPoint:
    raggio: float
    carico_max: float
    carico_effettivo: float


@dataclass
class DiagrammaResult:
    points: list[DiagramPoint]


def calculate_diagramma(project_id: int, db: Session, load_curves: list, masses: list) -> DiagrammaResult:
    points = []

    total_mass = sum(m.get("massa_kg", 0) for m in masses) if masses else 0

    for lc in load_curves:
        raggio = lc.get("raggio", 0)
        carico_max = lc.get("carico_max", 0)
        fattore = max(0.5, 1.0 - (raggio / 65.0) * 0.3)
        carico_effettivo = carico_max * fattore * (1 - total_mass / 100000.0) if total_mass < 100000 else 0

        points.append(DiagramPoint(
            raggio=raggio,
            carico_max=carico_max,
            carico_effettivo=round(carico_effettivo, 2),
        ))

    return DiagrammaResult(points=points)

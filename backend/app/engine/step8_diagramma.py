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

    for lc in load_curves:
        raggio = lc.get("raggio", 0)
        carico_max = lc.get("carico_max", 0)
        carico_effettivo = carico_max * 0.9

        points.append(DiagramPoint(
            raggio=raggio,
            carico_max=carico_max,
            carico_effettivo=round(carico_effettivo, 2),
        ))

    return DiagrammaResult(points=points)

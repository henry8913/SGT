"""
Step 2: Curve di Carico (Load Curves)

Calculates load curves based on machine characteristics and mass data.
Based on the Excel 'Curve_di_carico II + II IV' sheet.
"""

from dataclasses import dataclass

from sqlalchemy.orm import Session


@dataclass
class LoadCurveResult:
    raggio: float
    carico_max: float


def calculate_load_curves(project_id: int, db: Session) -> list[LoadCurveResult]:
    from app.models.load_curves import LoadCurve

    curves = db.query(LoadCurve).filter(LoadCurve.project_id == project_id).order_by(LoadCurve.raggio_m).all()

    return [
        LoadCurveResult(raggio=c.raggio_m, carico_max=c.carico_kg or 0.0)
        for c in curves
    ]

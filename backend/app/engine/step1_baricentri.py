"""
Step 1: Baricentri (Center of Gravity)

Calculates the center of gravity of all crane components using masses and
machine characteristics. Based on the Excel 'Baricentri' sheet.
"""

from dataclasses import dataclass

from sqlalchemy.orm import Session


@dataclass
class BaricentriResult:
    x_cg: float
    y_cg: float
    z_cg: float
    total_mass: float
    moment_x: float
    moment_y: float
    moment_z: float


def calculate_baricentri(project_id: int, db: Session) -> BaricentriResult:
    from app.models.masses import Mass

    masses = db.query(Mass).filter(Mass.project_id == project_id, Mass.utilizzato == True).all()

    total_mass = 0.0
    moment_x = 0.0
    moment_y = 0.0
    moment_z = 0.0

    for m in masses:
        mass = m.massa_kg or 0.0
        total_mass += mass
        moment_x += mass * (m.coordinata_x or 0.0)
        moment_y += mass * (m.coordinata_y or 0.0)
        moment_z += mass * (m.braccio_m or 0.0)

    x_cg = moment_x / total_mass if total_mass > 0 else 0.0
    y_cg = moment_y / total_mass if total_mass > 0 else 0.0
    z_cg = moment_z / total_mass if total_mass > 0 else 0.0

    return BaricentriResult(
        x_cg=x_cg,
        y_cg=y_cg,
        z_cg=z_cg,
        total_mass=total_mass,
        moment_x=moment_x,
        moment_y=moment_y,
        moment_z=moment_z,
    )

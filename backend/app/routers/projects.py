from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.machine import MachineCharacteristics
from app.models.project import Project
from app.routers.auth import get_current_user
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate, ProjectList

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("", response_model=list[ProjectList])
def list_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Project).order_by(Project.updated_at.desc())
    if not current_user.is_admin:
        query = query.filter(Project.user_id == current_user.id)
    return query.all()


@router.post("", response_model=ProjectResponse, status_code=201)
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = Project(name=data.name, notes=data.notes, user_id=current_user.id)
    db.add(project)
    db.commit()
    db.refresh(project)

    _copy_default_results(project.id, db)
    return project


def _copy_default_results(project_id: int, db: Session):
    import json, os
    json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "default_results.json")
    if os.path.exists(json_path):
        from app.models.results import Result
        with open(json_path) as f:
            default_results = json.load(f)
        for step, dati in default_results.items():
            existing = db.query(Result).filter(
                Result.project_id == project_id, Result.step == step
            ).first()
            if not existing:
                r = Result(project_id=project_id, step=step, dati=dati)
                db.add(r)
    _copy_template_input_data(project_id, db)
    db.commit()


def _copy_template_input_data(project_id: int, db: Session):
    from app.models.machine import MachineCharacteristics
    from app.models.masses import Mass
    from app.models.load_curves import LoadCurve
    from app.models.stability import StabilityParam
    from app.models.wind_areas import WindArea

    tmpl_id = 9999
    tmpl_machine = db.query(MachineCharacteristics).filter(
        MachineCharacteristics.project_id == tmpl_id
    ).first()
    if tmpl_machine and not db.query(MachineCharacteristics).filter(
        MachineCharacteristics.project_id == project_id
    ).first():
        mc = MachineCharacteristics(project_id=project_id)
        for col in ["sbraccio_max", "carico_punta_tiro2", "carico_punta_tiro24",
                     "carico_max_tiro2", "escursione_carrello_tiro2", "carico_max_tiro24",
                     "escursione_carrello_tiro24", "altezza_max", "diametro_funi_sollevamento",
                     "diametro_fune_carrello"]:
            setattr(mc, col, getattr(tmpl_machine, col, None))
        db.add(mc)

    tmpl_masses = db.query(Mass).filter(Mass.project_id == tmpl_id).all()
    if tmpl_masses and not db.query(Mass).filter(Mass.project_id == project_id).first():
        for m in tmpl_masses:
            db.add(Mass(project_id=project_id, componente=m.componente,
                        massa_kg=m.massa_kg, braccio_m=m.braccio_m, utilizzato=m.utilizzato))

    tmpl_curves = db.query(LoadCurve).filter(LoadCurve.project_id == tmpl_id).all()
    if tmpl_curves and not db.query(LoadCurve).filter(LoadCurve.project_id == project_id).first():
        for c in tmpl_curves:
            db.add(LoadCurve(project_id=project_id, tipo=c.tipo,
                             raggio_m=c.raggio_m, carico_kg=c.carico_kg))

    tmpl_stab = db.query(StabilityParam).filter(StabilityParam.project_id == tmpl_id).all()
    if tmpl_stab and not db.query(StabilityParam).filter(StabilityParam.project_id == project_id).first():
        for s in tmpl_stab:
            db.add(StabilityParam(project_id=project_id, parametro=s.parametro, valore=s.valore, descrizione=s.descrizione))

    tmpl_areas = db.query(WindArea).filter(WindArea.project_id == tmpl_id).all()
    if tmpl_areas and not db.query(WindArea).filter(WindArea.project_id == project_id).first():
        for a in tmpl_areas:
            db.add(WindArea(project_id=project_id, parte=a.parte, parametro=a.parametro,
                            valore=a.valore, coordinata_x=a.coordinata_x, coordinata_y=a.coordinata_y))


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not current_user.is_admin and project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not current_user.is_admin and project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(project, key, val)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=204)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not current_user.is_admin and project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    db.delete(project)
    db.commit()


@router.post("/{project_id}/duplicate", response_model=ProjectResponse, status_code=201)
def duplicate_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    original = db.query(Project).filter(Project.id == project_id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Project not found")
    if not current_user.is_admin and original.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    new_project = Project(
        name=f"{original.name} (copia)",
        notes=original.notes,
        user_id=current_user.id,
    )
    db.add(new_project)
    db.flush()

    for model_cls, rel_name in [
        (MachineCharacteristics, "machine"),
    ]:
        original_rel = getattr(original, rel_name, None)
        if original_rel:
            new_rel = model_cls(project_id=new_project.id)
            for col in model_cls.__table__.columns:
                if col.name not in ("id", "project_id", "created_at"):
                    val = getattr(original_rel, col.name, None)
                    if val is not None:
                        setattr(new_rel, col.name, val)
            db.add(new_rel)

    db.commit()
    db.refresh(new_project)
    return new_project

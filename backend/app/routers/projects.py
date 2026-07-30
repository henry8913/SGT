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
    if not os.path.exists(json_path):
        return
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
    db.commit()


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

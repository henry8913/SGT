from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.masses import Mass
from app.schemas.masses import MassCreate, MassResponse, MassUpdate

router = APIRouter(prefix="/api/projects/{project_id}/masses", tags=["masses"])


@router.get("", response_model=list[MassResponse])
def list_masses(project_id: int, db: Session = Depends(get_db)):
    return db.query(Mass).filter(Mass.project_id == project_id).all()


@router.post("", response_model=MassResponse, status_code=201)
def create_mass(project_id: int, data: MassCreate, db: Session = Depends(get_db)):
    item = Mass(project_id=project_id, **data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=MassResponse)
def update_mass(project_id: int, item_id: int, data: MassUpdate, db: Session = Depends(get_db)):
    item = db.query(Mass).filter(
        Mass.id == item_id, Mass.project_id == project_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Mass not found")
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(item, key, val)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
def delete_mass(project_id: int, item_id: int, db: Session = Depends(get_db)):
    item = db.query(Mass).filter(
        Mass.id == item_id, Mass.project_id == project_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Mass not found")
    db.delete(item)
    db.commit()

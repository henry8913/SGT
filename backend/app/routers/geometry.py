from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.geometry import BeamGeometry
from app.schemas.geometry import BeamGeometryCreate, BeamGeometryResponse, BeamGeometryUpdate

router = APIRouter(prefix="/api/projects/{project_id}/geometry", tags=["geometry"])


@router.get("", response_model=list[BeamGeometryResponse])
def list_geometry(project_id: int, db: Session = Depends(get_db)):
    return db.query(BeamGeometry).filter(BeamGeometry.project_id == project_id).all()


@router.post("", response_model=BeamGeometryResponse, status_code=201)
def create_geometry(project_id: int, data: BeamGeometryCreate, db: Session = Depends(get_db)):
    item = BeamGeometry(project_id=project_id, **data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=BeamGeometryResponse)
def update_geometry(project_id: int, item_id: int, data: BeamGeometryUpdate, db: Session = Depends(get_db)):
    item = db.query(BeamGeometry).filter(
        BeamGeometry.id == item_id, BeamGeometry.project_id == project_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Geometry item not found")
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(item, key, val)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
def delete_geometry(project_id: int, item_id: int, db: Session = Depends(get_db)):
    item = db.query(BeamGeometry).filter(
        BeamGeometry.id == item_id, BeamGeometry.project_id == project_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Geometry item not found")
    db.delete(item)
    db.commit()

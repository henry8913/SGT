from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.load_curves import LoadCurve
from app.schemas.load_curves import LoadCurveCreate, LoadCurveResponse, LoadCurveUpdate

router = APIRouter(prefix="/api/projects/{project_id}/load-curves", tags=["load_curves"])


@router.get("", response_model=list[LoadCurveResponse])
def list_load_curves(project_id: int, db: Session = Depends(get_db)):
    return db.query(LoadCurve).filter(LoadCurve.project_id == project_id).order_by(LoadCurve.raggio_m).all()


@router.post("", response_model=LoadCurveResponse, status_code=201)
def create_load_curve(project_id: int, data: LoadCurveCreate, db: Session = Depends(get_db)):
    item = LoadCurve(project_id=project_id, **data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=LoadCurveResponse)
def update_load_curve(project_id: int, item_id: int, data: LoadCurveUpdate, db: Session = Depends(get_db)):
    item = db.query(LoadCurve).filter(
        LoadCurve.id == item_id, LoadCurve.project_id == project_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Load curve not found")
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(item, key, val)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
def delete_load_curve(project_id: int, item_id: int, db: Session = Depends(get_db)):
    item = db.query(LoadCurve).filter(
        LoadCurve.id == item_id, LoadCurve.project_id == project_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Load curve not found")
    db.delete(item)
    db.commit()

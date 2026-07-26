from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.stability import StabilityParam
from app.schemas.stability import StabilityParamCreate, StabilityParamResponse, StabilityParamUpdate

router = APIRouter(prefix="/api/projects/{project_id}/stability", tags=["stability"])


@router.get("", response_model=list[StabilityParamResponse])
def list_stability_params(project_id: int, db: Session = Depends(get_db)):
    return db.query(StabilityParam).filter(StabilityParam.project_id == project_id).all()


@router.post("", response_model=StabilityParamResponse, status_code=201)
def create_stability_param(project_id: int, data: StabilityParamCreate, db: Session = Depends(get_db)):
    item = StabilityParam(project_id=project_id, **data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=StabilityParamResponse)
def update_stability_param(project_id: int, item_id: int, data: StabilityParamUpdate, db: Session = Depends(get_db)):
    item = db.query(StabilityParam).filter(
        StabilityParam.id == item_id, StabilityParam.project_id == project_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Stability param not found")
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(item, key, val)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
def delete_stability_param(project_id: int, item_id: int, db: Session = Depends(get_db)):
    item = db.query(StabilityParam).filter(
        StabilityParam.id == item_id, StabilityParam.project_id == project_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Stability param not found")
    db.delete(item)
    db.commit()

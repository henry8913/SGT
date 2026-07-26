from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.wind_areas import WindArea
from app.schemas.wind_areas import WindAreaCreate, WindAreaResponse, WindAreaUpdate

router = APIRouter(prefix="/api/projects/{project_id}/wind-areas", tags=["wind_areas"])


@router.get("", response_model=list[WindAreaResponse])
def list_wind_areas(project_id: int, db: Session = Depends(get_db)):
    return db.query(WindArea).filter(WindArea.project_id == project_id).all()


@router.post("", response_model=WindAreaResponse, status_code=201)
def create_wind_area(project_id: int, data: WindAreaCreate, db: Session = Depends(get_db)):
    item = WindArea(project_id=project_id, **data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=WindAreaResponse)
def update_wind_area(project_id: int, item_id: int, data: WindAreaUpdate, db: Session = Depends(get_db)):
    item = db.query(WindArea).filter(
        WindArea.id == item_id, WindArea.project_id == project_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Wind area not found")
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(item, key, val)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
def delete_wind_area(project_id: int, item_id: int, db: Session = Depends(get_db)):
    item = db.query(WindArea).filter(
        WindArea.id == item_id, WindArea.project_id == project_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Wind area not found")
    db.delete(item)
    db.commit()

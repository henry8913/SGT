from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.machine import MachineCharacteristics
from app.schemas.machine import (
    MachineCharacteristicsCreate,
    MachineCharacteristicsResponse,
    MachineCharacteristicsUpdate,
)

router = APIRouter(prefix="/api/projects/{project_id}/machine", tags=["machine"])


@router.get("", response_model=MachineCharacteristicsResponse)
def get_machine(project_id: int, db: Session = Depends(get_db)):
    machine = db.query(MachineCharacteristics).filter(
        MachineCharacteristics.project_id == project_id
    ).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine characteristics not found")
    return machine


@router.put("", response_model=MachineCharacteristicsResponse)
def upsert_machine(project_id: int, data: MachineCharacteristicsUpdate, db: Session = Depends(get_db)):
    machine = db.query(MachineCharacteristics).filter(
        MachineCharacteristics.project_id == project_id
    ).first()
    if machine:
        for key, val in data.model_dump(exclude_unset=True).items():
            setattr(machine, key, val)
    else:
        machine = MachineCharacteristics(project_id=project_id, **data.model_dump(exclude_unset=True))
        db.add(machine)
    db.commit()
    db.refresh(machine)
    return machine


@router.post("", response_model=MachineCharacteristicsResponse, status_code=201)
def create_machine(project_id: int, data: MachineCharacteristicsCreate, db: Session = Depends(get_db)):
    existing = db.query(MachineCharacteristics).filter(
        MachineCharacteristics.project_id == project_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Machine characteristics already exist")
    machine = MachineCharacteristics(project_id=project_id, **data.model_dump())
    db.add(machine)
    db.commit()
    db.refresh(machine)
    return machine

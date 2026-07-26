from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.beam_profile import BeamProfile

router = APIRouter(prefix="/api/profiles", tags=["profiles"])


@router.get("")
def list_profiles(db: Session = Depends(get_db)):
    return db.query(BeamProfile).order_by(BeamProfile.nome).all()


@router.post("", status_code=201)
def create_profile(data: dict, db: Session = Depends(get_db)):
    existing = db.query(BeamProfile).filter(BeamProfile.nome == data.get("nome")).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")
    profile = BeamProfile(**data)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.delete("/{profile_id}", status_code=204)
def delete_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(BeamProfile).filter(BeamProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    db.delete(profile)
    db.commit()

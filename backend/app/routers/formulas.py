from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.formulas import Formula
from app.schemas.formulas import FormulaCreate, FormulaResponse, FormulaUpdate

router = APIRouter(prefix="/api/formulas", tags=["formulas"])


@router.get("", response_model=list[FormulaResponse])
def list_formulas(step: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Formula)
    if step:
        query = query.filter(Formula.step == step)
    return query.order_by(Formula.step, Formula.campo).all()


@router.get("/{formula_id}", response_model=FormulaResponse)
def get_formula(formula_id: int, db: Session = Depends(get_db)):
    formula = db.query(Formula).filter(Formula.id == formula_id).first()
    if not formula:
        raise HTTPException(status_code=404, detail="Formula not found")
    return formula


@router.post("", response_model=FormulaResponse, status_code=201)
def create_formula(data: FormulaCreate, db: Session = Depends(get_db)):
    formula = Formula(**data.model_dump())
    db.add(formula)
    db.commit()
    db.refresh(formula)
    return formula


@router.put("/{formula_id}", response_model=FormulaResponse)
def update_formula(formula_id: int, data: FormulaUpdate, db: Session = Depends(get_db)):
    formula = db.query(Formula).filter(Formula.id == formula_id).first()
    if not formula:
        raise HTTPException(status_code=404, detail="Formula not found")
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(formula, key, val)
    db.commit()
    db.refresh(formula)
    return formula


@router.delete("/{formula_id}", status_code=204)
def delete_formula(formula_id: int, db: Session = Depends(get_db)):
    formula = db.query(Formula).filter(Formula.id == formula_id).first()
    if not formula:
        raise HTTPException(status_code=404, detail="Formula not found")
    db.delete(formula)
    db.commit()

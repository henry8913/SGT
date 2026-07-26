import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.engine.calculator import Calculator
from app.models.project import Project
from app.schemas.results import ResultResponse

router = APIRouter(prefix="/api/projects/{project_id}", tags=["calculate"])


@router.post("/calcola", response_model=dict)
def calculate(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    calculator = Calculator(project_id, db)
    results = calculator.run_all()
    return {"status": "ok", "steps_completed": list(results.keys()), "results": results}


@router.get("/risultati", response_model=list[ResultResponse])
def get_results(project_id: int, db: Session = Depends(get_db)):
    from app.models.results import Result
    return db.query(Result).filter(Result.project_id == project_id).all()

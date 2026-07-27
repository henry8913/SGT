import json
import tempfile
import os

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.formulas import Formula
from app.routers.auth import get_current_user
from app.models.user import User
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


STEP_MAP = {
    "Proprietà_beam": "profili",
    "Caratteristiche_macchina": "macchina",
    "Geometria_braccio": "geometria",
    "Masse_proprie": "masse",
    "Baricentri": "baricentri",
    "A_b": "aree_vento",
    "A_rc": "aree_vento",
    "A_cb": "aree_vento",
    "A_Pu": "aree_vento",
    "Vento": "vento",
    "Stabilità C25-Q": "stabilita_q",
    "Stabilità C25-D": "stabilita_d",
    "Carrichi ralla e base - C25": "carichi_ralla",
    "Curve_di_carico II": "curve_carico",
    "Curve_di_carico II IV": "curve_carico",
    "Diagramma di carico": "diagramma",
    "Elenchi a discesa": "dropdown",
}


@router.post("/upload", status_code=200)
def upload_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename.endswith((".xlsm", ".xlsx")):
        raise HTTPException(status_code=400, detail="Only .xlsm or .xlsx files are accepted")

    try:
        import openpyxl

        with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsm") as tmp:
            content = file.file.read()
            tmp.write(content)
            tmp_path = tmp.name

        wb = openpyxl.load_workbook(tmp_path, data_only=False, keep_vba=False)
        os.unlink(tmp_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading Excel file: {str(e)}")

    extracted = []
    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        step = STEP_MAP.get(sheet_name, "altro")
        for row in ws.iter_rows(min_row=1, max_row=ws.max_row, max_col=min(ws.max_column, 150)):
            for cell in row:
                if cell.value and isinstance(cell.value, str) and cell.value.strip().startswith("="):
                    formula_text = cell.value.strip()
                    if formula_text == "=":
                        continue
                    extracted.append({
                        "step": step,
                        "sheet": sheet_name,
                        "campo": cell.coordinate,
                        "formula": formula_text,
                        "label": f"{sheet_name}_{cell.coordinate}",
                    })

    db.query(Formula).delete()
    db.commit()

    batch_size = 500
    total = len(extracted)
    for i in range(0, total, batch_size):
        batch = extracted[i:i + batch_size]
        for f in batch:
            db.add(Formula(**f))
        db.commit()

    wb.close()

    return {
        "status": "ok",
        "formule_importate": total,
        "sheets": len(wb.sheetnames),
        "message": f"Importate {total} formule da {len(wb.sheetnames)} fogli",
    }

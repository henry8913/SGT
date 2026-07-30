import json
import re
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


def _col_to_number(col):
    n = 0
    for c in col:
        n = n * 26 + (ord(c) - ord('A') + 1)
    return n


@router.get("", response_model=list[FormulaResponse])
def list_formulas(step: str | None = None, sheet: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Formula)
    if step:
        query = query.filter(Formula.step == step)
    if sheet:
        query = query.filter(Formula.sheet == sheet)
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

    def _is_blue(cell) -> bool:
        try:
            fill = cell.fill
            if fill and fill.start_color and fill.start_color.rgb:
                rgb = str(fill.start_color.rgb).upper()
                # Blue shades commonly used in Excel
                for blue in ['0000FF', '0070C0', '00B0F0', '4472C4', '5B9BD5', 'BDD7EE', '8DB4E2']:
                    if blue in rgb:
                        return True
                # Check theme color
                if fill.start_color.theme is not None:
                    # Blue theme colors are typically 4-7
                    if fill.start_color.theme in (4, 5, 6, 7):
                        return True
        except Exception:
            pass
        return False

    extracted = []
    cell_map = {}
    stats = {"formulas": 0, "inputs": 0, "labels": 0}

    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        step = STEP_MAP.get(sheet_name, "altro")

        for row in ws.iter_rows(min_row=1, max_row=ws.max_row, max_col=min(ws.max_column, 120)):
            for cell in row:
                if cell.value is None:
                    continue

                cell_text = str(cell.value).strip()
                cell_ref = cell.coordinate

                if cell_text.startswith("=") and cell_text != "=":
                    entry = {
                        "step": step,
                        "sheet": sheet_name,
                        "campo": cell_ref,
                        "cell_type": "formula",
                        "formula": cell_text,
                        "default_value": None,
                        "label": "",
                    }
                    stats["formulas"] += 1

                elif _is_blue(cell):
                    try:
                        val = float(cell.value)
                        entry = {
                            "step": step,
                            "sheet": sheet_name,
                            "campo": cell_ref,
                            "cell_type": "input",
                            "formula": str(val),
                            "default_value": str(val),
                            "label": "",
                        }
                        stats["inputs"] += 1
                    except (ValueError, TypeError):
                        continue

                elif isinstance(cell.value, (int, float)) and not cell_text.startswith("="):
                    entry = {
                        "step": step,
                        "sheet": sheet_name,
                        "campo": cell_ref,
                        "cell_type": "input",
                        "formula": str(cell.value),
                        "default_value": str(cell.value),
                        "label": "",
                    }
                    stats["inputs"] += 1

                else:
                    entry = {
                        "step": step,
                        "sheet": sheet_name,
                        "campo": cell_ref,
                        "cell_type": "label",
                        "formula": cell_text,
                        "default_value": cell_text,
                        "label": cell_text,
                    }
                    stats["labels"] += 1

                extracted.append(entry)
                key = (sheet_name, cell.row, cell.column)
                cell_map[key] = entry

    for entry in extracted:
        if entry["cell_type"] in ("input", "formula", "constant") and not entry["label"]:
            sheet = entry["sheet"]
            match = re.match(r'([A-Z]+)(\d+)', entry["campo"])
            if match:
                col_letters = match.group(1)
                row_num = int(match.group(2))
                col_num = _col_to_number(col_letters)
                for c in range(col_num - 1, 0, -1):
                    key = (sheet, row_num, c)
                    if key in cell_map:
                        neighbor = cell_map[key]
                        if neighbor["cell_type"] == "label":
                            entry["label"] = neighbor["label"]
                            break
                if not entry["label"]:
                    for r in range(row_num - 1, max(0, row_num - 10), -1):
                        key = (sheet, r, col_num)
                        if key in cell_map:
                            neighbor = cell_map[key]
                            if neighbor["cell_type"] == "label":
                                entry["label"] = neighbor["label"]
                                break

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
        "total": total,
        "formulas": stats["formulas"],
        "inputs": stats["inputs"],
        "labels": stats["labels"],
        "sheets": len(wb.sheetnames),
        "message": f"Importate {stats['formulas']} formule, {stats['inputs']} input, {stats['labels']} etichette da {len(wb.sheetnames)} fogli",
    }

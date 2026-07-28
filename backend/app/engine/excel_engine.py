"""
Excel Calculation Engine using the 'formulas' library.

Evaluates Excel formulas exactly as they appear, resolving cell references,
handling IF statements, ISNUMBER, sheet references, etc. just like Excel does.
"""

import json
import os
import tempfile
from collections import OrderedDict
from typing import Any

import formulas
import openpyxl
from sqlalchemy.orm import Session

from app.models.formulas import Formula
from app.models.machine import MachineCharacteristics
from app.models.stability import StabilityParam
from app.models.masses import Mass
from app.models.load_curves import LoadCurve
from app.models.wind_areas import WindArea
from app.models.beam_profile import BeamProfile


SHEET_ORDER = [
    "Proprietà_beam",
    "Caratteristiche_macchina",
    "Geometria_braccio",
    "Masse_proprie",
    "Elenchi a discesa",
    "Baricentri",
    "A_b", "A_rc", "A_cb", "A_Pu",
    "Vento",
    "Stabilità C25-Q",
    "Stabilità C25-D",
    "Carrichi ralla e base - C25",
    "Curve_di_carico II",
    "Curve_di_carico II IV",
    "Diagramma di carico",
]

STEP_MAP = {
    "Proprietà_beam": "profili",
    "Caratteristiche_macchina": "macchina",
    "Geometria_braccio": "geometria",
    "Masse_proprie": "masse",
    "Baricentri": "baricentri",
    "A_b": "aree_vento", "A_rc": "aree_vento", "A_cb": "aree_vento", "A_Pu": "aree_vento",
    "Vento": "vento",
    "Stabilità C25-Q": "stabilita_q",
    "Stabilità C25-D": "stabilita_d",
    "Carrichi ralla e base - C25": "carichi_ralla",
    "Curve_di_carico II": "curve_carico",
    "Curve_di_carico II IV": "curve_carico",
    "Diagramma di carico": "diagramma",
    "Elenchi a discesa": "dropdown",
}


INPUT_SHEETS = {
    "Caratteristiche_macchina",
    "Geometria_braccio",
    "Masse_proprie",
    "Curve_di_carico II",
    "Curve_di_carico II IV",
    "A_b", "A_rc", "A_cb", "A_Pu",
    "Stabilità C25-Q",
    "Stabilità C25-D",
    "Proprietà_beam",
}


def build_xlsx_from_db(project_id: int, db: Session) -> str:
    """Build a temporary .xlsx file from database formulas and input values.

    The 'formulas' library works by reading an actual .xlsx file.
    We create one on the fly with all formulas from the DB plus input values.

    Returns:
        Path to the temporary .xlsx file.
    """
    wb = openpyxl.Workbook()
    wb.remove(wb.active)

    all_db_formulas = db.query(Formula).all()

    by_sheet: dict[str, dict[str, str]] = {}
    for f in all_db_formulas:
        if f.sheet not in by_sheet:
            by_sheet[f.sheet] = {}
        by_sheet[f.sheet][f.campo] = f.formula

    for sheet_name in SHEET_ORDER:
        if sheet_name not in by_sheet:
            continue
        ws = wb.create_sheet(title=sheet_name)
        formulas_dict = by_sheet[sheet_name]
        max_col = 0
        max_row = 0
        for cell_ref in formulas_dict.keys():
            import re
            m = re.match(r'\$?([A-Z]+)\$?(\d+)', cell_ref)
            if m:
                col_str = m.group(1)
                row = int(m.group(2))
                col_idx = 0
                for c in col_str:
                    col_idx = col_idx * 26 + (ord(c) - ord('A') + 1)
                max_col = max(max_col, col_idx)
                max_row = max(max_row, row)

        for cell_ref, formula_text in formulas_dict.items():
            ws[cell_ref] = formula_text

    input_values = _load_input_values(project_id, db)
    for (sheet, cell), value in input_values.items():
        if sheet in wb.sheetnames:
            wb[sheet][cell] = value

    tmp_path = os.path.join(tempfile.gettempdir(), f"sgt_calc_{project_id}.xlsx")
    wb.save(tmp_path)
    wb.close()
    return tmp_path


def _load_input_values(project_id: int, db: Session) -> dict[tuple[str, str], float]:
    """Load input values (blue cells) from project tables."""
    inputs = {}

    machine = db.query(MachineCharacteristics).filter(
        MachineCharacteristics.project_id == project_id
    ).first()
    if machine:
        cols = ["sbraccio_max", "carico_punta_tiro2", "carico_punta_tiro24",
                "carico_max_tiro2", "escursione_carrello_tiro2", "carico_max_tiro24",
                "escursione_carrello_tiro24", "altezza_max", "diametro_funi_sollevamento",
                "diametro_fune_carrello"]
        s_cols = ["S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S12", "S13"]
        for col, s in zip(cols, s_cols):
            val = getattr(machine, col, None)
            if val is not None:
                inputs[("Caratteristiche_macchina", s)] = float(val)

    params = db.query(StabilityParam).filter(
        StabilityParam.project_id == project_id
    ).all()
    for p in params:
        if p.valore is not None:
            inputs[("Stabilità C25-Q", p.parametro)] = float(p.valore)
            inputs[("Stabilità C25-D", p.parametro)] = float(p.valore)

    masses = db.query(Mass).filter(
        Mass.project_id == project_id, Mass.utilizzato == True
    ).all()
    for idx, m in enumerate(masses):
        row = idx + 1
        if m.massa_kg is not None:
            inputs[("Masse_proprie", f"Q{row}")] = float(m.massa_kg)
        if m.braccio_m is not None:
            inputs[("Masse_proprie", f"T{row}")] = float(m.braccio_m)

    curves = db.query(LoadCurve).filter(
        LoadCurve.project_id == project_id
    ).all()
    for idx, c in enumerate(curves):
        row = idx + 1
        sheet = "Curve_di_carico II" if c.tipo == "II" else "Curve_di_carico II IV"
        if c.carico_kg is not None:
            inputs[(sheet, f"R{row}")] = float(c.carico_kg)

    areas = db.query(WindArea).filter(
        WindArea.project_id == project_id
    ).all()
    for idx, a in enumerate(areas):
        row = idx + 1
        inputs[(f"A_{a.parte}", f"V{row}")] = a.valore or 0.0

    return inputs


def run_engine(project_id: int, db: Session) -> dict[str, Any]:
    """Run the Excel engine using the 'formulas' library.

    Builds a temporary .xlsx from DB formulas + project input values,
    then evaluates everything using formulas.Calculator(),
    and returns structured results per sheet/step.

    Returns:
        dict: { step_key: { "sheet": ..., "cells": int, "values": { cell: value } } }
    """
    xlsx_path = build_xlsx_from_db(project_id, db)

    try:
        from formulas import excel as fe

        xl_model = fe.ExcelModel()
        xl_model.read(filepath=xlsx_path, output=False)
        xl_model.calculate()
        result = xl_model.to_dict()

        formatted = {}
        for sheet_name in SHEET_ORDER:
            if sheet_name not in result:
                continue
            sheet_data = result[sheet_name]
            if not sheet_data:
                continue

            step_key = STEP_MAP.get(sheet_name, "altro")
            values = {}
            for cell_ref, cell_info in sheet_data.items():
                if isinstance(cell_info, dict):
                    val = cell_info.get("value", cell_info.get("formula", ""))
                else:
                    val = cell_info

                if val is not None and val != "":
                    try:
                        values[cell_ref] = round(float(val), 4)
                    except (ValueError, TypeError):
                        values[cell_ref] = str(val)

            if values:
                formatted[step_key] = {
                    "sheet": sheet_name,
                    "cells": len(values),
                    "values": values,
                }

        return formatted

    except Exception as e:
        import traceback
        return {"error": str(e), "traceback": traceback.format_exc()}

    finally:
        try:
            os.remove(xlsx_path)
        except Exception:
            pass

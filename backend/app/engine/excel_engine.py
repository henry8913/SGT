"""
Excel-like Calculation Engine

Evaluates formulas exactly as they appear in the Excel file,
resolving cell references across sheets, handling dependencies,
and computing values in the correct order.
"""

import re
from collections import defaultdict, deque
from typing import Any

from sqlalchemy.orm import Session

from app.engine.dll_replacement import BUILTIN_FUNCTIONS
from app.models.formulas import Formula


SHEET_STEP_MAP = {
    "Baricentri": "baricentri",
    "A_b": "aree_vento", "A_rc": "aree_vento", "A_cb": "aree_vento", "A_Pu": "aree_vento",
    "Vento": "vento",
    "Stabilità C25-Q": "stabilita_q",
    "Stabilità C25-D": "stabilita_d",
    "Carrichi ralla e base - C25": "carichi_ralla",
    "Curve_di_carico II": "curve_carico",
    "Curve_di_carico II IV": "curve_carico",
    "Diagramma di carico": "diagramma",
    "Proprietà_beam": "profili",
    "Geometria_braccio": "geometria",
    "Masse_proprie": "masse",
    "Elenchi a discesa": "dropdown",
}

# Cells that are INPUTS (blue cells in Excel) — user provides these values
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


class ExcelEngine:
    def __init__(self, project_id: int, db: Session):
        self.project_id = project_id
        self.db = db
        self.formulas: dict[tuple[str, str], str] = {}  # (sheet, cell) -> formula
        self.values: dict[tuple[str, str], float] = {}  # (sheet, cell) -> computed value
        self.inputs: dict[tuple[str, str], float] = {}  # (sheet, cell) -> input value
        self.deps: dict[tuple[str, str], list[tuple[str, str]]] = {}  # dependencies
        self.load_formulas()

    def load_formulas(self):
        """Load all formulas from DB."""
        all_formulas = self.db.query(Formula).all()
        for f in all_formulas:
            self.formulas[(f.sheet, f.campo)] = f.formula

    def load_inputs_from_project(self):
        """Load input values from project tables."""
        from app.models.machine import MachineCharacteristics
        from app.models.geometry import BeamGeometry
        from app.models.masses import Mass
        from app.models.load_curves import LoadCurve
        from app.models.wind_areas import WindArea
        from app.models.stability import StabilityParam
        from app.models.beam_profile import BeamProfile

        machine = self.db.query(MachineCharacteristics).filter(
            MachineCharacteristics.project_id == self.project_id
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
                    self.inputs[("Caratteristiche_macchina", s)] = float(val)

        params = self.db.query(StabilityParam).filter(
            StabilityParam.project_id == self.project_id
        ).all()
        for p in params:
            if p.valore is not None:
                self.inputs[("Stabilità C25-Q", p.parametro)] = float(p.valore)
                self.inputs[("Stabilità C25-D", p.parametro)] = float(p.valore)

        masses = self.db.query(Mass).filter(
            Mass.project_id == self.project_id, Mass.utilizzato == True
        ).all()
        for idx, m in enumerate(masses):
            letter = chr(65 + (idx % 26))
            row = idx + 1
            if m.massa_kg is not None:
                self.inputs[("Masse_proprie", f"Q{row}")] = float(m.massa_kg)
            if m.braccio_m is not None:
                self.inputs[("Masse_proprie", f"T{row}")] = float(m.braccio_m)
            if m.coordinata_x is not None:
                self.inputs[("Masse_proprie", f"U{row}")] = float(m.coordinata_x)
            if m.coordinata_y is not None:
                self.inputs[("Masse_proprie", f"V{row}")] = float(m.coordinata_y)

        curves = self.db.query(LoadCurve).filter(
            LoadCurve.project_id == self.project_id
        ).all()
        for idx, c in enumerate(curves):
            row = idx + 1
            sheet = "Curve_di_carico II" if c.tipo == "II" else "Curve_di_carico II IV"
            if c.carico_kg is not None:
                self.inputs[(sheet, f"R{row}")] = float(c.carico_kg)

        areas = self.db.query(WindArea).filter(
            WindArea.project_id == self.project_id
        ).all()
        for idx, a in enumerate(areas):
            row = idx + 1
            if a.valore is not None:
                self.inputs[(f"A_{a.parte}", f"V{row}")] = float(a.valore)

    def _parse_cell_ref(self, ref: str) -> tuple[str, str] | None:
        """Parse a cell reference like 'A5', '$S$14', or 'Masse_proprie!A51'."""
        ref = ref.strip()
        match = re.match(r"^'?([A-Za-z_\s]+)'?!?\$?([A-Z]+)\$?(\d+)$", ref)
        if match:
            sheet = match.group(1).strip("'")
            col = match.group(2)
            row = match.group(3)
            return (sheet, f"{col}{row}")

        match = re.match(r"^\$?([A-Z]+)\$?(\d+)$", ref)
        if match:
            return ("", f"{match.group(1)}{match.group(2)}")

        return None

    def _extract_references(self, formula: str) -> list[tuple[str, str]]:
        """Extract all cell references from a formula."""
        refs = []
        parts = re.split(r'[\+\-\*\/\(\)\,\s]', formula)
        for part in parts:
            part = part.strip()
            if not part or part in ('', '+', '-', '*', '/', '(', ')', ','):
                continue
            if part.startswith('='):
                part = part[1:]
            ref = self._parse_cell_ref(part)
            if ref:
                refs.append(ref)
        return refs

    def resolve(self, sheet: str, cell: str) -> float:
        """Resolve a cell value: input, formula, or 0."""
        key = (sheet, cell)
        if key in self.values:
            return self.values[key]
        if key in self.inputs:
            self.values[key] = self.inputs[key]
            return self.values[key]

        formula = self.formulas.get(key)
        if formula:
            result = self._evaluate(formula, sheet)
            self.values[key] = result
            return result

        return 0.0

    def _evaluate(self, formula: str, current_sheet: str) -> float:
        """Evaluate a formula string, resolving references."""
        formula = formula.lstrip('=+')

        tokens = re.split(r'(\+\+|\+\-|\-\+|\-\-|[\+\-\*\/\(\)\,]|\s+)', formula)
        result_tokens = []

        for token in tokens:
            token = token.strip()
            if not token:
                continue
            if token in ('+', '-', '*', '/', '(', ')', ',', '++', '+-', '-+', '--'):
                result_tokens.append(token)
                continue

            ref = self._parse_cell_ref(token)
            if ref:
                sheet, cell = ref
                if not sheet:
                    sheet = current_sheet
                val = self.resolve(sheet, cell)
                result_tokens.append(str(val))
                continue

            if token.upper() in BUILTIN_FUNCTIONS:
                result_tokens.append(token)
                continue

            try:
                float(token)
                result_tokens.append(token)
            except ValueError:
                result_tokens.append('0')

        expr = ' '.join(result_tokens)
        expr = expr.replace('++', '+').replace('+-', '-').replace('-+', '-').replace('--', '+')

        try:
            safe_globals = {"__builtins__": {}}
            safe_globals.update(BUILTIN_FUNCTIONS)
            result = eval(expr, safe_globals, {})
            return float(result)
        except Exception:
            return 0.0

    def compute_sheet(self, sheet_name: str) -> dict[str, float]:
        """Compute all formulas for a given sheet."""
        results = {}
        for (sheet, cell), formula in self.formulas.items():
            if sheet == sheet_name:
                try:
                    val = self._evaluate(formula, sheet)
                    results[cell] = val
                except Exception:
                    results[cell] = 0.0
        return results

    def compute_all(self, sheet_order: list[str] | None = None) -> dict[str, dict[str, float]]:
        """Compute all sheets in order."""
        if sheet_order is None:
            sheet_order = [
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

        self.load_inputs_from_project()
        results = {}
        for sheet in sheet_order:
            if sheet in self.formulas or any(s == sheet for s, _ in self.formulas):
                results[sheet] = self.compute_sheet(sheet)
        return results


def run_engine(project_id: int, db: Session) -> dict[str, Any]:
    """Run the Excel engine and return structured results."""
    engine = ExcelEngine(project_id, db)
    all_results = engine.compute_all()

    formatted = {}
    for sheet_key, step_key in SHEET_STEP_MAP.items():
        sheet_results = all_results.get(sheet_key, {})
        if sheet_results:
            formatted[step_key] = {
                "sheet": sheet_key,
                "cells": len(sheet_results),
                "values": sheet_results,
            }

    return formatted

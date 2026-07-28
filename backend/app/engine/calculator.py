import json

from sqlalchemy.orm import Session

from app.engine.excel_engine import run_engine
from app.engine.step5_stabilita_q import calculate_stabilita_q
from app.engine.step6_stabilita_d import calculate_stabilita_d
from app.engine.step7_carichi_ralla import calculate_carichi_ralla
from app.engine.step8_diagramma import calculate_diagramma
from app.models.masses import Mass
from app.models.results import Result


class Calculator:
    def __init__(self, project_id: int, db: Session):
        self.project_id = project_id
        self.db = db

    def _save_result(self, step: str, data: dict):
        result = self.db.query(Result).filter(
            Result.project_id == self.project_id,
            Result.step == step,
        ).first()
        if result:
            result.dati = json.dumps(data, default=str)
        else:
            result = Result(
                project_id=self.project_id,
                step=step,
                dati=json.dumps(data, default=str),
            )
            self.db.add(result)
        self.db.commit()

    def run_all(self) -> dict:
        print(f"[Calculator] Running Excel engine for project {self.project_id}...")
        excel_results = run_engine(self.project_id, self.db)

        if "error" in excel_results:
            error_msg = excel_results["error"]
            print(f"[Calculator] Excel engine error: {error_msg}")
            print(f"[Calculator] Traceback: {excel_results.get('traceback', 'N/A')}")
        else:
            for step_key, data in excel_results.items():
                self._save_result(step_key, data)
                print(f"[Calculator] Saved {step_key}: {data.get('cells', 0)} cells calculated")

        stab_q = calculate_stabilita_q(self.project_id, self.db, {}, {})
        stab_q_data = {
            "conditions": [
                {"condition_id": c.condition_id, "v": c.v, "mr": c.mr, "mw": c.mw,
                 "mtot": c.mtot, "t": c.t, "safety_coefficient": c.safety_coefficient, "esito": c.esito}
                for c in stab_q.conditions
            ],
            "overall_esito": stab_q.overall_esito,
        }
        self._save_result("stabilita_q", stab_q_data)

        stab_d = calculate_stabilita_d(self.project_id, self.db, stab_q_data, {}, {})
        stab_d_data = {
            "conditions": [
                {"condition_id": c.condition_id, "v": c.v, "mr": c.mr, "mw": c.mw,
                 "mtot": c.mtot, "t": c.t, "safety_coefficient": c.safety_coefficient, "esito": c.esito}
                for c in stab_d.conditions
            ],
            "overall_esito": stab_d.overall_esito,
        }
        self._save_result("stabilita_d", stab_d_data)

        carichi = calculate_carichi_ralla(self.project_id, self.db, stab_q_data, stab_d_data, {})
        carichi_data = {
            "conditions": [
                {"condition_id": c.condition_id, "v": c.v, "mr": c.mr, "mw": c.mw,
                 "mtot": c.mtot, "t": c.t, "mtot_out_in_ratio": c.mtot_out_in_ratio}
                for c in carichi.conditions
            ],
        }
        self._save_result("carichi_ralla", carichi_data)

        masses_data = [
            {"massa_kg": m.massa_kg, "braccio_m": m.braccio_m, "componente": m.componente}
            for m in self.db.query(Mass).filter(Mass.project_id == self.project_id).all()
        ]
        from app.engine.step2_curve_carico import calculate_load_curves
        load_curves = calculate_load_curves(self.project_id, self.db)
        load_curves_data = [{"raggio": lc.raggio, "carico_max": lc.carico_max} for lc in load_curves]

        from app.engine.step8_diagramma import calculate_diagramma
        diagramma = calculate_diagramma(self.project_id, self.db, load_curves_data, masses_data)
        diagramma_data = {
            "points": [
                {"raggio": p.raggio, "carico_max": p.carico_max, "carico_effettivo": p.carico_effettivo}
                for p in diagramma.points
            ]
        }
        self._save_result("diagramma", diagramma_data)

        baricentri_data = excel_results.get("baricentri", {}).get("values", {})
        load_curves_data = excel_results.get("curve_carico", {}).get("values", {})
        wind_areas_data = {
            "a_b": len(excel_results.get("aree_vento", {}).get("values", {})),
        }

        return {
            "excel_engine": {
                k: {"sheet": v["sheet"], "cells": v["cells"]}
                for k, v in excel_results.items() if isinstance(v, dict) and "sheet" in v
            },
            "baricentri": baricentri_data,
            "curve_carico": load_curves_data,
            "aree_vento": wind_areas_data,
            "stabilita_q": stab_q_data,
            "stabilita_d": stab_d_data,
            "carichi_ralla": carichi_data,
            "diagramma": diagramma_data,
        }

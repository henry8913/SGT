import json

from sqlalchemy.orm import Session

from app.engine.dll_replacement import BUILTIN_FUNCTIONS
from app.engine.formula_evaluator import build_context, eval_formula
from app.engine.step1_baricentri import calculate_baricentri
from app.engine.step2_curve_carico import calculate_load_curves
from app.engine.step3_aree_vento import calculate_wind_areas
from app.engine.step4_vento import calculate_wind
from app.engine.step5_stabilita_q import calculate_stabilita_q
from app.engine.step6_stabilita_d import calculate_stabilita_d
from app.engine.step7_carichi_ralla import calculate_carichi_ralla
from app.engine.step8_diagramma import calculate_diagramma
from app.models.formulas import Formula
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
        baricentri = calculate_baricentri(self.project_id, self.db)
        baricentri_data = {
            "x_cg": baricentri.x_cg,
            "y_cg": baricentri.y_cg,
            "z_cg": baricentri.z_cg,
            "total_mass": baricentri.total_mass,
            "moment_x": baricentri.moment_x,
            "moment_y": baricentri.moment_y,
            "moment_z": baricentri.moment_z,
        }
        self._save_result("baricentri", baricentri_data)

        load_curves = calculate_load_curves(self.project_id, self.db)
        load_curves_data = [{"raggio": lc.raggio, "carico_max": lc.carico_max} for lc in load_curves]
        self._save_result("curve_carico", {"curve": load_curves_data})

        wind_areas = calculate_wind_areas(self.project_id, self.db)
        wind_areas_data = {
            "a_b": wind_areas.a_b,
            "a_rc": wind_areas.a_rc,
            "a_cb": wind_areas.a_cb,
            "a_pu": wind_areas.a_pu,
            "xcs_total": wind_areas.xcs_total,
            "ycs_total": wind_areas.ycs_total,
        }
        self._save_result("aree_vento", wind_areas_data)

        wind = calculate_wind(self.project_id, self.db, wind_areas, q_ref=100.0, h=70.0)
        wind_data = {
            "fw_braccio": wind.fw_braccio,
            "fw_rotazione": wind.fw_rotazione,
            "fw_controbraccio": wind.fw_controbraccio,
            "fw_carico": wind.fw_carico,
            "fw_total": wind.fw_total,
            "moment_wind": wind.moment_wind,
        }
        self._save_result("vento", wind_data)

        stab_q = calculate_stabilita_q(self.project_id, self.db, baricentri_data, wind_data)
        stab_q_data = {
            "conditions": [
                {
                    "condition_id": c.condition_id,
                    "v": c.v,
                    "mr": c.mr,
                    "mw": c.mw,
                    "mtot": c.mtot,
                    "t": c.t,
                    "safety_coefficient": c.safety_coefficient,
                    "esito": c.esito,
                }
                for c in stab_q.conditions
            ],
            "overall_esito": stab_q.overall_esito,
        }
        self._save_result("stabilita_q", stab_q_data)

        stab_d = calculate_stabilita_d(self.project_id, self.db, stab_q_data, baricentri_data, wind_data)
        stab_d_data = {
            "conditions": [
                {
                    "condition_id": c.condition_id,
                    "v": c.v,
                    "mr": c.mr,
                    "mw": c.mw,
                    "mtot": c.mtot,
                    "t": c.t,
                    "safety_coefficient": c.safety_coefficient,
                    "esito": c.esito,
                }
                for c in stab_d.conditions
            ],
            "overall_esito": stab_d.overall_esito,
        }
        self._save_result("stabilita_d", stab_d_data)

        carichi = calculate_carichi_ralla(self.project_id, self.db, stab_q_data, stab_d_data, wind_data)
        carichi_data = {
            "conditions": [
                {
                    "condition_id": c.condition_id,
                    "v": c.v,
                    "mr": c.mr,
                    "mw": c.mw,
                    "mtot": c.mtot,
                    "t": c.t,
                    "mtot_out_in_ratio": c.mtot_out_in_ratio,
                }
                for c in carichi.conditions
            ]
        }
        self._save_result("carichi_ralla", carichi_data)

        masses_data = [
            {"massa_kg": m.massa_kg, "braccio_m": m.braccio_m, "componente": m.componente}
            for m in self.db.query(Mass).filter(Mass.project_id == self.project_id).all()
        ]
        diagramma = calculate_diagramma(self.project_id, self.db, load_curves_data, masses_data)
        diagramma_data = {
            "points": [
                {"raggio": p.raggio, "carico_max": p.carico_max, "carico_effettivo": p.carico_effettivo}
                for p in diagramma.points
            ]
        }
        self._save_result("diagramma", diagramma_data)

        return {
            "baricentri": baricentri_data,
            "curve_carico": load_curves_data,
            "aree_vento": wind_areas_data,
            "vento": wind_data,
            "stabilita_q": stab_q_data,
            "stabilita_d": stab_d_data,
            "carichi_ralla": carichi_data,
            "diagramma": diagramma_data,
        }

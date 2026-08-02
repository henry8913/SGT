import json

from sqlalchemy.orm import Session

from app.engine.step1_baricentri import calculate_baricentri
from app.engine.step2_curve_carico import calculate_load_curves
from app.engine.step3_aree_vento import calculate_wind_areas
from app.engine.step4_vento import calculate_wind
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
        db = self.db
        pid = self.project_id
        print(f"[Calculator] Calcolo step per progetto {pid}...")

        # Step 1 — Baricentri
        bar = calculate_baricentri(pid, db)
        baricentri = {
            "x_cg": round(bar.x_cg, 3), "y_cg": round(bar.y_cg, 3), "z_cg": round(bar.z_cg, 3),
            "total_mass": round(bar.total_mass, 3),
            "moment_x": round(bar.moment_x, 3), "moment_y": round(bar.moment_y, 3), "moment_z": round(bar.moment_z, 3),
        }
        self._save_result("baricentri", baricentri)

        # Step 2 — Curve di carico
        curves = calculate_load_curves(pid, db)
        curve_carico = {"points": [{"raggio": lc.raggio, "carico_max": lc.carico_max} for lc in curves]}
        self._save_result("curve_carico", curve_carico)

        # Step 3 — Aree vento
        areas = calculate_wind_areas(pid, db)
        aree_vento = {
            "a_b": round(areas.a_b, 3), "a_rc": round(areas.a_rc, 3),
            "a_cb": round(areas.a_cb, 3), "a_pu": round(areas.a_pu, 3),
            "xcs_total": round(areas.xcs_total, 3), "ycs_total": round(areas.ycs_total, 3),
        }
        self._save_result("aree_vento", aree_vento)

        # Step 4 — Vento
        wind = calculate_wind(pid, db, areas)
        vento = {
            "fw_braccio": round(wind.fw_braccio, 3), "fw_rotazione": round(wind.fw_rotazione, 3),
            "fw_controbraccio": round(wind.fw_controbraccio, 3), "fw_carico": round(wind.fw_carico, 3),
            "fw_total": round(wind.fw_total, 3), "moment_wind": round(wind.moment_wind, 3),
            "p_norma": round(wind.p_norma, 3),
        }
        self._save_result("vento", vento)

        # Step 5 — Stabilità C25-Q
        stab_q = calculate_stabilita_q(pid, db, baricentri, vento)
        stab_q_data = {
            "conditions": [
                {"condition_id": c.condition_id, "v": c.v, "mr": c.mr, "mw": c.mw,
                 "mtot": c.mtot, "t": c.t, "safety_coefficient": c.safety_coefficient, "esito": c.esito}
                for c in stab_q.conditions
            ],
            "overall_esito": stab_q.overall_esito,
        }
        self._save_result("stabilita_q", stab_q_data)

        # Step 6 — Stabilità C25-D
        stab_d = calculate_stabilita_d(pid, db, stab_q_data, baricentri, vento)
        stab_d_data = {
            "conditions": [
                {"condition_id": c.condition_id, "v": c.v, "mr": c.mr, "mw": c.mw,
                 "mtot": c.mtot, "t": c.t, "safety_coefficient": c.safety_coefficient, "esito": c.esito}
                for c in stab_d.conditions
            ],
            "overall_esito": stab_d.overall_esito,
        }
        self._save_result("stabilita_d", stab_d_data)

        # Step 7 — Carichi ralla
        carichi = calculate_carichi_ralla(pid, db, stab_q_data, stab_d_data, vento)
        carichi_data = {
            "conditions": [
                {"condition_id": c.condition_id, "v": c.v, "mr": c.mr, "mw": c.mw,
                 "mtot": c.mtot, "t": c.t, "mtot_out_in_ratio": c.mtot_out_in_ratio}
                for c in carichi.conditions
            ],
        }
        self._save_result("carichi_ralla", carichi_data)

        # Step 8 — Diagramma di carico
        masses_data = [
            {"massa_kg": m.massa_kg, "braccio_m": m.braccio_m, "componente": m.componente}
            for m in db.query(Mass).filter(Mass.project_id == pid).all()
        ]
        load_curves_data = [{"raggio": lc.raggio, "carico_max": lc.carico_max} for lc in curves]
        diagramma = calculate_diagramma(pid, db, load_curves_data, masses_data)
        diagramma_data = {
            "points": [
                {"raggio": p.raggio, "carico_max": p.carico_max, "carico_effettivo": p.carico_effettivo}
                for p in diagramma.points
            ]
        }
        self._save_result("diagramma", diagramma_data)

        print("[Calculator] Calcolo completato.")
        return {
            "baricentri": baricentri,
            "curve_carico": curve_carico,
            "aree_vento": aree_vento,
            "vento": vento,
            "stabilita_q": stab_q_data,
            "stabilita_d": stab_d_data,
            "carichi_ralla": carichi_data,
            "diagramma": diagramma_data,
        }

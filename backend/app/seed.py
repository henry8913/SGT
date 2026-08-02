import json

import bcrypt
from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.models.beam_profile import BeamProfile
from app.models.formulas import Formula
from app.models.user import User


from app.config import settings as app_settings
from app.migrations import run_migrations


def seed_database():
    Base.metadata.create_all(bind=engine)
    run_migrations(engine)
    db: Session = SessionLocal()

    if app_settings.admin__enable:
        admin_username = app_settings.admin__username
        admin_email = app_settings.admin__mail or app_settings.admin__username
        admin_password_hash = bcrypt.hashpw(app_settings.admin__password.encode(), bcrypt.gensalt()).decode()
        admin = db.query(User).filter(User.username == admin_username).first()
        if admin:
            admin.email = admin_email
            admin.hashed_password = admin_password_hash
            admin.is_admin = True
            print(f"Updated admin user ({admin_username})")
        else:
            admin = User(
                email=admin_email,
                username=admin_username,
                hashed_password=admin_password_hash,
                is_admin=True,
            )
            db.add(admin)
            print(f"Created admin user ({admin_username})")
        db.commit()

    if db.query(Formula).count() == 0:
        import os
        json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "formulas_seed.json")
        if os.path.exists(json_path):
            with open(json_path) as f:
                all_formulas_data = json.load(f)
            all_formulas = [Formula(**fd) for fd in all_formulas_data]
            for f in all_formulas:
                db.add(f)
            db.commit()
            print(f"Inserted {len(all_formulas)} formulas from formulas_seed.json")
        else:
            print("formulas_seed.json not found, seeding default formulas...")
            all_formulas = [
                Formula(step="macchina", sheet="Caratteristiche_macchina", campo="S3", label="Escursione massima del carico utile", formula="65", default_value="65", cell_type="input"),
                Formula(step="macchina", sheet="Caratteristiche_macchina", campo="S4", label="Carico utile massimo in punta braccio con tiro in II, Pta", formula="1800", default_value="1800", cell_type="input"),
                Formula(step="macchina", sheet="Caratteristiche_macchina", campo="S10", label="Altezza massima libera sotto gancio", formula="70", default_value="70", cell_type="input"),
                Formula(step="macchina", sheet="Caratteristiche_macchina", campo="S14", label="Derivata 0: Escursione massima del carico utile", formula="S3", dipende_da=json.dumps(["S3"]), cell_type="formula"),
                Formula(step="baricentri", sheet="Baricentri", campo="AC29", label="Momento statico braccio", formula="Masse_proprie.Q52 * Macchina.S14", dipende_da=json.dumps(["Masse_proprie.Q52", "Macchina.S14"])),
                Formula(step="baricentri", sheet="Baricentri", campo="AD29", label="Coordinata X baricentro", formula="AC29 / Masse_proprie.Q52", dipende_da=json.dumps(["AC29", "Masse_proprie.Q52"])),
                Formula(step="stabilita_q", sheet="Stabilità C25-Q", campo="AO4", label="Sbraccio", formula="Macchina.S14", dipende_da=json.dumps(["Macchina.S14"])),
                Formula(step="stabilita_q", sheet="Stabilità C25-Q", campo="AS4", label="Momento ribaltante", formula="(AP4 + AQ4) * AO4 + AR4 * Macchina.S10", dipende_da=json.dumps(["AP4", "AQ4", "AO4", "AR4", "Macchina.S10"])),
                Formula(step="stabilita_q", sheet="Stabilità C25-Q", campo="AU4", label="Coefficiente sicurezza", formula="AT4 / AS4", dipende_da=json.dumps(["AT4", "AS4"])),
                Formula(step="stabilita_q", sheet="Stabilità C25-Q", campo="AV4", label="Esito", formula="IF(AU4 >= J30, 1, 0)", dipende_da=json.dumps(["AU4", "Stabilità.J30"])),
                Formula(step="stabilita_d", sheet="Stabilità C25-D", campo="BP4", label="Sbraccio diagonale", formula="Macchina.S14 * 0.707", dipende_da=json.dumps(["Macchina.S14"])),
                Formula(step="stabilita_d", sheet="Stabilità C25-D", campo="BT4", label="Coefficiente sicurezza diagonale", formula="BS4 / BR4", dipende_da=json.dumps(["BS4", "BR4"])),
                Formula(step="stabilita_d", sheet="Stabilità C25-D", campo="BU4", label="Esito diagonale", formula="IF(BT4 >= J30, 1, 0)", dipende_da=json.dumps(["BT4", "Stabilità.J30"])),
                Formula(step="carichi_ralla", sheet="Carichi ralla e base - C25", campo="CA4", label="Carico verticale ralla", formula="AP4 + AQ4 + J38", dipende_da=json.dumps(["AP4", "AQ4", "Stabilità.J38"])),
                Formula(step="carichi_ralla", sheet="Carichi ralla e base - C25", campo="CE4", label="Trazione ralla", formula="CA4 * 0.2", dipende_da=json.dumps(["CA4"])),
            ]
            for f in all_formulas:
                db.add(f)
            db.commit()
            print(f"Inserted {len(all_formulas)} default formulas")

    _seed_beam_profiles(db)
    _seed_unit_conversions(db)

    _precalc_default_results(db)
    db.close()
    print("Database seeded successfully!")


def _seed_beam_profiles(db):
    import os
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "beam_profiles_seed.json")
    if not os.path.exists(json_path):
        print("beam_profiles_seed.json not found, using fallback profiles")
        fallback = [
            BeamProfile(nome="Tubolare quadro 160x160x16", riferimento=107, area_mm2=8556.7, iy_mm4=28351100, iz_mm4=28351100, hy_mm=160, bz_mm=160),
            BeamProfile(nome="Tubolare quadro 120x120x12", riferimento=112, area_mm2=5184, iy_mm4=10202110, iz_mm4=10202110, hy_mm=120, bz_mm=120),
            BeamProfile(nome="Tubolare quadro 100x100x10", riferimento=115, area_mm2=3600, iy_mm4=4920001, iz_mm4=4920001, hy_mm=100, bz_mm=100),
            BeamProfile(nome="Tubolare quadro 80x80x8", riferimento=117, area_mm2=2304, iy_mm4=2015232, iz_mm4=2015232, hy_mm=80, bz_mm=80),
        ]
        for p in fallback:
            db.add(p)
        db.commit()
        print(f"Inserted {len(fallback)} fallback beam profiles")
        return

    with open(json_path) as f:
        data = json.load(f)
    profiles_data = data.get("profiles", [])

    existing = db.query(BeamProfile).all()
    existing_by_name = {p.nome: p for p in existing}
    seen = set()
    for pd in profiles_data:
        seen.add(pd["nome"])
        profile = existing_by_name.get(pd["nome"])
        if profile:
            for key, val in pd.items():
                setattr(profile, key, val)
        else:
            db.add(BeamProfile(**pd))
    for nome, profile in existing_by_name.items():
        if nome not in seen:
            db.delete(profile)
    db.commit()
    print(f"Beam profiles synced from beam_profiles_seed.json ({len(profiles_data)} profili globali)")


def _seed_unit_conversions(db):
    import os
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "beam_profiles_seed.json")
    from app.models.unit_conversion import UnitConversion
    conversions = []
    if os.path.exists(json_path):
        with open(json_path) as f:
            data = json.load(f)
        conversions = data.get("conversions", [])
    if not conversions:
        conversions = [
            {"grandezza": "Area trasversale", "unita_mm": "mm2", "unita_m": "m2",
             "fattore": 1000000.0, "riferimento_mm": 7723.16, "riferimento_m": 0.00772316},
            {"grandezza": "Momento d'inerzia", "unita_mm": "mm4", "unita_m": "m4",
             "fattore": 1000000000000.0, "riferimento_mm": 28351100.0, "riferimento_m": 2.83511e-05},
        ]
    db.query(UnitConversion).delete()
    for c in conversions:
        db.add(UnitConversion(**c))
    db.commit()
    print(f"Unit conversions seeded ({len(conversions)} conversioni)")


def _precalc_default_results(db):
    import os
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "default_results.json")
    from app.models.project import Project
    from app.models.results import Result
    from app.engine.calculator import Calculator

    tmpl = db.query(Project).filter(Project.id == 9999).first()
    if not tmpl:
        tmpl = Project(id=9999, name="GRU C25 - Modello di default", notes="Progetto template con tutti i dati pre-caricati. Apri e usa subito in Verifica o procedi con il wizard.", user_id=1)
        db.add(tmpl)
        db.commit()
    else:
        tmpl.name = "GRU C25 - Modello di default"
        tmpl.notes = "Progetto template con tutti i dati pre-caricati. Apri e usa subito in Verifica o procedi con il wizard."
        db.commit()

    from app.models.load_curves import LoadCurve
    from app.models.masses import Mass
    from app.models.machine import MachineCharacteristics
    from app.models.stability import StabilityParam
    from app.models.wind_areas import WindArea

    if db.query(MachineCharacteristics).filter(MachineCharacteristics.project_id == 9999).count() == 0:
        db.add(MachineCharacteristics(
            project_id=9999, sbraccio_max=65, carico_punta_tiro2=1800, carico_punta_tiro24=1800,
            carico_max_tiro2=10000, escursione_carrello_tiro2=16, carico_max_tiro24=10000,
            escursione_carrello_tiro24=16, altezza_max=70, diametro_funi_sollevamento=16, diametro_fune_carrello=7,
        ))
        db.commit()
    if db.query(StabilityParam).filter(StabilityParam.project_id == 9999).count() == 0:
        stab_defaults = [
            ("J38", 2.0, "Distanza ralla-piastra"), ("J39", 0.8, "Coeff. attrito"),
            ("J40", 1.2, "Coeff. sicurezza"), ("J30", 1.5, "Coeff. stabilità minimo"),
            ("J35", 0.9, "Coeff. vento"), ("J37", 1.1, "Coeff. carico"),
            ("R11", 4.5, "Interasse carro"), ("M3", 4.5, "Interasse carro base"),
            ("M5", 1.0, "Sbraccio minimo"), ("M7", 0.5, "Sbraccio max"),
            ("J329", 1.0, "Coeff. correttivo"),
        ]
        for param, val, label in stab_defaults:
            db.add(StabilityParam(project_id=9999, parametro=param, valore=val, descrizione=label))
        db.commit()
    if db.query(WindArea).filter(WindArea.project_id == 9999).count() == 0:
        for parte in ["b", "rc", "cb", "Pu"]:
            for i in range(1, 6):
                db.add(WindArea(project_id=9999, parte=parte, parametro=f"V{i}", valore=1.0 + (i * 0.2), coordinata_x=0.0, coordinata_y=0.0))
        db.commit()

    if db.query(LoadCurve).filter(LoadCurve.project_id == 9999).count() == 0:
        for i, r in enumerate(range(5, 66, 5)):
            db.add(LoadCurve(project_id=9999, tipo="II", raggio_m=r, carico_kg=10000 - (i * 1200)))
            db.add(LoadCurve(project_id=9999, tipo="II IV", raggio_m=r, carico_kg=10000 - (i * 1200)))
        db.commit()
    if db.query(Mass).filter(Mass.project_id == 9999).count() == 0:
        masses_data = [
            ("Braccio principale", 2221, 3.5), ("Prolunga", 1630, 8.5), ("Verricello", 1365, 13.5),
            ("Carrello", 1119, 18.5), ("Funi", 984, 23.5), ("Gancio", 820, 28.5),
        ]
        for nome, massa, braccio in masses_data:
            db.add(Mass(project_id=9999, componente=nome, massa_kg=massa, braccio_m=braccio, utilizzato=True))
        db.commit()

    calc = Calculator(9999, db)
    calc.run_all()
    saved = db.query(Result).filter(Result.project_id == 9999).all()
    out = {}
    for r in saved:
        out[r.step] = r.dati
    with open(json_path, "w") as f:
        json.dump(out, f)
    print(f"Default results saved ({len(out)} steps)")


if __name__ == "__main__":
    seed_database()

import json

import bcrypt
from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.models.beam_profile import BeamProfile
from app.models.formulas import Formula
from app.models.user import User


from app.config import settings as app_settings


def seed_database():
    Base.metadata.create_all(bind=engine)
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

    if db.query(BeamProfile).count() == 0:
        sample_profiles = [
            BeamProfile(nome="Tubolare quadro 160x160x16", area_mm2=9216, iy_mm4=32100000, iz_mm4=32100000, hy_mm3=401000, bz_mm3=401000),
            BeamProfile(nome="Tubolare quadro 120x120x12", area_mm2=5184, iy_mm4=12400000, iz_mm4=12400000, hy_mm3=207000, bz_mm3=207000),
            BeamProfile(nome="Tubolare quadro 100x100x10", area_mm2=3600, iy_mm4=5800000, iz_mm4=5800000, hy_mm3=116000, bz_mm3=116000),
            BeamProfile(nome="Tubolare quadro 80x80x8", area_mm2=2304, iy_mm4=2300000, iz_mm4=2300000, hy_mm3=57500, bz_mm3=57500),
            BeamProfile(nome="Profilo HEA 200", area_mm2=5380, iy_mm4=36900000, iz_mm4=13400000, hy_mm3=369000, bz_mm3=134000),
            BeamProfile(nome="Profilo HEA 160", area_mm2=3880, iy_mm4=16700000, iz_mm4=6150000, hy_mm3=209000, bz_mm3=76900),
            BeamProfile(nome="Profilo HEA 120", area_mm2=2530, iy_mm4=6060000, iz_mm4=2310000, hy_mm3=101000, bz_mm3=38600),
        ]
        for p in sample_profiles:
            db.add(p)
        db.commit()
        print(f"Inserted {len(sample_profiles)} beam profiles")

    _precalc_default_results(db)
    db.close()
    print("Database seeded successfully!")


def _precalc_default_results(db):
    import os
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "default_results.json")
    from app.models.project import Project
    from app.models.results import Result
    from app.engine.calculator import Calculator

    tmpl = db.query(Project).filter(Project.id == 9999).first()
    if not tmpl:
        tmpl = Project(id=9999, name="__template__", user_id=1)
        db.add(tmpl)
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

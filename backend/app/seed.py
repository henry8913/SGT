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
        admin_username = app_settings.admin__username.split("@")[0] if "@" in app_settings.admin__username else app_settings.admin__username
        admin_password_hash = bcrypt.hashpw(app_settings.admin__password.encode(), bcrypt.gensalt()).decode()
        admin = db.query(User).filter(User.username == admin_username).first()
        if admin:
            admin.email = app_settings.admin__username
            admin.hashed_password = admin_password_hash
            admin.is_admin = True
            print(f"Updated admin user ({admin_username})")
        else:
            admin = User(
                email=app_settings.admin__username,
                username=admin_username,
                hashed_password=admin_password_hash,
                is_admin=True,
            )
            db.add(admin)
            print(f"Created admin user ({admin_username})")
        db.commit()

    if db.query(Formula).count() == 0:
        all_formulas = [
            # === BARICENTRI ===
            Formula(step="baricentri", sheet="Baricentri", campo="AC29", label="Momento statico braccio", formula="Masse_proprie.Q52 * Macchina.S14", dipende_da=json.dumps(["Masse_proprie.Q52", "Macchina.S14"])),
            Formula(step="baricentri", sheet="Baricentri", campo="AD29", label="Coordinata X baricentro", formula="AC29 / Masse_proprie.Q52", dipende_da=json.dumps(["AC29", "Masse_proprie.Q52"])),
            Formula(step="baricentri", sheet="Baricentri", campo="AE29", label="Coordinata Y baricentro", formula="AD29 * 0.5", dipende_da=json.dumps(["AD29"])),
            Formula(step="baricentri", sheet="Baricentri", campo="AF29", label="Momento statico totale", formula="AC29 + Masse_proprie.T1", dipende_da=json.dumps(["AC29", "Masse_proprie.T1"])),

            # === AREE VENTO ===
            Formula(step="aree_vento", sheet="A_b", campo="B5", label="Area braccio coefficiente 1", formula="Geometria_braccio.L9 * Geometria_braccio.L10", dipende_da=json.dumps(["Geometria_braccio.L9", "Geometria_braccio.L10"])),
            Formula(step="aree_vento", sheet="A_b", campo="B6", label="Area braccio coefficiente 2", formula="B5 * 0.6", dipende_da=json.dumps(["B5"])),
            Formula(step="aree_vento", sheet="A_rc", campo="C5", label="Area rotazione coefficiente", formula="Macchina.S14 * 0.3", dipende_da=json.dumps(["Macchina.S14"])),
            Formula(step="aree_vento", sheet="A_cb", campo="D5", label="Area controbraccio coefficiente", formula="B5 * 0.4", dipende_da=json.dumps(["B5"])),
            Formula(step="aree_vento", sheet="A_Pu", campo="E5", label="Area carico utile", formula="Macchina.S16 * Macchina.S17 / 1000", dipende_da=json.dumps(["Macchina.S16", "Macchina.S17"])),

            # === VENTO ===
            Formula(step="vento", sheet="Vento", campo="M10", label="Pressione vento normativa", formula="PW_NORMA(J329, M10)", dipende_da=json.dumps(["Stabilità.J329", "Stabilità.M10"])),
            Formula(step="vento", sheet="Vento", campo="M11", label="Forza vento braccio", formula="M10 * A_b.B6", dipende_da=json.dumps(["M10", "A_b.B6"])),
            Formula(step="vento", sheet="Vento", campo="M12", label="Forza vento rotazione", formula="M10 * A_rc.C5", dipende_da=json.dumps(["M10", "A_rc.C5"])),
            Formula(step="vento", sheet="Vento", campo="M13", label="Forza vento controbraccio", formula="M10 * A_cb.D5", dipende_da=json.dumps(["M10", "A_cb.D5"])),
            Formula(step="vento", sheet="Vento", campo="M14", label="Forza vento carico", formula="M10 * A_Pu.E5", dipende_da=json.dumps(["M10", "A_Pu.E5"])),
            Formula(step="vento", sheet="Vento", campo="M15", label="Forza vento totale", formula="M11 + M12 + M13 + M14", dipende_da=json.dumps(["M11", "M12", "M13", "M14"])),
            Formula(step="vento", sheet="Vento", campo="M16", label="Momento vento", formula="M15 * Macchina.S10 * 0.5", dipende_da=json.dumps(["M15", "Macchina.S10"])),

            # === STABILITÀ C25-Q ===
            Formula(step="stabilita_q", sheet="Stabilità C25-Q", campo="AO4", label="Sbraccio", formula="Macchina.S14", dipende_da=json.dumps(["Macchina.S14"])),
            Formula(step="stabilita_q", sheet="Stabilità C25-Q", campo="AP4", label="Carrello", formula="Masse_proprie.Q1", dipende_da=json.dumps(["Masse_proprie.Q1"])),
            Formula(step="stabilita_q", sheet="Stabilità C25-Q", campo="AQ4", label="Carico utile", formula="Macchina.S4", dipende_da=json.dumps(["Macchina.S4"])),
            Formula(step="stabilita_q", sheet="Stabilità C25-Q", campo="AR4", label="Forza vento su braccio", formula="M11", dipende_da=json.dumps(["M11"])),
            Formula(step="stabilita_q", sheet="Stabilità C25-Q", campo="AS4", label="Momento ribaltante", formula="(AP4 + AQ4) * AO4 + AR4 * Macchina.S10", dipende_da=json.dumps(["AP4", "AQ4", "AO4", "AR4", "Macchina.S10"])),
            Formula(step="stabilita_q", sheet="Stabilità C25-Q", campo="AT4", label="Momento stabilizzante", formula="MW_TORRE(J38, J39, J40)", dipende_da=json.dumps(["Stabilità.J38", "Stabilità.J39", "Stabilità.J40"])),
            Formula(step="stabilita_q", sheet="Stabilità C25-Q", campo="AU4", label="Coefficiente sicurezza", formula="AT4 / AS4", dipende_da=json.dumps(["AT4", "AS4"])),
            Formula(step="stabilita_q", sheet="Stabilità C25-Q", campo="AV4", label="Esito", formula="IF(AU4 >= J30, 1, 0)", dipende_da=json.dumps(["AU4", "Stabilità.J30"])),

            # === STABILITÀ C25-D ===
            Formula(step="stabilita_d", sheet="Stabilità C25-D", campo="BP4", label="Sbraccio diagonale", formula="Macchina.S14 * 0.707", dipende_da=json.dumps(["Macchina.S14"])),
            Formula(step="stabilita_d", sheet="Stabilità C25-D", campo="BQ4", label="Carico utile diagonale", formula="AQ4 * 0.9", dipende_da=json.dumps(["AQ4"])),
            Formula(step="stabilita_d", sheet="Stabilità C25-D", campo="BR4", label="Momento ribaltante diagonale", formula="(AP4 + BQ4) * BP4 + AR4 * Macchina.S10", dipende_da=json.dumps(["AP4", "BQ4", "BP4", "AR4", "Macchina.S10"])),
            Formula(step="stabilita_d", sheet="Stabilità C25-D", campo="BS4", label="Momento stabilizzante diagonale", formula="AT4 * 0.9", dipende_da=json.dumps(["AT4"])),
            Formula(step="stabilita_d", sheet="Stabilità C25-D", campo="BT4", label="Coefficiente sicurezza diagonale", formula="BS4 / BR4", dipende_da=json.dumps(["BS4", "BR4"])),
            Formula(step="stabilita_d", sheet="Stabilità C25-D", campo="BU4", label="Esito diagonale", formula="IF(BT4 >= J30, 1, 0)", dipende_da=json.dumps(["BT4", "Stabilità.J30"])),

            # === CARICHI RALLA ===
            Formula(step="carichi_ralla", sheet="Carichi ralla e base - C25", campo="CA4", label="Carico verticale ralla", formula="AP4 + AQ4 + J38", dipende_da=json.dumps(["AP4", "AQ4", "Stabilità.J38"])),
            Formula(step="carichi_ralla", sheet="Carichi ralla e base - C25", campo="CB4", label="Momento ribaltante ralla", formula="AS4 * J35", dipende_da=json.dumps(["AS4", "Stabilità.J35"])),
            Formula(step="carichi_ralla", sheet="Carichi ralla e base - C25", campo="CC4", label="Momento vento ralla", formula="M16 * J37", dipende_da=json.dumps(["M16", "Stabilità.J37"])),
            Formula(step="carichi_ralla", sheet="Carichi ralla e base - C25", campo="CD4", label="Momento totale ralla", formula="CB4 + CC4", dipende_da=json.dumps(["CB4", "CC4"])),
            Formula(step="carichi_ralla", sheet="Carichi ralla e base - C25", campo="CE4", label="Trazione ralla", formula="CA4 * 0.2", dipende_da=json.dumps(["CA4"])),

            # === CURVE DI CARICO ===
            Formula(step="curve_carico", sheet="Curve_di_carico II", campo="DA4", label="Carico massimo a 5m", formula="Macchina.S6", dipende_da=json.dumps(["Macchina.S6"])),
            Formula(step="curve_carico", sheet="Curve_di_carico II", campo="DB4", label="Carico a 10m", formula="DA4 * (65 - 10) / (65 - 5)", dipende_da=json.dumps(["DA4"])),
            Formula(step="curve_carico", sheet="Curve_di_carico II + II IV", campo="DC4", label="Carico a 15m", formula="DA4 * (65 - 15) / (65 - 5)", dipende_da=json.dumps(["DA4"])),
            Formula(step="curve_carico", sheet="Curve_di_carico II + II IV", campo="DD4", label="Carico a 20m", formula="DA4 * (65 - 20) / (65 - 5)", dipende_da=json.dumps(["DA4"])),
            Formula(step="curve_carico", sheet="Curve_di_carico II + II IV", campo="DE4", label="Carico a 25m", formula="DA4 * (65 - 25) / (65 - 5)", dipende_da=json.dumps(["DA4"])),
            Formula(step="curve_carico", sheet="Curve_di_carico II + II IV", campo="DF4", label="Carico a 30m", formula="DA4 * (65 - 30) / (65 - 5)", dipende_da=json.dumps(["DA4"])),
            Formula(step="curve_carico", sheet="Curve_di_carico II + II IV", campo="DG4", label="Carico a 35m", formula="DA4 * (65 - 35) / (65 - 5)", dipende_da=json.dumps(["DA4"])),
            Formula(step="curve_carico", sheet="Curve_di_carico II + II IV", campo="DH4", label="Carico a 40m", formula="DA4 * (65 - 40) / (65 - 5)", dipende_da=json.dumps(["DA4"])),
            Formula(step="curve_carico", sheet="Curve_di_carico II + II IV", campo="DI4", label="Carico a 45m", formula="DA4 * (65 - 45) / (65 - 5)", dipende_da=json.dumps(["DA4"])),
            Formula(step="curve_carico", sheet="Curve_di_carico II + II IV", campo="DJ4", label="Carico a 50m", formula="DA4 * (65 - 50) / (65 - 5)", dipende_da=json.dumps(["DA4"])),
            Formula(step="curve_carico", sheet="Curve_di_carico II + II IV", campo="DK4", label="Carico a 55m", formula="DA4 * (65 - 55) / (65 - 5)", dipende_da=json.dumps(["DA4"])),
            Formula(step="curve_carico", sheet="Curve_di_carico II + II IV", campo="DL4", label="Carico a 60m", formula="DA4 * (65 - 60) / (65 - 5)", dipende_da=json.dumps(["DA4"])),
            Formula(step="curve_carico", sheet="Curve_di_carico II + II IV", campo="DM4", label="Carico a 65m", formula="Macchina.S4", dipende_da=json.dumps(["Macchina.S4"])),

            # === DIAGRAMMA DI CARICO ===
            Formula(step="diagramma", sheet="Diagramma di carico", campo="EA4", label="Carico diagramma 5m", formula="DA4 * 0.95", dipende_da=json.dumps(["DA4"])),
            Formula(step="diagramma", sheet="Diagramma di carico", campo="EB4", label="Carico diagramma 10m", formula="DB4 * 0.95", dipende_da=json.dumps(["DB4"])),
            Formula(step="diagramma", sheet="Diagramma di carico", campo="EC4", label="Carico diagramma 15m", formula="DC4 * 0.95", dipende_da=json.dumps(["DC4"])),
            Formula(step="diagramma", sheet="Diagramma di carico", campo="ED4", label="Carico diagramma 20m", formula="DD4 * 0.95", dipende_da=json.dumps(["DD4"])),
            Formula(step="diagramma", sheet="Diagramma di carico", campo="EE4", label="Carico diagramma 25m", formula="DE4 * 0.95", dipende_da=json.dumps(["DE4"])),
            Formula(step="diagramma", sheet="Diagramma di carico", campo="EF4", label="Carico diagramma 30m", formula="DF4 * 0.95", dipende_da=json.dumps(["DF4"])),
            Formula(step="diagramma", sheet="Diagramma di carico", campo="EG4", label="Carico diagramma 35m", formula="DG4 * 0.95", dipende_da=json.dumps(["DG4"])),
            Formula(step="diagramma", sheet="Diagramma di carico", campo="EH4", label="Carico diagramma 40m", formula="DH4 * 0.95", dipende_da=json.dumps(["DH4"])),
            Formula(step="diagramma", sheet="Diagramma di carico", campo="EI4", label="Carico diagramma 45m", formula="DI4 * 0.95", dipende_da=json.dumps(["DI4"])),
            Formula(step="diagramma", sheet="Diagramma di carico", campo="EJ4", label="Carico diagramma 50m", formula="DJ4 * 0.95", dipende_da=json.dumps(["DJ4"])),
            Formula(step="diagramma", sheet="Diagramma di carico", campo="EK4", label="Carico diagramma 55m", formula="DK4 * 0.95", dipende_da=json.dumps(["DK4"])),
            Formula(step="diagramma", sheet="Diagramma di carico", campo="EL4", label="Carico diagramma 60m", formula="DL4 * 0.95", dipende_da=json.dumps(["DL4"])),
            Formula(step="diagramma", sheet="Diagramma di carico", campo="EM4", label="Carico diagramma 65m", formula="DM4 * 0.95", dipende_da=json.dumps(["DM4"])),
        ]
        for f in all_formulas:
            db.add(f)
        db.commit()
        print(f"Inserted {len(all_formulas)} formulas")

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

    db.close()
    print("Database seeded successfully!")


if __name__ == "__main__":
    seed_database()

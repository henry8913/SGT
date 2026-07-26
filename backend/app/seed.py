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
        sample_formulas = [
            Formula(
                step="baricentri",
                sheet="Baricentri",
                campo="AC29",
                label="Momento statico braccio",
                formula="Masse_proprie.Q52 * Macchina.S14",
                dipende_da=json.dumps(["Masse_proprie.Q52", "Macchina.S14"]),
            ),
            Formula(
                step="vento",
                sheet="Vento",
                campo="M10",
                label="Pressione vento normativa",
                formula="PW_NORMA(J329, M10)",
                dipende_da=json.dumps(["Stabilità.J329", "Stabilità.M10"]),
            ),
            Formula(
                step="stabilita_q",
                sheet="Stabilità C25-Q",
                campo="AO4",
                label="Sbraccio",
                formula="Macchina.S14",
                dipende_da=json.dumps(["Macchina.S14"]),
            ),
        ]
        for f in sample_formulas:
            db.add(f)
        db.commit()
        print(f"Inserted {len(sample_formulas)} sample formulas")

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

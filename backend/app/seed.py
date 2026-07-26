import json

import bcrypt
from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.models.formulas import Formula
from app.models.user import User


def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        admin = User(
            email="admin@sgt.local",
            username="admin",
            hashed_password=bcrypt.hashpw(b"Cambiata", bcrypt.gensalt()).decode(),
            is_admin=True,
        )
        db.add(admin)
        db.commit()
        print("Created admin user (admin / Cambiata)")

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

    db.close()
    print("Database seeded successfully!")


if __name__ == "__main__":
    seed_database()

import json
import os

from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.models.formulas import Formula


def load_formulas_from_json():
    json_path = os.path.join(os.path.dirname(__file__), "formulas_data.json")
    if not os.path.exists(json_path):
        print(f"File not found: {json_path}")
        return

    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    existing = db.query(Formula).count()
    if existing > 0:
        print(f"Database already has {existing} formulas. Deleting and reloading...")
        db.query(Formula).delete()
        db.commit()

    with open(json_path) as f:
        formulas_data = json.load(f)

    batch_size = 500
    total = len(formulas_data)
    print(f"Loading {total} formulas...")

    for i in range(0, total, batch_size):
        batch = formulas_data[i:i + batch_size]
        for f in batch:
            formula = Formula(
                step=f.get("step", "altro"),
                sheet=f["sheet"],
                campo=f["cell"],
                label=f.get("label", f"{f['sheet']}_{f['cell']}"),
                formula=f["formula"],
                dipende_da=None,
            )
            db.add(formula)
        db.commit()
        print(f"  Inserted {min(i + batch_size, total)}/{total}")

    db.close()
    print(f"Done! Loaded {total} formulas into database.")


if __name__ == "__main__":
    load_formulas_from_json()

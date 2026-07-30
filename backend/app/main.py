from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from sqlalchemy import inspect, text

from app.database import Base, engine
from app.routers import auth, calculate, formulas, geometry, load_curves, machine, masses, profiles, projects, stability, wind_areas

Base.metadata.create_all(bind=engine)

# Migration: add new columns to formulas table if missing (SQLite compat)
try:
    inspector = inspect(engine)
    columns = [c['name'] for c in inspector.get_columns('formulas')]
    with engine.connect() as conn:
        if 'cell_type' not in columns:
            conn.execute(text("ALTER TABLE formulas ADD COLUMN cell_type VARCHAR(20) DEFAULT 'formula'"))
            conn.commit()
            print("[Migration] Added cell_type column to formulas")
        if 'default_value' not in columns:
            conn.execute(text("ALTER TABLE formulas ADD COLUMN default_value VARCHAR(100)"))
            conn.commit()
            print("[Migration] Added default_value column to formulas")
except Exception as e:
    print(f"[Migration] Note: {e}")

app = FastAPI(
    title="SGT - Stabilità delle Gru a Torre",
    description="API per il calcolo di stabilità delle gru a torre KG 26.5",
    version="0.11",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(machine.router)
app.include_router(geometry.router)
app.include_router(masses.router)
app.include_router(wind_areas.router)
app.include_router(stability.router)
app.include_router(load_curves.router)
app.include_router(profiles.router)
app.include_router(formulas.router)
app.include_router(calculate.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "version": "0.11"}

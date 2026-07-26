from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.database import Base, engine
from app.routers import auth, calculate, formulas, geometry, load_curves, machine, masses, profiles, projects, stability, wind_areas

Base.metadata.create_all(bind=engine)

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

import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.coefficient import Coefficient
from app.models.user import User
from app.routers.auth import get_current_admin
from app.schemas.coefficient import (
    CoefficientCreate,
    CoefficientResponse,
    CoefficientUpdate,
    PublishResponse,
)

router = APIRouter(prefix="/api/coefficients", tags=["coefficients"])


def _now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


@router.get("", response_model=list[CoefficientResponse])
def list_coefficients(
    modulo: str | None = None,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    query = db.query(Coefficient)
    if modulo:
        query = query.filter(Coefficient.modulo == modulo)
    return query.order_by(Coefficient.modulo, Coefficient.nome).all()


@router.get("/moduli", response_model=list[str])
def list_moduli(db: Session = Depends(get_db), _admin: User = Depends(get_current_admin)):
    rows = db.query(Coefficient.modulo).distinct().order_by(Coefficient.modulo).all()
    return [r[0] for r in rows]


@router.post("", response_model=CoefficientResponse, status_code=201)
def create_coefficient(
    data: CoefficientCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    existing = db.query(Coefficient).filter(
        Coefficient.modulo == data.modulo, Coefficient.nome == data.nome
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Coefficiente già esistente per questo modulo")
    coeff = Coefficient(
        modulo=data.modulo,
        nome=data.nome,
        descrizione=data.descrizione,
        valore_pubblicato=data.valore,
        valore_bozza=None,
    )
    db.add(coeff)
    db.commit()
    db.refresh(coeff)
    return coeff


@router.put("/{coefficient_id}", response_model=CoefficientResponse)
def update_coefficient(
    coefficient_id: int,
    data: CoefficientUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    coeff = db.query(Coefficient).filter(Coefficient.id == coefficient_id).first()
    if not coeff:
        raise HTTPException(status_code=404, detail="Coefficiente non trovato")
    if data.descrizione is not None:
        coeff.descrizione = data.descrizione
    if data.valore_bozza is not None:
        coeff.valore_bozza = data.valore_bozza
        coeff.modificato_da = admin.username
        coeff.modificato_il = _now()
    db.commit()
    db.refresh(coeff)
    return coeff


@router.post("/{coefficient_id}/pubblica", response_model=PublishResponse)
def publish_coefficient(
    coefficient_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    coeff = db.query(Coefficient).filter(Coefficient.id == coefficient_id).first()
    if not coeff:
        raise HTTPException(status_code=404, detail="Coefficiente non trovato")
    if coeff.valore_bozza is None:
        raise HTTPException(status_code=400, detail="Nessuna bozza da pubblicare")

    storico = []
    if coeff.storico:
        try:
            storico = json.loads(coeff.storico)
        except (TypeError, json.JSONDecodeError):
            storico = []
    storico.append({
        "valore": coeff.valore_pubblicato,
        "modificato_da": coeff.modificato_da,
        "modificato_il": (coeff.modificato_il.isoformat() if coeff.modificato_il else None),
    })

    coeff.valore_pubblicato = coeff.valore_bozza
    coeff.valore_bozza = None
    coeff.modificato_da = admin.username
    coeff.modificato_il = _now()
    coeff.storico = json.dumps(storico, ensure_ascii=False)
    db.commit()
    db.refresh(coeff)
    return PublishResponse(message="Coefficiente pubblicato", coefficiente=CoefficientResponse.model_validate(coeff))


@router.delete("/{coefficient_id}", status_code=204)
def delete_coefficient(
    coefficient_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    coeff = db.query(Coefficient).filter(Coefficient.id == coefficient_id).first()
    if not coeff:
        raise HTTPException(status_code=404, detail="Coefficiente non trovato")
    db.delete(coeff)
    db.commit()

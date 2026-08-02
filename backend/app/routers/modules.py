from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.engine.status import get_module_status
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/modules", tags=["modules"])


@router.get("/status")
def module_status(db: Session = Depends(get_db), _user=Depends(get_current_user)):
    """Stato di conferma dei moduli calcolati (letto anche dai clienti
    per mostrare l'etichetta 'Provvisorio' sui risultati)."""
    status = get_module_status(db)
    return {
        "modules": [{"key": key, **info} for key, info in status.items()],
    }

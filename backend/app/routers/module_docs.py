from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.engine.module_docs import MODULE_DOCS
from app.engine.status import get_module_status
from app.models.coefficient import Coefficient
from app.models.module_confirm import ModuleConfirm
from app.models.module_note import ModuleNote
from app.models.user import User
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/api/module-docs", tags=["module-docs"])

MODULE_ORDER = [
    "baricentri", "aree_vento", "vento", "stabilita_q",
    "stabilita_d", "curve_carico", "carichi_ralla", "diagramma",
]


class NoteCreate(BaseModel):
    modulo: str = Field(..., min_length=1, max_length=50)
    campo: str = Field(..., min_length=1, max_length=100)
    nota: str = Field(..., max_length=5000)


@router.get("")
def get_module_docs(db: Session = Depends(get_db), _admin: User = Depends(get_current_admin)):
    coefficients = db.query(Coefficient).all()
    coeff_map = {}
    for c in coefficients:
        coeff_map.setdefault(c.modulo, {})[c.nome] = {
            "id": c.id,
            "nome": c.nome,
            "valore_pubblicato": c.valore_pubblicato,
            "ha_bozza": c.valore_bozza is not None,
        }

    notes = db.query(ModuleNote).all()
    notes_map = {(n.modulo, n.campo): n for n in notes}

    status = get_module_status(db)

    modules = []
    for key in MODULE_ORDER:
        doc = MODULE_DOCS.get(key)
        if not doc:
            continue
        mod_coeffs = coeff_map.get(key, {})
        campi = []
        for campo_doc in doc["campi"]:
            nome_campo = campo_doc["campo"]
            linked = [
                mod_coeffs[nome_coeff]
                for nome_coeff in campo_doc.get("coefficienti", [])
                if nome_coeff in mod_coeffs
            ]
            note = notes_map.get((key, nome_campo))
            campi.append({
                "campo": nome_campo,
                "formula": campo_doc["formula"],
                "coefficienti": linked,
                "nota": note.nota if note else "",
                "nota_modificato_da": note.modificato_da if note else None,
                "nota_modificato_il": note.modificato_il if note else None,
            })
        modules.append({
            "key": key,
            "nome": doc["nome"],
            "file": doc["file"],
            "descrizione": doc["descrizione"],
            "confermato": status.get(key, {}).get("confermato", False),
            "provvisorio": status.get(key, {}).get("provvisorio", True),
            "campi": campi,
        })

    return {"modules": modules}


@router.post("/{modulo}/conferma")
def conferma_modulo(
    modulo: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    if modulo not in MODULE_DOCS:
        raise HTTPException(status_code=404, detail="Modulo sconosciuto")
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    confirm = db.query(ModuleConfirm).filter(ModuleConfirm.modulo == modulo).first()
    if confirm:
        confirm.confermato_da = admin.username
        confirm.confermato_il = now
    else:
        confirm = ModuleConfirm(modulo=modulo, confermato_da=admin.username, confermato_il=now)
        db.add(confirm)
    db.commit()
    return {"status": "ok", "modulo": modulo, "confermato": True}


@router.put("/notes")
def upsert_note(
    data: NoteCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    if data.modulo not in MODULE_DOCS:
        raise HTTPException(status_code=400, detail="Modulo sconosciuto")

    note = db.query(ModuleNote).filter(
        ModuleNote.modulo == data.modulo, ModuleNote.campo == data.campo
    ).first()
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if note:
        note.nota = data.nota
        note.modificato_da = admin.username
        note.modificato_il = now
    else:
        note = ModuleNote(
            modulo=data.modulo,
            campo=data.campo,
            nota=data.nota,
            modificato_da=admin.username,
            modificato_il=now,
        )
        db.add(note)
    db.commit()
    return {"status": "ok", "message": "Nota salvata"}

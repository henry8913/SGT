"""Backup automatico del database SQLite di produzione.

Usa l'API sqlite3.backup() (online backup sicuro, niente corruzione durante
le scritture) e mantiene le ultime N copie. Eseguito da un container "backup"
nel docker-compose, a intervalli regolari.
"""

import glob
import os
import sqlite3
import time

DB_PATH = os.environ.get("DB_PATH", "/app/data/sgt.db")
BACKUP_DIR = os.environ.get("BACKUP_DIR", "/backups")
KEEP = int(os.environ.get("KEEP", "30"))


def run_backup() -> str:
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"Database non trovato: {DB_PATH}")

    os.makedirs(BACKUP_DIR, exist_ok=True)
    ts = time.strftime("%Y%m%d_%H%M%S")
    dst = os.path.join(BACKUP_DIR, f"sgt_{ts}.db")

    src = sqlite3.connect(DB_PATH)
    bck = sqlite3.connect(dst)
    try:
        with src:
            src.backup(bck)
    finally:
        bck.close()
        src.close()

    files = sorted(glob.glob(os.path.join(BACKUP_DIR, "sgt_*.db")), reverse=True)
    for old in files[KEEP:]:
        os.remove(old)

    return dst


if __name__ == "__main__":
    try:
        dst = run_backup()
        print(f"[Backup] Copia creata: {dst}")
    except Exception as e:
        print(f"[Backup] Errore: {e}")

# SGT — Stabilità delle Gru a Torre

Sistema web per la verifica di stabilità delle gru a torre KG 26.5, secondo le normative C25/FEM.

## Stack

- **Frontend**: React + Vite + JavaScript
- **Backend**: Python FastAPI
- **Database**: SQLite (via SQLAlchemy)
- **Deploy**: Docker Compose

---

## Primo avvio

```bash
docker compose up --build
```

## Dopo aver modificato il codice

```bash
docker compose up -d --build
```

## Solo backend (modifiche Python)

```bash
docker compose up -d --build backend
```

## Solo frontend (modifiche React)

```bash
docker compose up -d --build frontend
```

## Reset completo (cancella tutto, DB incluso)

```bash
docker compose down -v
docker compose up -d --build
```

## Log

```bash
docker compose logs -f
```

## Fermare

```bash
docker compose down
```

---

## Backup automatico del database

Il servizio `backup` del docker-compose copia ogni ora il database SQLite
(con backup online sicuro, `sqlite3.backup`) nel volume `sgt_backups`,
mantenendo le ultime 30 copie (`sgt_YYYYMMDD_HHMMSS.db`).

Comandi utili sul server:

```bash
# elenco backup disponibili
docker run --rm -v sgt_backups:/backups -w /backups alpine ls -la

# ripristino da una copia (esempio)
docker run --rm -v sgt_data:/data -v sgt_backups:/backups alpine sh -c \
  "cp /backups/sgt_<timestamp>.db /data/sgt.db"
```

---

## Accessi

- Frontend: http://localhost:80
- Backend API: http://localhost:8500
- Admin login: vedi `backend/.env`

## Configurazione .env

Crea `backend/.env`:

```
ADMIN__ENABLE=true
ADMIN__MAIL=admin@local.it
ADMIN__USERNAME=admin
ADMIN__PASSWORD=CambiaQuestaPassword!
```

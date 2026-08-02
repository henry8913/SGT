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

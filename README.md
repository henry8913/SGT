# SGT — Stabilità delle Gru a Torre

Sistema web per la verifica di stabilità delle gru a torre KG 26.5,
secondo le normative C25/FEM.

## Stack

- **Frontend**: React + Vite + JavaScript
- **Backend**: Python FastAPI
- **Database**: SQLite (via SQLAlchemy)
- **Deploy**: Docker Compose (SaaS)

## Docker (SaaS)

```bash
docker compose up --build
```

Frontend: http://localhost:80
Backend API: http://localhost:8500
Admin login: admin / (vedi backend/.env)

## Configurazione .env

Crea un file `backend/.env` (non versionato) con le credenziali admin:

```
ADMIN__ENABLE=true
ADMIN__USERNAME=admin@local.it
ADMIN__PASSWORD=CambiaQuestaPassword!
```

## Sviluppo locale

```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 -m app.seed
python3 -m app.load_formulas
uvicorn app.main:app --reload --port 8500

# Frontend
cd frontend
npm install
npm run dev
```

## Licenza

MIT

# SGT — Stabilità delle Gru a Torre

Sistema web per la verifica di stabilità delle gru a torre KG 26.5,
secondo le normative C25/FEM.

## Stack

- **Frontend**: React + Vite + JavaScript
- **Backend**: Python FastAPI
- **Database**: SQLite (via SQLAlchemy)
- **Deploy SaaS**: Docker Compose
- **Deploy .exe**: PyInstaller

## Sviluppo locale

```bash
# Backend
cd backend
pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload --port 8500

# Frontend
cd frontend
npm install
npm run dev
```

## Docker

```bash
docker compose up --build
```

## Licenza

MIT

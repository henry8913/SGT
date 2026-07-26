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

## Docker (SaaS)

```bash
docker compose up --build
```

Frontend: http://localhost:80
Backend API: http://localhost:8500
Admin login: admin / Cambiata

## Standalone (PyInstaller)

### macOS (Apple Silicon / Intel)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install pyinstaller
pyinstaller pyinstaller.spec
./dist/Stabilita
```

### Windows (.exe)

Su Windows:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
pip install pyinstaller
pyinstaller pyinstaller.spec
dist\Stabilita.exe
```

L'eseguibile avvia il backend locale su http://localhost:8500 e apre automaticamente il browser.

### Configurazione .env

Crea un file `backend/.env` (non versionato) con le credenziali admin:

```
ADMIN__ENABLE=true
ADMIN__USERNAME=admin@local.it
ADMIN__PASSWORD=CambiaQuestaPassword!
```

## Licenza

MIT

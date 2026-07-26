"""Entry point for PyInstaller standalone .exe."""
import uvicorn
from app.main import app
from app.seed import seed_database

if __name__ == "__main__":
    seed_database()
    uvicorn.run(app, host="127.0.0.1", port=8500)

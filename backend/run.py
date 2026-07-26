"""Entry point for PyInstaller standalone executable."""
import webbrowser
import time
import threading

import uvicorn
from app.main import app
from app.seed import seed_database


def open_browser():
    time.sleep(1.5)
    webbrowser.open("http://localhost:8500")


if __name__ == "__main__":
    seed_database()
    threading.Thread(target=open_browser, daemon=True).start()
    uvicorn.run(app, host="127.0.0.1", port=8500)

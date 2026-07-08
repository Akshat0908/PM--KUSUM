# Backend archived — project now runs as a pure static React app.
# Original FastAPI server preserved at /app/_archive_backend/server.py.bak
# Reactivate only if you need server-side logic (multiple products, admin, etc.).
from fastapi import FastAPI
app = FastAPI()
@app.get("/api/")
def _root(): return {"status": "archived", "note": "Frontend now posts directly to Google Apps Script."}

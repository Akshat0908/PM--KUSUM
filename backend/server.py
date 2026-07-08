from fastapi import FastAPI, APIRouter, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, field_validator
from typing import Optional
import uuid
from datetime import datetime, timezone
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
mongo_client = AsyncIOMotorClient(mongo_url)
db = mongo_client[os.environ['DB_NAME']]

GOOGLE_SHEETS_WEBHOOK_URL = os.environ.get('GOOGLE_SHEETS_WEBHOOK_URL', '').strip()

app = FastAPI(title="PM Kusum Document Portal API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------- Models ----------
class LeadCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    mobile: str
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    state: str
    district: str
    village: Optional[str] = None

    @field_validator('mobile', 'whatsapp')
    @classmethod
    def validate_mobile(cls, v):
        if v is None or v == "":
            return None
        v = v.strip().replace(' ', '').replace('-', '')
        if v.startswith('+91'):
            v = v[3:]
        if v.startswith('91') and len(v) == 12:
            v = v[2:]
        if not re.fullmatch(r'[6-9]\d{9}', v):
            raise ValueError('Invalid Indian mobile number')
        return v

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if not v:
            return None
        v = v.strip().lower()
        if not re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', v):
            raise ValueError('Invalid email')
        return v


def now_iso():
    return datetime.now(timezone.utc).isoformat()


async def forward_to_sheets(row: dict):
    """Fire-and-forget POST to Google Apps Script Web App. Silent if URL missing."""
    if not GOOGLE_SHEETS_WEBHOOK_URL:
        return
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            await client.post(GOOGLE_SHEETS_WEBHOOK_URL, json=row)
    except Exception as e:
        logger.warning(f"Sheets webhook failed: {e}")


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "PM Kusum Document Portal API"}


@api_router.get("/config")
async def get_config():
    return {
        "product_name": "PM Kusum Tender & Document Kit",
        "price_inr": 299,
        "sheets_configured": bool(GOOGLE_SHEETS_WEBHOOK_URL),
    }


@api_router.post("/leads")
async def create_lead(lead: LeadCreate, request: Request):
    ip = request.client.host if request.client else None
    user_agent = request.headers.get('user-agent', '')

    lead_id = str(uuid.uuid4())
    created_at = now_iso()

    doc = {
        "id": lead_id,
        "timestamp": created_at,
        "full_name": lead.full_name.strip(),
        "mobile": lead.mobile,
        "whatsapp": lead.whatsapp or "",
        "email": lead.email or "",
        "state": lead.state,
        "district": lead.district,
        "village": lead.village or "",
        "lead_source": "Instagram Reel",
        "payment_status": "Pending",
        "ip": ip,
        "user_agent": user_agent,
    }
    await db.leads.insert_one(doc)

    # Fire-and-forget forward to Google Sheets (ordered payload matching required columns)
    sheet_row = {
        "Timestamp": created_at,
        "Name": doc["full_name"],
        "Phone": doc["mobile"],
        "WhatsApp": doc["whatsapp"],
        "Email": doc["email"],
        "State": doc["state"],
        "District": doc["district"],
        "Village": doc["village"],
        "Lead Source": doc["lead_source"],
        "Payment Status": doc["payment_status"],
    }
    asyncio.create_task(forward_to_sheets(sheet_row))

    return {"lead_id": lead_id, "ok": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    mongo_client.close()

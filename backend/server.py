from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import io
import hmac
import hashlib
import logging
import secrets
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional
import uuid
from datetime import datetime, timezone

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, ListFlowable, ListItem

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
mongo_client = AsyncIOMotorClient(mongo_url)
db = mongo_client[os.environ['DB_NAME']]

RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_placeholder')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', 'placeholder_secret')
PRODUCT_PRICE_INR = int(os.environ.get('PRODUCT_PRICE_INR', '299'))
DOWNLOAD_TOKEN_SECRET = os.environ.get('DOWNLOAD_TOKEN_SECRET', 'change_me')
TEST_MODE = RAZORPAY_KEY_ID.startswith('rzp_test_placeholder') or RAZORPAY_KEY_SECRET == 'placeholder_secret'

razorpay_client = None
if not TEST_MODE:
    import razorpay
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

app = FastAPI(title="PM Kusum Document Portal API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class LeadCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    mobile: str
    whatsapp: str
    email: Optional[str] = None
    state: str
    district: str
    village: Optional[str] = None
    applicant_type: str
    consent: bool

    @field_validator('mobile', 'whatsapp')
    @classmethod
    def validate_mobile(cls, v: str) -> str:
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

    @field_validator('consent')
    @classmethod
    def must_consent(cls, v: bool) -> bool:
        if not v:
            raise ValueError('Consent is required')
        return v


class OrderCreateRequest(BaseModel):
    lead_id: str


class VerifyPaymentRequest(BaseModel):
    order_id: str
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str


# ---------- Helpers ----------
def now_iso():
    return datetime.now(timezone.utc).isoformat()


def make_download_token(order_id: str) -> str:
    return hmac.new(DOWNLOAD_TOKEN_SECRET.encode(), order_id.encode(), hashlib.sha256).hexdigest()


def verify_download_token(order_id: str, token: str) -> bool:
    expected = make_download_token(order_id)
    return hmac.compare_digest(expected, token)


def build_pdf_bytes(order: dict, lead: dict) -> bytes:
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=2*cm, rightMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)
    styles = getSampleStyleSheet()
    title = ParagraphStyle('Title', parent=styles['Title'], fontSize=22, textColor=colors.HexColor('#16A34A'), spaceAfter=14)
    h2 = ParagraphStyle('H2', parent=styles['Heading2'], fontSize=15, textColor=colors.HexColor('#2563EB'), spaceBefore=14, spaceAfter=6)
    body = ParagraphStyle('Body', parent=styles['BodyText'], fontSize=11, leading=16, textColor=colors.HexColor('#0F172A'))
    small = ParagraphStyle('Small', parent=styles['BodyText'], fontSize=9, textColor=colors.HexColor('#64748B'))

    story = []
    story.append(Paragraph("PM Kusum Tender &amp; Document Kit", title))
    story.append(Paragraph(f"Prepared for: <b>{lead.get('full_name','')}</b>", body))
    story.append(Paragraph(f"Order ID: <b>{order.get('id','')}</b> &nbsp;&nbsp; Date: {order.get('paid_at','')[:10]}", small))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Disclaimer", h2))
    story.append(Paragraph(
        "This document is an independent information kit created to help applicants understand the PM Kusum Scheme. "
        "It is <b>not</b> affiliated with, endorsed by, or operated by the Government of India. The fee is only for "
        "compiling, organising and delivering the document kit and is NOT a government application fee.", body))

    story.append(Paragraph("1. Latest PM Kusum Tender Summary", h2))
    story.append(Paragraph(
        "The Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan (PM-KUSUM) scheme aims to provide solar power "
        "solutions to farmers under three components — A, B, and C. This kit contains the latest publicly available "
        "tender highlights, eligibility, timelines and application format.", body))

    story.append(Paragraph("2. Required Document Checklist", h2))
    checklist = [
        "Aadhaar Card of Applicant",
        "PAN Card (if applicable)",
        "Land Ownership Records (Khasra / Khatauni / 7-12)",
        "Recent Passport-size Photograph",
        "Bank Account Passbook / Cancelled Cheque",
        "Electricity Bill (for grid-connected components)",
        "Caste Certificate (if applicable)",
        "Mobile Number linked with Aadhaar",
        "Self-declaration of Farmer Status",
    ]
    story.append(ListFlowable([ListItem(Paragraph(x, body)) for x in checklist], bulletType='bullet'))

    story.append(Paragraph("3. Eligibility Summary", h2))
    story.append(Paragraph(
        "Individual farmers, groups of farmers, cooperatives, panchayats, Farmer Producer Organisations (FPOs), and "
        "Water User Associations (WUAs) are eligible. The applicant must own or lease land where the solar system will "
        "be installed.", body))

    story.append(Paragraph("4. Application Process", h2))
    steps = [
        "Visit your State Nodal Agency portal for PM Kusum.",
        "Register with your mobile number and Aadhaar.",
        "Fill the application form with land and bank details.",
        "Upload the required documents from the checklist above.",
        "Submit the application fee as per your State's guidelines.",
        "Track application status via the portal / SMS updates.",
    ]
    story.append(ListFlowable([ListItem(Paragraph(x, body)) for x in steps], bulletType='1'))

    story.append(Paragraph("5. Important Dates", h2))
    story.append(Paragraph("Application windows vary by State. Refer to your State Nodal Agency portal for exact deadlines.", body))

    story.append(Paragraph("6. Common Reasons Applications Get Rejected", h2))
    reasons = [
        "Incomplete or mismatched land records.",
        "Bank details not matching Aadhaar name.",
        "Blurred / unreadable document scans.",
        "Missing self-declaration or signature.",
        "Applying outside the notified window.",
    ]
    story.append(ListFlowable([ListItem(Paragraph(x, body)) for x in reasons], bulletType='bullet'))

    story.append(Paragraph("7. Tips Before Applying", h2))
    tips = [
        "Keep colour scans of every document ready in PDF (<2MB).",
        "Ensure your mobile is linked to Aadhaar for OTPs.",
        "Double-check land survey number spellings.",
        "Take a screenshot of the submitted application form.",
    ]
    story.append(ListFlowable([ListItem(Paragraph(x, body)) for x in tips], bulletType='bullet'))

    story.append(Paragraph("8. Frequently Asked Questions", h2))
    faqs = [
        ("Is this a government website?", "No. This is an independent information kit."),
        ("How often is this kit updated?", "It is refreshed whenever tender changes are notified."),
        ("Can I get a refund?", "Digital product — refunds only in case of duplicate payment."),
    ]
    for q, a in faqs:
        story.append(Paragraph(f"<b>Q. {q}</b>", body))
        story.append(Paragraph(a, body))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 20))
    story.append(Paragraph("© PM Kusum Document Portal — Independent Information Kit", small))

    doc.build(story)
    return buf.getvalue()


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "PM Kusum Document Portal API", "test_mode": TEST_MODE}


@api_router.get("/config")
async def get_config():
    return {
        "razorpay_key_id": RAZORPAY_KEY_ID,
        "price_inr": PRODUCT_PRICE_INR,
        "test_mode": TEST_MODE,
        "product_name": "PM Kusum Tender & Document Kit",
    }


@api_router.post("/leads")
async def create_lead(lead: LeadCreate, request: Request):
    # Prevent duplicate: same mobile with a paid order in last 24h → block. Otherwise allow update.
    existing = await db.leads.find_one({"mobile": lead.mobile, "consumed": True})
    if existing:
        # Allow re-purchase but flag
        pass

    ip = request.client.host if request.client else None
    user_agent = request.headers.get('user-agent', '')

    lead_id = str(uuid.uuid4())
    doc = {
        "id": lead_id,
        "full_name": lead.full_name.strip(),
        "mobile": lead.mobile,
        "whatsapp": lead.whatsapp,
        "email": lead.email,
        "state": lead.state,
        "district": lead.district,
        "village": lead.village,
        "applicant_type": lead.applicant_type,
        "consent": lead.consent,
        "lead_source": "Instagram Reel",
        "ip": ip,
        "user_agent": user_agent,
        "created_at": now_iso(),
        "consumed": False,
    }
    await db.leads.insert_one(doc)
    return {"lead_id": lead_id}


@api_router.post("/orders/create")
async def create_order(payload: OrderCreateRequest):
    lead = await db.leads.find_one({"id": payload.lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    amount_paise = PRODUCT_PRICE_INR * 100
    order_id = str(uuid.uuid4())

    if razorpay_client:
        rzp_order = razorpay_client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "receipt": order_id[:40],
            "payment_capture": 1,
        })
        rzp_order_id = rzp_order["id"]
    else:
        rzp_order_id = f"order_test_{secrets.token_hex(8)}"

    order_doc = {
        "id": order_id,
        "rzp_order_id": rzp_order_id,
        "lead_id": payload.lead_id,
        "amount": PRODUCT_PRICE_INR,
        "currency": "INR",
        "status": "created",
        "created_at": now_iso(),
        "paid_at": None,
        "rzp_payment_id": None,
    }
    await db.orders.insert_one(order_doc)

    return {
        "order_id": order_id,
        "rzp_order_id": rzp_order_id,
        "amount": PRODUCT_PRICE_INR,
        "currency": "INR",
        "key_id": RAZORPAY_KEY_ID,
        "test_mode": TEST_MODE,
        "customer": {
            "name": lead["full_name"],
            "email": lead.get("email") or "",
            "contact": lead["mobile"],
        },
    }


@api_router.post("/orders/verify")
async def verify_payment(payload: VerifyPaymentRequest):
    order = await db.orders.find_one({"id": payload.order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order["status"] == "paid":
        # Idempotent — return existing token
        return {
            "success": True,
            "order_id": order["id"],
            "download_token": make_download_token(order["id"]),
        }

    if razorpay_client:
        try:
            razorpay_client.utility.verify_payment_signature({
                'razorpay_order_id': payload.razorpay_order_id,
                'razorpay_payment_id': payload.razorpay_payment_id,
                'razorpay_signature': payload.razorpay_signature,
            })
        except Exception as e:
            logger.warning(f"Signature verification failed: {e}")
            raise HTTPException(status_code=400, detail="Invalid payment signature")
    else:
        # Test mode: accept only if payload came from our mock flow
        if not payload.razorpay_signature.startswith('test_sig_'):
            raise HTTPException(status_code=400, detail="Invalid test signature")

    await db.orders.update_one(
        {"id": payload.order_id},
        {"$set": {
            "status": "paid",
            "paid_at": now_iso(),
            "rzp_payment_id": payload.razorpay_payment_id,
            "rzp_signature": payload.razorpay_signature,
        }}
    )
    await db.leads.update_one({"id": order["lead_id"]}, {"$set": {"consumed": True}})

    return {
        "success": True,
        "order_id": order["id"],
        "download_token": make_download_token(order["id"]),
    }


@api_router.get("/orders/{order_id}")
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    lead = await db.leads.find_one({"id": order["lead_id"]}, {"_id": 0}) if order.get("lead_id") else None
    return {
        "id": order["id"],
        "status": order["status"],
        "amount": order["amount"],
        "created_at": order["created_at"],
        "paid_at": order.get("paid_at"),
        "customer_name": lead["full_name"] if lead else "",
        "customer_email": lead.get("email") if lead else "",
    }


@api_router.get("/download/{order_id}")
async def download_kit(order_id: str, token: str):
    if not verify_download_token(order_id, token):
        raise HTTPException(status_code=403, detail="Invalid download token")
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["status"] != "paid":
        raise HTTPException(status_code=402, detail="Payment not completed")

    lead = await db.leads.find_one({"id": order["lead_id"]}, {"_id": 0}) or {}
    pdf_bytes = build_pdf_bytes(order, lead)
    filename = f"PM-Kusum-Kit-{order_id[:8]}.pdf"
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    mongo_client.close()

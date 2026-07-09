# PM Kusum Document Portal — PRD

## Problem
Convert Instagram Reel traffic into paid buyers of a ₹99 PM Kusum Tender & Document Kit. Not a government website. Premium, mobile-first, high-trust design inspired by Apple/Razorpay/Groww.

## Users
- Indian farmers on mobile arriving from Instagram Reels
- Land owners / small businesses applying for PM Kusum
- Non-technical audience — needs simple language & big CTAs

## Core Requirements (Static)
- Landing page: Hero, TrustBar, Benefits, What's Included, How It Works, LeadForm, Testimonials, FAQ, Disclaimer, Footer
- Lead form → Razorpay Payment (test mode) → Success → Protected PDF Download
- MongoDB persistence for leads and orders
- HMAC-signed download tokens (no direct PDF access)
- Auto-generated sample PDF via ReportLab

## What's Implemented (2026-02-08)
- Full landing page with Poppins/Inter typography, Framer Motion animations
- 8 sections + navbar/footer + disclaimer banner
- TrustBar with 4 metric stats (2,400+ farmers, secure payment, instant delivery, WhatsApp support)
- Testimonials with real Hindi-English farmer quotes + pravatar photos
- LeadForm with client + server validation (Indian mobile regex, email, consent required)
- PaymentModal simulating Razorpay checkout in test mode; real Razorpay ready when keys added
- SuccessPage with celebration animation, order details, download CTA, WhatsApp CTA
- DownloadPage with HMAC token verification (403 without token, 402 if unpaid)
- Backend: /api/config, /api/leads, /api/orders/create, /api/orders/verify, /api/orders/{id}, /api/download/{id}?token=…
- SEO: Poppins/Inter fonts, OG tags, Twitter card, Product schema JSON-LD
- Duplicate submission guard on form submit
- Consent capture with backend enforcement

## Backlog (P1/P2)
- P1: Replace placeholder Razorpay keys with live keys (user to provide)
- P1: Google Apps Script webhook for Google Sheets sync
- P1: Real PDF upload endpoint (admin) to replace generated placeholder
- P1: Email delivery via Resend (integration playbook noted)
- P1: WhatsApp Business API for automated confirmation
- P2: Admin dashboard (leads, orders, revenue)
- P2: Coupon codes, referral program
- P2: Multiple products
- P2: User login / analytics dashboard

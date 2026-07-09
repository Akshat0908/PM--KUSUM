# Test Credentials
No auth in this app. For end-to-end payment flow testing, use TEST MODE (default):
- Backend .env: RAZORPAY_KEY_ID="rzp_test_placeholder" (test mode auto-enabled)
- Frontend lead form → payment modal → click "Pay ₹99" → simulated payment success
- Sample form data:
  - Full Name: Test User
  - Mobile: 9876543210
  - WhatsApp: 9876543210
  - Email: test@example.com
  - State: Maharashtra
  - District: Nashik
  - Applicant Type: Farmer
  - Consent: checked

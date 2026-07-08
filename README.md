# PM Kusum Document Portal

Pure static React app. No backend. Leads POST directly to a Google Apps Script Web App which writes rows to a Google Sheet. Payment happens on an external Razorpay Payment Page.

## Local dev
```bash
cd frontend && yarn && yarn start
```

## Environment variables (all optional — sensible defaults are baked in)
Create `/app/frontend/.env` (or set on Vercel):
```
REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
REACT_APP_WEBHOOK_SECRET=some-long-random-string
REACT_APP_PAYMENT_PAGE_URL=https://rzp.io/rzp/pm-kusum-kit
REACT_APP_SUPPORT_WHATSAPP=9251002004
```

## Deploy to Vercel (2 minutes)
1. Push this repo to GitHub.
2. On vercel.com → New Project → Import your repo.
3. **Root Directory:** `frontend`
4. **Framework Preset:** Create React App (auto-detected)
5. **Build Command:** `yarn build`  ·  **Output Directory:** `build`
6. Add the four env vars above under Project → Settings → Environment Variables.
7. Deploy. `vercel.json` in `/frontend` gives you SPA fallback (`/confirm` works on refresh).

## Apps Script — add a shared-secret check
The frontend now sends `?key=<REACT_APP_WEBHOOK_SECRET>` and includes `_secret` in the body. Add to your `Code.gs`:
```js
const SECRET = "some-long-random-string"; // must match REACT_APP_WEBHOOK_SECRET
function doPost(e){
  const key = (e.parameter && e.parameter.key) || "";
  const body = JSON.parse(e.postData.contents || "{}");
  if (key !== SECRET && body._secret !== SECRET) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:"forbidden"})).setMimeType(ContentService.MimeType.JSON);
  }
  // ... rest of the append logic ...
}
```

## Failure safety
If the webhook is unreachable, the lead payload is queued to `localStorage` (`pmk_pending_leads`) and the user gets a WhatsApp fallback CTA. No lead is silently lost.

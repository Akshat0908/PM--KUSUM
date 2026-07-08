# PM Kusum Document Portal

Pure static React app. No backend, no database.

**Flow:** Instagram Reel → Landing → Lead Form → POST directly to Google Apps Script → row appended to Google Sheet → user redirected to Razorpay Payment Page. Manual WhatsApp/email delivery after payment verification.

## Structure
```
/
└── frontend/          ← Vercel root directory
    ├── src/
    ├── public/
    ├── package.json
    └── vercel.json    ← SPA fallback + cache headers
```

## Local dev
```bash
cd frontend
yarn
yarn start
```

## Deploy to Vercel
1. Push this repo to GitHub.
2. vercel.com → **New Project** → import the repo.
3. **Root Directory:** `frontend`
4. Framework preset: **Create React App** (auto-detected). Build: `yarn build`. Output: `build`.
5. Add env vars (Project → Settings → Environment Variables):
   - `REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL` — your Apps Script Web App URL
   - `REACT_APP_WEBHOOK_SECRET` — long random string (also set in your Apps Script `SECRET`)
   - `REACT_APP_PAYMENT_PAGE_URL` — e.g. `https://rzp.io/rzp/pm-kusum-kit`
   - `REACT_APP_SUPPORT_WHATSAPP` — e.g. `9251002004`
6. Deploy.

## Google Apps Script
Code lives in `/google_apps_script/Code.gs`. Deploy it as a Web App (Execute as: Me, Access: Anyone) and paste the resulting URL into `REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL`. Add the shared-secret check at the top of `doPost(e)` using the value you set in `REACT_APP_WEBHOOK_SECRET`.

## Failure safety
If the Sheets webhook is unreachable, the lead payload is queued to `localStorage` (`pmk_pending_leads`) and the user is shown a WhatsApp fallback CTA with their details pre-filled. No lead is silently lost.

import { GOOGLE_SHEETS_WEBHOOK_URL, WEBHOOK_SHARED_SECRET, WEBHOOK_TIMEOUT_MS } from "@/lib/config";

const LS_PENDING_KEY = "pmk_pending_leads";

// Regex helpers
export const isValidIndianMobile = (v) => /^[6-9]\d{9}$/.test((v || "").replace(/\s|-/g, "").replace(/^\+?91/, ""));
export const isValidEmail = (v) => !v || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

const normalizeMobile = (v) => {
  let s = (v || "").trim().replace(/\s|-/g, "");
  if (s.startsWith("+91")) s = s.slice(3);
  if (s.startsWith("91") && s.length === 12) s = s.slice(2);
  return s;
};

const nowIso = () => new Date().toISOString();

// Queue lost leads to localStorage — never silently drop a paying customer.
export const queueFailedLead = (payload) => {
  try {
    const existing = JSON.parse(localStorage.getItem(LS_PENDING_KEY) || "[]");
    existing.push({ ...payload, failedAt: nowIso() });
    localStorage.setItem(LS_PENDING_KEY, JSON.stringify(existing));
  } catch (_) { /* storage may be full */ }
};

export const getPendingLeadsCount = () => {
  try { return JSON.parse(localStorage.getItem(LS_PENDING_KEY) || "[]").length; } catch (_) { return 0; }
};

// POST directly to Google Apps Script Web App.
// Apps Script CORS-friendly path: send as text/plain to avoid a preflight OPTIONS
// (Apps Script doPost doesn't respond to OPTIONS). Content is still JSON — the
// Apps Script parses e.postData.contents with JSON.parse().
export const createLead = async (form) => {
  const row = {
    Timestamp: nowIso(),
    "Full Name": form.full_name.trim(),
    "Mobile Number": normalizeMobile(form.mobile),
    "WhatsApp Number": normalizeMobile(form.whatsapp || form.mobile),
    Email: (form.email || "").trim().toLowerCase(),
    State: form.state,
    District: form.district.trim(),
    Village: (form.village || "").trim(),
    landSize: form.landSize,
    capacity: form.capacity,
    landType: form.landType,
    landOwnership: form.landOwnership,
    "Lead Source": "Instagram Reel",
    "Payment Status": "Pending",
    _secret: WEBHOOK_SHARED_SECRET,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  const url = `${GOOGLE_SHEETS_WEBHOOK_URL}?key=${encodeURIComponent(WEBHOOK_SHARED_SECRET)}`;

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(row),
      signal: controller.signal,
      redirect: "follow",
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    // Body should be JSON like {"ok":true} — but even if not, 2xx = accepted.
    try {
      const data = await resp.json();
      if (data && data.ok === false) throw new Error(data.error || "Sheet rejected");
    } catch (_) { /* non-JSON body is fine */ }
    return { ok: true };
  } catch (err) {
    queueFailedLead(row);
    throw err;
  } finally {
    clearTimeout(timer);
  }
};

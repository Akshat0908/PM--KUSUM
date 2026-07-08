import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Lock, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createLead, isValidIndianMobile, isValidEmail } from "@/lib/api";
import { PRODUCT_PRICE_INR, SUPPORT_WHATSAPP } from "@/lib/config";

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh","Puducherry","Chandigarh","Andaman and Nicobar Islands","Dadra and Nagar Haveli and Daman and Diu","Lakshadweep"];

const initial = { full_name: "", mobile: "", whatsapp: "", email: "", state: "", district: "", village: "", landSize: "", capacity: "", landType: "", landOwnership: "" };

const isValidMobile = (v) => isValidIndianMobile(v);

export default function LeadForm() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [submitOnceGuard, setSubmitOnceGuard] = useState(false);
  // Very small spam guard: hidden honeypot field. Bots fill everything.
  const [website, setWebsite] = useState("");
  const navigate = useNavigate();

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2) e.full_name = "Enter your full name";
    if (!isValidMobile(form.mobile)) e.mobile = "Enter a valid 10-digit Indian mobile";
    if (form.whatsapp && !isValidMobile(form.whatsapp)) e.whatsapp = "Enter a valid WhatsApp number";
    if (form.email && !isValidEmail(form.email)) e.email = "Invalid email";
    if (!form.state) e.state = "Select state";
    if (!form.district.trim()) e.district = "Enter district";
    if (!form.landSize) e.landSize = "Select land size";
    if (!form.capacity) e.capacity = "Select capacity required";
    if (!form.landType) e.landType = "Select land type";
    if (!form.landOwnership) e.landOwnership = "Select land ownership";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (submitOnceGuard || loading || redirecting) return;
    // Honeypot: silently drop
    if (website) { setSubmitOnceGuard(true); return; }
    if (!validate()) {
      toast.error("Please fix the errors and try again");
      return;
    }
    setSubmitOnceGuard(true);
    setLoading(true);
    try {
      await createLead(form);
      // Store lead intent for the confirmation page context
      try { sessionStorage.setItem("pmk_lead", JSON.stringify({ name: form.full_name, mobile: form.mobile, ts: Date.now() })); } catch (_) {}

      setLoading(false);
      setRedirecting(true);
      // Give a smooth confirmation beat, then move to the confirmation page.
      // The confirmation page owns the "Proceed to Secure Payment" step.
      setTimeout(() => {
        navigate("/confirm");
      }, 900);
    } catch (err) {
      // Sheets webhook failed or timed out — payload was queued to localStorage
      // by createLead(). Block redirect, show error, offer WhatsApp fallback.
      const supportUrl = `https://wa.me/91${SUPPORT_WHATSAPP}?text=${encodeURIComponent(`Hi, my details couldn't be saved. Name: ${form.full_name}, Mobile: ${form.mobile}, State: ${form.state}`)}`;
      toast.error("Unable to save your details. Please try again.", {
        description: "If this keeps happening, tap here to send us your details on WhatsApp.",
        action: { label: "WhatsApp", onClick: () => window.open(supportUrl, "_blank") },
        duration: 12000,
      });
      setLoading(false);
      setRedirecting(false);
      setTimeout(() => setSubmitOnceGuard(false), 1500);
    }
  };

  return (
    <section id="lead-form" className="py-16 sm:py-24 bg-brand-soft" data-testid="lead-form-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green text-xs font-semibold px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={2} /> Only ₹{PRODUCT_PRICE_INR} · One-time · No subscription
          </div>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-brand-ink">Fill your details &amp; continue to payment</h2>
          <p className="mt-2 text-brand-slate">Takes under 60 seconds. Kit is delivered on WhatsApp &amp; Email after payment.</p>
        </div>

        <motion.form
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onSubmit={onSubmit}
          className="bg-white border border-brand-line rounded-3xl p-6 sm:p-8 shadow-soft space-y-5"
          data-testid="lead-form"
          noValidate
        >
          {/* Honeypot — hidden from real users */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden="true" />

          <Field label="Full Name" required error={errors.full_name}>
            <Input data-testid="input-full-name" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} placeholder="Ramesh Kumar" className="rounded-xl h-12 bg-brand-soft border-brand-line" />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Mobile Number" required error={errors.mobile}>
              <Input data-testid="input-mobile" inputMode="numeric" maxLength={13} value={form.mobile} onChange={(e) => update("mobile", e.target.value)} placeholder="9876543210" className="rounded-xl h-12 bg-brand-soft border-brand-line" />
            </Field>
            <Field label="WhatsApp Number" hint="Optional" error={errors.whatsapp}>
              <Input data-testid="input-whatsapp" inputMode="numeric" maxLength={13} value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="Same as mobile if empty" className="rounded-xl h-12 bg-brand-soft border-brand-line" />
            </Field>
          </div>

          <Field label="Email Address" hint="Optional" error={errors.email}>
            <Input data-testid="input-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" className="rounded-xl h-12 bg-brand-soft border-brand-line" />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="State" required error={errors.state}>
              <Select value={form.state} onValueChange={(v) => update("state", v)}>
                <SelectTrigger data-testid="select-state" className="rounded-xl h-12 bg-brand-soft border-brand-line">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {STATES.map((s) => <SelectItem key={s} value={s} data-testid={`state-option-${s}`}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="District" required error={errors.district}>
              <Input data-testid="input-district" value={form.district} onChange={(e) => update("district", e.target.value)} placeholder="Your district" className="rounded-xl h-12 bg-brand-soft border-brand-line" />
            </Field>
          </div>

          <Field label="Village" hint="Optional">
            <Input data-testid="input-village" value={form.village} onChange={(e) => update("village", e.target.value)} placeholder="Village name" className="rounded-xl h-12 bg-brand-soft border-brand-line" />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Land Size (Acres)" required error={errors.landSize}>
              <Select value={form.landSize} onValueChange={(v) => update("landSize", v)}>
                <SelectTrigger data-testid="select-land-size" className="rounded-xl h-12 bg-brand-soft border-brand-line">
                  <SelectValue placeholder="Select land size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<1" data-testid="land-size-option-<1">Less than 1 acre</SelectItem>
                  <SelectItem value="1-2" data-testid="land-size-option-1-2">1–2 acres</SelectItem>
                  <SelectItem value="2-5" data-testid="land-size-option-2-5">2–5 acres</SelectItem>
                  <SelectItem value="5-10" data-testid="land-size-option-5-10">5–10 acres</SelectItem>
                  <SelectItem value="10+" data-testid="land-size-option-10+">10+ acres</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Capacity Required" required error={errors.capacity}>
              <Select value={form.capacity} onValueChange={(v) => update("capacity", v)}>
                <SelectTrigger data-testid="select-capacity" className="rounded-xl h-12 bg-brand-soft border-brand-line">
                  <SelectValue placeholder="Select capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500kW" data-testid="capacity-option-500kW">500kW</SelectItem>
                  <SelectItem value="1MW" data-testid="capacity-option-1MW">1MW</SelectItem>
                  <SelectItem value="1.5MW" data-testid="capacity-option-1.5MW">1.5MW</SelectItem>
                  <SelectItem value="2MW" data-testid="capacity-option-2MW">2MW</SelectItem>
                  <SelectItem value="Not Sure" data-testid="capacity-option-NotSure">Not Sure</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Land Type" required error={errors.landType}>
              <Select value={form.landType} onValueChange={(v) => update("landType", v)}>
                <SelectTrigger data-testid="select-land-type" className="rounded-xl h-12 bg-brand-soft border-brand-line">
                  <SelectValue placeholder="Select land type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Agricultural" data-testid="land-type-option-Agricultural">Agricultural</SelectItem>
                  <SelectItem value="Barren" data-testid="land-type-option-Barren">Barren/Uncultivable</SelectItem>
                  <SelectItem value="Industrial" data-testid="land-type-option-Industrial">Industrial</SelectItem>
                  <SelectItem value="Other" data-testid="land-type-option-Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Land Ownership" required error={errors.landOwnership}>
              <Select value={form.landOwnership} onValueChange={(v) => update("landOwnership", v)}>
                <SelectTrigger data-testid="select-land-ownership" className="rounded-xl h-12 bg-brand-soft border-brand-line">
                  <SelectValue placeholder="Select land ownership" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Own" data-testid="land-ownership-option-Own">Own Land</SelectItem>
                  <SelectItem value="Leased" data-testid="land-ownership-option-Leased">Leased Land</SelectItem>
                  <SelectItem value="Shared" data-testid="land-ownership-option-Shared">Shared/Family Land</SelectItem>
                  <SelectItem value="NotFinalized" data-testid="land-ownership-option-NotFinalized">Not Finalized Yet</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <button
            type="submit"
            disabled={loading || redirecting}
            data-testid="lead-form-submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-greenDark text-white font-medium px-8 py-4 rounded-full shadow-glowGreen transition-all active:scale-[.98] disabled:opacity-70"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving your details…</>
            ) : redirecting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Preparing your kit…</>
            ) : (
              <><Lock className="w-4 h-4" strokeWidth={2} /> Continue · ₹{PRODUCT_PRICE_INR} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-brand-slate pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-green" strokeWidth={1.75} />
            Secure payment on Razorpay · UPI · Cards · Net Banking · Wallets
          </div>
        </motion.form>
      </div>

      <AnimatePresence>
        {redirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/85 backdrop-blur-md flex items-center justify-center px-6"
            data-testid="redirect-overlay"
          >
            <motion.div
              initial={{ y: 16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="max-w-sm w-full bg-white rounded-3xl shadow-float border border-brand-line p-8 text-center"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mb-5">
                <Loader2 className="w-8 h-8 text-brand-green animate-spin" strokeWidth={1.75} />
              </div>
              <h3 className="font-heading text-xl font-semibold text-brand-ink">Saving your details…</h3>
              <p className="mt-2 text-sm text-brand-slate leading-relaxed">Please wait a moment. We&apos;re preparing the next step for you.</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-brand-slate">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-green" strokeWidth={1.75} /> Your data is secure
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Field({ label, required, hint, error, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <Label className="text-[13px] font-medium text-brand-ink">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {hint && <span className="text-[11px] text-brand-mist">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

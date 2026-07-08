import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createLead, createOrder, verifyPayment } from "@/lib/api";
import PaymentModal from "@/components/PaymentModal";

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh","Puducherry","Chandigarh","Andaman and Nicobar Islands","Dadra and Nagar Haveli and Daman and Diu","Lakshadweep"];

const APPLICANT_TYPES = ["Farmer", "Land Owner", "Business", "Other"];

const initial = {
  full_name: "", mobile: "", whatsapp: "", email: "", state: "", district: "", village: "", applicant_type: "Farmer", consent: false,
};

const isValidMobile = (v) => /^[6-9]\d{9}$/.test(v.replace(/\s|-/g, "").replace(/^\+?91/, ""));

export default function LeadForm() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderCtx, setOrderCtx] = useState(null); // {order_id, amount, customer, test_mode}
  const [showPay, setShowPay] = useState(false);
  const [submitOnceGuard, setSubmitOnceGuard] = useState(false);
  const navigate = useNavigate();

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2) e.full_name = "Enter your full name";
    if (!isValidMobile(form.mobile)) e.mobile = "Enter a valid 10-digit Indian mobile";
    if (!isValidMobile(form.whatsapp)) e.whatsapp = "Enter a valid WhatsApp number";
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.state) e.state = "Select state";
    if (!form.district.trim()) e.district = "Enter district";
    if (!form.applicant_type) e.applicant_type = "Select applicant type";
    if (!form.consent) e.consent = "Consent is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (submitOnceGuard) return;
    if (!validate()) {
      toast.error("Please fix the errors and try again");
      return;
    }
    setSubmitOnceGuard(true);
    setLoading(true);
    try {
      const lead = await createLead(form);
      const order = await createOrder(lead.lead_id);
      setOrderCtx(order);
      setShowPay(true);
    } catch (err) {
      const msg = err?.response?.data?.detail || "Something went wrong. Please try again.";
      toast.error(typeof msg === "string" ? msg : "Please check your details");
    } finally {
      setLoading(false);
      setTimeout(() => setSubmitOnceGuard(false), 2000);
    }
  };

  const handlePaid = async (paymentPayload) => {
    try {
      const res = await verifyPayment(paymentPayload);
      toast.success("Payment successful!");
      navigate(`/success/${res.order_id}?t=${res.download_token}`);
    } catch (err) {
      const msg = err?.response?.data?.detail || "Payment verification failed";
      toast.error(msg);
    }
  };

  return (
    <section id="lead-form" className="py-16 sm:py-24 bg-brand-soft" data-testid="lead-form-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green text-xs font-semibold px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={2} /> Only ₹299 · One-time · No subscription
          </div>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-brand-ink">Fill your details &amp; get your kit</h2>
          <p className="mt-2 text-brand-slate">Takes under 60 seconds. WhatsApp support included after purchase.</p>
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
          <Field label="Full Name" required error={errors.full_name}>
            <Input data-testid="input-full-name" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} placeholder="Ramesh Kumar" className="rounded-xl h-12 bg-brand-soft border-brand-line" />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Mobile Number" required error={errors.mobile}>
              <Input data-testid="input-mobile" inputMode="numeric" maxLength={13} value={form.mobile} onChange={(e) => update("mobile", e.target.value)} placeholder="9876543210" className="rounded-xl h-12 bg-brand-soft border-brand-line" />
            </Field>
            <Field label="WhatsApp Number" required error={errors.whatsapp}>
              <Input data-testid="input-whatsapp" inputMode="numeric" maxLength={13} value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="9876543210" className="rounded-xl h-12 bg-brand-soft border-brand-line" />
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

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Village" hint="Optional">
              <Input data-testid="input-village" value={form.village} onChange={(e) => update("village", e.target.value)} placeholder="Village name" className="rounded-xl h-12 bg-brand-soft border-brand-line" />
            </Field>
            <Field label="Applicant Type" required error={errors.applicant_type}>
              <Select value={form.applicant_type} onValueChange={(v) => update("applicant_type", v)}>
                <SelectTrigger data-testid="select-applicant-type" className="rounded-xl h-12 bg-brand-soft border-brand-line">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {APPLICANT_TYPES.map((t) => <SelectItem key={t} value={t} data-testid={`applicant-option-${t}`}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <Checkbox data-testid="checkbox-consent" id="consent" checked={form.consent} onCheckedChange={(v) => update("consent", !!v)} className="mt-0.5" />
            <Label htmlFor="consent" className="text-sm text-brand-slate leading-relaxed cursor-pointer">
              I agree to receive updates regarding PM Kusum resources. <span className="text-red-500">*</span>
            </Label>
          </div>
          {errors.consent && <p className="text-xs text-red-600 -mt-2">{errors.consent}</p>}

          <button
            type="submit"
            disabled={loading}
            data-testid="lead-form-submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-greenDark text-white font-medium px-8 py-4 rounded-full shadow-glowGreen transition-all active:scale-[.98] disabled:opacity-60"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : <><Lock className="w-4 h-4" strokeWidth={2} /> Continue to Payment · ₹299</>}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-brand-slate pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-green" strokeWidth={1.75} />
            100% Secure · Razorpay · UPI · Cards · Net Banking · Wallets
          </div>
        </motion.form>
      </div>

      {showPay && orderCtx && (
        <PaymentModal
          ctx={orderCtx}
          onClose={() => setShowPay(false)}
          onPaid={handlePaid}
        />
      )}
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

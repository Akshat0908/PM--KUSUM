import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, ArrowRight, MessageCircle, Sun, Clock, Sparkles, Home } from "lucide-react";
import { PAYMENT_PAGE_URL, SUPPORT_WHATSAPP, PRODUCT_NAME, PRODUCT_PRICE_INR, PRODUCT_INCLUDES } from "@/lib/config";

export default function ConfirmationPage() {
  const [lead, setLead] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Step 1 Completed — Continue to Payment | PM Kusum";
    try {
      const raw = sessionStorage.getItem("pmk_lead");
      if (raw) setLead(JSON.parse(raw));
    } catch (_) { /* ignore */ }
    // Guard: if user opens /confirm directly without submitting, send them home.
    // (Non-blocking — keeps a soft affordance rather than a hard redirect.)
  }, []);

  const supportHref = `https://wa.me/91${SUPPORT_WHATSAPP}?text=${encodeURIComponent("Hi, I need help with the PM Kusum Starter Kit purchase.")}`;

  const handlePay = () => {
    window.location.href = PAYMENT_PAGE_URL;
  };

  return (
    <div className="min-h-screen bg-brand-soft flex flex-col" data-testid="confirmation-page">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b border-brand-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-testid="confirm-logo">
            <div className="w-9 h-9 rounded-xl bg-brand-green/10 flex items-center justify-center">
              <Sun className="w-5 h-5 text-brand-green" strokeWidth={1.75} />
            </div>
            <div className="leading-tight">
              <div className="font-heading font-semibold text-[15px]">PM Kusum Kit</div>
              <div className="text-[11px] text-brand-mist -mt-0.5">Independent Document Portal</div>
            </div>
          </Link>
          <button
            onClick={() => navigate("/")}
            data-testid="confirm-home-btn"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-brand-slate hover:text-brand-ink"
          >
            <Home className="w-4 h-4" /> Home
          </button>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
          {/* Progress: Step 1 done → Step 2 pending */}
          <div className="flex items-center gap-3 mb-6" data-testid="progress-indicator">
            <div className="flex-1 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.25} />
              </div>
              <div className="text-[13px] font-semibold text-brand-ink whitespace-nowrap">Details Saved</div>
              <div className="flex-1 h-[2px] bg-gradient-to-r from-brand-green to-brand-line rounded-full min-w-4" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border-2 border-brand-blue text-brand-blue flex items-center justify-center flex-shrink-0 font-heading font-semibold text-xs">2</div>
              <div className="text-[13px] font-semibold text-brand-slate whitespace-nowrap">Secure Payment</div>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="text-center"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 300 }}>
                <CheckCircle2 className="w-9 h-9 text-brand-green" strokeWidth={1.75} />
              </motion.div>
            </div>
            <h1 className="mt-5 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-brand-ink" data-testid="confirm-heading">
              ✅ Step 1 Completed
            </h1>
            <p className="mt-3 text-brand-slate max-w-lg mx-auto leading-relaxed">
              {lead?.name ? <>Thank you, <b>{lead.name.split(" ")[0]}</b>. </> : null}
              Your details have been successfully recorded. You are just one step away from getting your PM Kusum Starter Kit.
            </p>
          </motion.div>

          {/* Product card */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-10 bg-white rounded-3xl border border-brand-line shadow-soft overflow-hidden"
            data-testid="product-card"
          >
            <div className="bg-gradient-to-r from-brand-green/8 via-transparent to-brand-blue/8 border-b border-brand-line p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-brand-yellow/20 text-[#92400E] text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3">
                    <Sparkles className="w-3 h-3" strokeWidth={2.5} /> One-time · Digital delivery
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-brand-ink leading-tight" data-testid="product-title">{PRODUCT_NAME}</h2>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[11px] uppercase tracking-wider text-brand-mist font-semibold">You pay</div>
                  <div className="font-heading text-3xl sm:text-4xl font-semibold text-brand-ink mt-0.5" data-testid="product-price">₹{PRODUCT_PRICE_INR}</div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="text-[13px] font-semibold text-brand-ink mb-3">What&apos;s included</div>
              <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2.5" data-testid="product-includes">
                {PRODUCT_INCLUDES.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-sm text-brand-ink">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handlePay}
                data-testid="proceed-to-payment"
                className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-greenDark text-white font-medium px-8 py-4 rounded-full shadow-glowGreen transition-all active:scale-[.98]"
              >
                Proceed to Secure Payment · ₹{PRODUCT_PRICE_INR}
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-brand-slate">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-green" strokeWidth={1.75} />
                Secure payment on Razorpay · UPI · Cards · Net Banking · Wallets
              </div>
            </div>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-6 rounded-2xl bg-amber-50/70 border border-amber-200 p-5 flex gap-3"
            data-testid="important-notice"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-700" strokeWidth={1.75} />
            </div>
            <div className="text-sm text-amber-900 leading-relaxed">
              <div className="font-heading font-semibold text-amber-900 mb-1">What happens after payment?</div>
              After successful payment, Razorpay will display a confirmation message. Our team will verify your payment and deliver your <b>PM Kusum Starter Kit</b> to your registered WhatsApp number and Email within <b>15–30 minutes</b>.
            </div>
          </motion.div>

          {/* Secondary CTA */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={supportHref}
              target="_blank"
              rel="noreferrer"
              data-testid="confirm-need-help"
              className="inline-flex items-center justify-center gap-2 bg-white border border-brand-line hover:border-brand-green/40 text-brand-ink font-medium px-6 py-3 rounded-full transition-all text-sm w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4 text-brand-green" /> Need Help? Open WhatsApp
            </a>
            <Link
              to="/"
              data-testid="confirm-return-home"
              className="inline-flex items-center justify-center gap-2 text-sm text-brand-slate hover:text-brand-ink px-4 py-3"
            >
              Return to home
            </Link>
          </div>

          <p className="text-center text-[11px] text-brand-mist mt-6 max-w-md mx-auto leading-relaxed">
            This platform is an independent information portal. It is not affiliated with the Government of India. The fee is only for compiling and delivering the document kit.
          </p>
        </div>
      </main>
    </div>
  );
}

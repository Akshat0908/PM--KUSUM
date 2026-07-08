import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Home, MessageCircle, Radio, Clock, Sun } from "lucide-react";
import { SUPPORT_WHATSAPP, WHATSAPP_CHANNEL, PRODUCT_NAME } from "@/lib/config";

export default function ThankYouPage() {
  const [lead, setLead] = useState(null);

  useEffect(() => {
    document.title = "Thank You — PM Kusum Kit";
    try {
      const raw = sessionStorage.getItem("pmk_lead");
      if (raw) setLead(JSON.parse(raw));
    } catch (_) { /* ignore */ }
  }, []);

  const supportHref = `https://wa.me/91${SUPPORT_WHATSAPP}?text=${encodeURIComponent("Hi, I just paid for the PM Kusum Kit. Need assistance.")}`;

  return (
    <div className="min-h-screen bg-white flex flex-col" data-testid="thankyou-page">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b border-brand-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-testid="thankyou-logo">
            <div className="w-9 h-9 rounded-xl bg-brand-green/10 flex items-center justify-center">
              <Sun className="w-5 h-5 text-brand-green" strokeWidth={1.75} />
            </div>
            <div className="leading-tight">
              <div className="font-heading font-semibold text-[15px]">PM Kusum Kit</div>
              <div className="text-[11px] text-brand-mist -mt-0.5">Independent Document Portal</div>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-brand-green/10 flex items-center justify-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 300 }}>
                <CheckCircle2 className="w-12 h-12 text-brand-green" strokeWidth={1.75} />
              </motion.div>
            </div>
            <h1 className="mt-6 font-heading text-3xl sm:text-4xl font-semibold text-brand-ink" data-testid="thankyou-heading">🎉 Thank You{lead?.name ? `, ${lead.name.split(" ")[0]}` : ""}!</h1>
            <p className="mt-3 text-brand-slate max-w-lg mx-auto leading-relaxed">
              We have received your payment. Your <b>{PRODUCT_NAME}</b> will be shared on your registered <b>WhatsApp</b> number and <b>Email</b> within <b>15–30 minutes</b> after payment verification.
            </p>
          </motion.div>

          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="mt-10 bg-white border border-brand-line rounded-3xl shadow-soft p-6 sm:p-8">
            <ul className="space-y-4">
              <Step icon={CheckCircle2} title="Payment received" desc="We're notified as soon as Razorpay confirms your payment." tone="green" />
              <Step icon={Clock} title="Verification: 15–30 minutes" desc="Our team manually verifies the payment against our records for your safety." tone="blue" />
              <Step icon={MessageCircle} title="Kit delivered on WhatsApp & Email" desc="You'll receive the complete PDF kit on your registered contact details." tone="yellow" />
            </ul>

            <div className="mt-8 space-y-3">
              <a
                href={supportHref}
                target="_blank"
                rel="noreferrer"
                data-testid="thankyou-contact-support"
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-greenDark text-white font-medium px-8 py-4 rounded-full shadow-glowGreen transition-all active:scale-[.98]"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={2} /> Contact Support on WhatsApp
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WHATSAPP_CHANNEL && (
                  <a
                    href={WHATSAPP_CHANNEL}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="thankyou-whatsapp-channel"
                    className="inline-flex items-center justify-center gap-2 bg-[#E0F2FE] hover:bg-[#bae6fd] text-brand-blue font-medium px-6 py-3 rounded-full transition-all text-sm"
                  >
                    <Radio className="w-4 h-4" /> Join WhatsApp Channel
                  </a>
                )}
                <Link
                  to="/"
                  data-testid="thankyou-return-home"
                  className={`inline-flex items-center justify-center gap-2 bg-white border border-brand-line hover:border-brand-green/40 text-brand-ink font-medium px-6 py-3 rounded-full transition-all text-sm ${!WHATSAPP_CHANNEL ? "sm:col-span-2" : ""}`}
                >
                  <Home className="w-4 h-4 text-brand-green" /> Return Home
                </Link>
              </div>
            </div>
          </motion.div>

          <p className="text-center text-[11px] text-brand-mist mt-6">
            Support number: +91 {SUPPORT_WHATSAPP} · Response within business hours
          </p>
        </div>
      </main>
    </div>
  );
}

function Step({ icon: Icon, title, desc, tone }) {
  const tones = {
    green: "bg-brand-green/10 text-brand-green",
    blue: "bg-brand-blue/10 text-brand-blue",
    yellow: "bg-brand-yellow/20 text-[#B45309]",
  };
  return (
    <li className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tones[tone]}`}>
        <Icon className="w-5 h-5" strokeWidth={1.75} />
      </div>
      <div>
        <div className="font-heading text-[15px] font-semibold text-brand-ink">{title}</div>
        <div className="text-xs text-brand-slate mt-0.5 leading-relaxed">{desc}</div>
      </div>
    </li>
  );
}

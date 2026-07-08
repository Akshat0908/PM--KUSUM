import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, Smartphone, CreditCard, Building2, Wallet, ShieldCheck, Loader2 } from "lucide-react";

const METHODS = [
  { id: "upi", label: "UPI", icon: Smartphone, sub: "Google Pay, PhonePe, Paytm" },
  { id: "card", label: "Cards", icon: CreditCard, sub: "Credit / Debit / RuPay" },
  { id: "netbanking", label: "Net Banking", icon: Building2, sub: "All major banks" },
  { id: "wallet", label: "Wallets", icon: Wallet, sub: "Paytm, Amazon Pay" },
];

export default function PaymentModal({ ctx, onClose, onPaid }) {
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    if (processing) return;
    setProcessing(true);

    if (ctx.test_mode) {
      // Simulate Razorpay checkout flow for TEST mode with placeholder keys.
      await new Promise((r) => setTimeout(r, 1400));
      const fakePaymentId = `pay_test_${Math.random().toString(36).slice(2, 12)}`;
      const fakeSig = `test_sig_${Math.random().toString(36).slice(2, 20)}`;
      await onPaid({
        order_id: ctx.order_id,
        razorpay_order_id: ctx.rzp_order_id,
        razorpay_payment_id: fakePaymentId,
        razorpay_signature: fakeSig,
      });
      setProcessing(false);
      return;
    }

    // Live Razorpay checkout (loaded via CDN in index.html)
    const options = {
      key: ctx.key_id,
      amount: ctx.amount * 100,
      currency: ctx.currency,
      name: "PM Kusum Document Portal",
      description: "PM Kusum Tender & Document Kit",
      order_id: ctx.rzp_order_id,
      prefill: { name: ctx.customer.name, email: ctx.customer.email, contact: ctx.customer.contact },
      theme: { color: "#16A34A" },
      handler: async (res) => {
        await onPaid({
          order_id: ctx.order_id,
          razorpay_order_id: res.razorpay_order_id,
          razorpay_payment_id: res.razorpay_payment_id,
          razorpay_signature: res.razorpay_signature,
        });
        setProcessing(false);
      },
      modal: { ondismiss: () => setProcessing(false) },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        data-testid="payment-modal"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-float overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 sm:p-6 border-b border-brand-line flex items-center justify-between bg-gradient-to-r from-brand-green/5 to-brand-blue/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center">
                <Lock className="w-5 h-5 text-brand-green" strokeWidth={1.75} />
              </div>
              <div>
                <div className="font-heading font-semibold text-brand-ink">Secure Payment</div>
                <div className="text-[11px] text-brand-slate">Powered by Razorpay {ctx.test_mode && "(Test Mode)"}</div>
              </div>
            </div>
            <button onClick={onClose} data-testid="payment-close" className="w-9 h-9 rounded-full hover:bg-brand-soft flex items-center justify-center">
              <X className="w-4 h-4 text-brand-slate" />
            </button>
          </div>

          <div className="p-5 sm:p-6">
            <div className="rounded-2xl bg-brand-soft p-4 flex items-center justify-between mb-5">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-brand-mist font-semibold">You pay</div>
                <div className="font-heading text-2xl font-semibold text-brand-ink mt-0.5">₹{ctx.amount}</div>
                <div className="text-xs text-brand-slate">PM Kusum Tender & Document Kit</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-brand-mist">Order</div>
                <div className="text-[11px] font-mono text-brand-slate break-all max-w-[100px]">{ctx.order_id.slice(0, 12)}…</div>
              </div>
            </div>

            <div className="text-[13px] font-medium text-brand-ink mb-2">Choose payment method</div>
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  data-testid={`pay-method-${m.id}`}
                  className={`text-left rounded-2xl border p-3 transition-all ${method === m.id ? "border-brand-green bg-brand-green/5 ring-2 ring-brand-green/20" : "border-brand-line hover:border-brand-green/40"}`}
                >
                  <div className="flex items-center gap-2">
                    <m.icon className={`w-4 h-4 ${method === m.id ? "text-brand-green" : "text-brand-slate"}`} strokeWidth={1.75} />
                    <div className="text-[13px] font-semibold text-brand-ink">{m.label}</div>
                  </div>
                  <div className="text-[10px] text-brand-slate mt-1">{m.sub}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handlePay}
              disabled={processing}
              data-testid="pay-now-button"
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-greenDark text-white font-medium px-8 py-3.5 rounded-full shadow-glowGreen transition-all active:scale-[.98] disabled:opacity-60"
            >
              {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing payment…</> : <>Pay ₹{ctx.amount} securely</>}
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-brand-slate">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-green" strokeWidth={1.75} />
              256-bit encryption · PCI-DSS compliant · Instant refund on failure
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Download, MessageCircle, ArrowRight, Home } from "lucide-react";
import { getOrder, downloadUrl } from "@/lib/api";

export default function SuccessPage() {
  const { orderId } = useParams();
  const [params] = useSearchParams();
  const token = params.get("t");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Payment Successful — PM Kusum Kit";
    if (!token) { setError("Missing download token"); return; }
    getOrder(orderId).then((o) => {
      if (o.status !== "paid") { setError("Payment not completed"); return; }
      setOrder(o);
    }).catch(() => setError("Order not found"));
  }, [orderId, token]);

  return (
    <div className="min-h-screen bg-white flex flex-col" data-testid="success-page">
      <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 py-14 sm:py-24 flex-1">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-brand-green/10 flex items-center justify-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 300 }}>
              <CheckCircle2 className="w-12 h-12 text-brand-green" strokeWidth={1.75} />
            </motion.div>
          </div>
          <h1 className="mt-6 font-heading text-3xl sm:text-4xl font-semibold text-brand-ink">Payment Successful</h1>
          <p className="mt-3 text-brand-slate">Thank you for purchasing the PM Kusum Tender & Document Kit. Your order has been confirmed.</p>
        </motion.div>

        {error && <div data-testid="success-error" className="mt-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

        {order && (
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mt-10 bg-white border border-brand-line rounded-3xl shadow-soft p-6 sm:p-8">
            <div className="grid sm:grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-brand-mist font-semibold">Order ID</div>
                <div data-testid="order-id" className="mt-1 font-mono text-xs text-brand-ink break-all">{order.id}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-brand-mist font-semibold">Amount</div>
                <div className="mt-1 font-heading text-lg font-semibold text-brand-ink">₹{order.amount}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-brand-mist font-semibold">Status</div>
                <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green bg-brand-green/10 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-brand-green rounded-full" /> PAID
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <a
                href={downloadUrl(order.id, token)}
                data-testid="download-kit-button"
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-greenDark text-white font-medium px-8 py-4 rounded-full shadow-glowGreen transition-all active:scale-[.98]"
              >
                <Download className="w-4 h-4" strokeWidth={2} /> Download Document Kit (PDF)
              </a>
              <button
                onClick={() => navigate(`/download/${order.id}?t=${token}`)}
                data-testid="open-download-page"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#E0F2FE] hover:bg-[#bae6fd] text-brand-blue font-medium px-8 py-3.5 rounded-full transition-all active:scale-[.98]"
              >
                Open Download Page <ArrowRight className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://wa.me/919999999999?text=Hi%2C%20I%20just%20purchased%20the%20PM%20Kusum%20Kit"
                  target="_blank" rel="noreferrer"
                  data-testid="join-whatsapp"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-brand-line hover:border-brand-green/40 text-brand-ink font-medium px-6 py-3 rounded-full transition-all text-sm"
                >
                  <MessageCircle className="w-4 h-4 text-brand-green" /> Join WhatsApp
                </a>
                <Link
                  to="/"
                  data-testid="return-home"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-brand-line hover:border-brand-blue/40 text-brand-ink font-medium px-6 py-3 rounded-full transition-all text-sm"
                >
                  <Home className="w-4 h-4 text-brand-blue" /> Return Home
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        <p className="text-center text-[11px] text-brand-mist mt-6">
          A copy of your kit will also be delivered to your WhatsApp/email shortly.
        </p>
      </div>
    </div>
  );
}

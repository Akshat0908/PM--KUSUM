import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, ShieldCheck, ArrowLeft, FileText } from "lucide-react";
import { getOrder, downloadUrl } from "@/lib/api";

export default function DownloadPage() {
  const { orderId } = useParams();
  const [params] = useSearchParams();
  const token = params.get("t");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Download your PM Kusum Kit";
    if (!token) { setError("Missing download token"); return; }
    getOrder(orderId).then((o) => {
      if (o.status !== "paid") { setError("Payment not completed. Please complete payment to download."); return; }
      setOrder(o);
    }).catch(() => setError("Order not found"));
  }, [orderId, token]);

  return (
    <div className="min-h-screen bg-brand-soft" data-testid="download-page">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 sm:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-slate hover:text-brand-ink mb-6" data-testid="back-home">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-3xl shadow-soft border border-brand-line p-6 sm:p-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-brand-green" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-brand-mist font-semibold">Purchase Verified</div>
              <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-brand-ink">Your kit is ready</h1>
            </div>
          </div>

          <p className="mt-4 text-sm text-brand-slate">Click below to download your PM Kusum Tender & Document Kit. The link is protected — it works only for your verified order.</p>

          {error && <div data-testid="download-error" className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

          {order && (
            <>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <Info label="Purchase Date" value={new Date(order.paid_at).toLocaleDateString()} testid="info-date" />
                <Info label="Order ID" value={order.id.slice(0, 10) + "…"} testid="info-order" />
                <Info label="Customer" value={order.customer_name} testid="info-customer" />
              </div>

              <a
                href={downloadUrl(order.id, token)}
                data-testid="download-pdf-button"
                className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-greenDark text-white font-medium px-8 py-4 rounded-full shadow-glowGreen transition-all active:scale-[.98]"
              >
                <Download className="w-4 h-4" strokeWidth={2} /> Download PDF
              </a>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-brand-slate">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-green" strokeWidth={1.75} />
                Link protected · Only accessible after verified payment
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Info({ label, value, testid }) {
  return (
    <div className="bg-brand-soft rounded-2xl p-3 border border-brand-line">
      <div className="text-[10px] uppercase tracking-wider text-brand-mist font-semibold">{label}</div>
      <div data-testid={testid} className="mt-1 text-xs font-medium text-brand-ink break-all">{value || "—"}</div>
    </div>
  );
}

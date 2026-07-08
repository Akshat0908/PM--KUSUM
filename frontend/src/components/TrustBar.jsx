import { motion } from "framer-motion";
import { Users, ShieldCheck, Zap, Headphones } from "lucide-react";

const stats = [
  { icon: Users, k: "2,400+", v: "Farmers served", color: "text-brand-green", bg: "bg-brand-green/10" },
  { icon: ShieldCheck, k: "100%", v: "Secure payment", color: "text-brand-blue", bg: "bg-brand-blue/10" },
  { icon: Zap, k: "<30 sec", v: "Instant delivery", color: "text-[#B45309]", bg: "bg-brand-yellow/20" },
  { icon: Headphones, k: "7 days", v: "WhatsApp support", color: "text-brand-green", bg: "bg-brand-green/10" },
];

export default function TrustBar() {
  return (
    <section className="py-8 sm:py-10 bg-white border-y border-brand-line" data-testid="trust-bar">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.v}
              initial={{ y: 12, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="flex items-center gap-3"
              data-testid={`trust-stat-${i}`}
            >
              <div className={`w-11 h-11 rounded-2xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon className={`w-5 h-5 ${s.color}`} strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <div className="font-heading text-lg font-semibold text-brand-ink leading-tight">{s.k}</div>
                <div className="text-[11px] sm:text-xs text-brand-slate leading-tight">{s.v}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

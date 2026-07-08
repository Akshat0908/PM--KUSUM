import { motion } from "framer-motion";
import { FileText, ListChecks, Compass, Zap } from "lucide-react";

const items = [
  { icon: FileText, title: "Latest Tender", desc: "Always kept up to date with the newest PM Kusum tender details, in plain language.", color: "text-brand-green", bg: "bg-brand-green/10" },
  { icon: ListChecks, title: "Complete Checklist", desc: "A ready-to-print document list — no confusion, no missing papers.", color: "text-brand-blue", bg: "bg-brand-blue/10" },
  { icon: Compass, title: "Step-by-Step Guidance", desc: "Every step of the application explained in simple words, in the right order.", color: "text-[#B45309]", bg: "bg-brand-yellow/20" },
  { icon: Zap, title: "Instant on Your Phone", desc: "The moment payment is done, your PDF arrives — no waiting, no follow-ups.", color: "text-brand-green", bg: "bg-brand-green/10" },
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-16 sm:py-24 bg-white" data-testid="benefits-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 sm:mb-14">
          <div className="text-xs font-semibold tracking-wider uppercase text-brand-mist">Made for farmers &amp; land owners</div>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-brand-ink">Everything you need &mdash; nothing you don&apos;t</h2>
          <p className="mt-3 text-brand-slate leading-relaxed">Save hours of confusion, avoid rejection, and apply with clarity. Made for real people, not government portals.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="bg-white border border-brand-line rounded-3xl p-6 sm:p-7 shadow-soft hover:-translate-y-1 transition-transform duration-300"
              data-testid={`benefit-card-${i}`}
            >
              <div className={`w-12 h-12 rounded-2xl ${it.bg} flex items-center justify-center mb-4`}>
                <it.icon className={`w-6 h-6 ${it.color}`} strokeWidth={1.75} />
              </div>
              <h3 className="font-heading text-lg font-semibold text-brand-ink">{it.title}</h3>
              <p className="mt-1.5 text-sm text-brand-slate leading-relaxed">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, Sun, ArrowRight } from "lucide-react";

const tiers = [
  {
    size: "2 Acres",
    capacity: "400 kW Solar Plant",
    monthly: "₹1.6 Lakhs",
    yearly: "₹19.2 Lakhs",
    total25yr: "₹4.8 Crores",
    desc: "Ideal for small land owners. Perfect starting capacity with quick approval.",
    color: "border-brand-line hover:border-brand-green/30"
  },
  {
    size: "5 Acres",
    capacity: "1.0 MW (1000 kW)",
    monthly: "₹4.1 Lakhs",
    yearly: "₹49.2 Lakhs",
    total25yr: "₹12.3 Crores",
    desc: "Most popular choice. Balanced size for optimal power grid connection.",
    color: "border-brand-green/40 bg-brand-green/[0.02] relative shadow-soft scale-105 sm:scale-105 border-2",
    badge: "Most Profitable"
  },
  {
    size: "10 Acres",
    capacity: "2.0 MW (2000 kW)",
    monthly: "₹8.3 Lakhs",
    yearly: "₹99.6 Lakhs",
    total25yr: "₹24.9 Crores",
    desc: "Max permissible size under Component-A. Generates generational wealth.",
    color: "border-brand-line hover:border-brand-blue/30"
  }
];

export default function IncomePotential() {
  return (
    <section id="income" className="py-16 sm:py-24 bg-brand-soft border-y border-brand-line" data-testid="income-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} /> Guaranteed Income Potential
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-brand-ink">
            Turn empty land into a <span className="text-brand-green">steady income stream</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-brand-slate leading-relaxed">
            Under government-approved PM Kusum guidelines, lease your barren or agricultural land for solar power plants and secure fixed monthly payments for <b>25 years</b>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 items-stretch pt-2 pb-6">
          {tiers.map((t, i) => (
            <motion.div
              key={t.size}
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`bg-white border rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${t.color}`}
              data-testid={`income-tier-${i}`}
            >
              {t.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-green text-white text-[11px] font-bold tracking-wider uppercase px-3.5 py-1 rounded-full shadow-md">
                  {t.badge}
                </div>
              )}

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-heading text-2xl font-bold text-brand-ink">{t.size}</span>
                  <span className="text-xs font-medium text-brand-mist bg-brand-soft px-2.5 py-1 rounded-md">{t.capacity}</span>
                </div>
                <p className="text-xs text-brand-slate mb-6 leading-relaxed">{t.desc}</p>

                <div className="space-y-4 border-t border-brand-line pt-6">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-brand-mist font-semibold">Estimated Earnings</div>
                    <div className="font-heading text-3xl font-bold text-brand-green mt-1">{t.monthly}<span className="text-xs font-normal text-brand-slate"> / month</span></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-brand-soft">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-brand-mist">Yearly</div>
                      <div className="font-heading text-sm font-semibold text-brand-ink mt-0.5">{t.yearly}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-brand-mist">25-Yr Contract</div>
                      <div className="font-heading text-sm font-semibold text-brand-blue mt-0.5">{t.total25yr}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="#lead-form"
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-soft hover:bg-brand-green/10 text-brand-ink hover:text-brand-green font-medium py-3 rounded-full transition-all text-sm"
                >
                  Check Eligibility
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-brand-slate">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-green" /> State Government DISCOM Guaranteed Contracts
          </div>
          <div className="hidden sm:block text-brand-line">|</div>
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-brand-yellow" /> Direct power grids connection for 25 years
          </div>
        </div>
      </div>
    </section>
  );
}

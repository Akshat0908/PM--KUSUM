import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Zap, Download, Play } from "lucide-react";

const bullets = [
  "Latest tender in simple language",
  "Complete document checklist",
  "Clear step-by-step guidance",
  "Instant PDF on your phone",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-radial-soft" data-testid="hero-section">
      <div className="absolute inset-0 bg-grid opacity-[0.35] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-20 sm:pb-24 relative">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-brand-yellow/15 text-[#92400E] text-xs font-semibold px-3 py-1.5 rounded-full mb-5" data-testid="hero-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" /> Kisan-friendly · Updated for this season
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-brand-ink" data-testid="hero-heading">
              Apply for <span className="text-brand-green">PM Kusum</span> with confidence &mdash; <span className="text-brand-blue">without the confusion</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-brand-slate max-w-xl leading-relaxed">
              A ready-to-use document kit made for farmers and land owners. No jargon, no running around &mdash; everything you need in one PDF, delivered to your phone.
            </p>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 max-w-lg">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-brand-ink">
                  <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0" strokeWidth={1.75} />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#lead-form"
                data-testid="hero-primary-cta"
                className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-greenDark text-white font-medium px-7 py-3.5 rounded-full shadow-glowGreen transition-all active:scale-95"
              >
                Get My Kit
                <Download className="w-4 h-4" strokeWidth={2} />
              </a>
              <a
                href="#included"
                data-testid="hero-secondary-cta"
                className="inline-flex items-center gap-2 bg-white border border-brand-line hover:border-brand-blue/40 text-brand-blue font-medium px-7 py-3.5 rounded-full transition-all active:scale-95"
              >
                <Play className="w-4 h-4" strokeWidth={2} /> See what&apos;s inside
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-brand-slate">
              <div className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-brand-green" strokeWidth={1.75} /> Secure Razorpay payment</div>
              <div className="inline-flex items-center gap-1.5"><Zap className="w-4 h-4 text-brand-blue" strokeWidth={1.75} /> Instant PDF delivery</div>
              <div className="inline-flex items-center gap-1.5">
                <div className="flex -space-x-2">
                  <img src="https://i.pravatar.cc/60?img=59" alt="" className="w-5 h-5 rounded-full border border-white" loading="lazy" />
                  <img src="https://i.pravatar.cc/60?img=12" alt="" className="w-5 h-5 rounded-full border border-white" loading="lazy" />
                  <img src="https://i.pravatar.cc/60?img=32" alt="" className="w-5 h-5 rounded-full border border-white" loading="lazy" />
                </div>
                Trusted by 2,400+ farmers
              </div>
            </div>

            <p className="mt-5 text-[11px] text-brand-mist max-w-md leading-relaxed">
              This is an independent information portal. It is NOT a government website. The fee is only for compiling and delivering the document kit.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-float ring-1 ring-brand-line">
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80"
                alt="Farmer with solar panels on green field"
                className="w-full h-[380px] sm:h-[520px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              <div className="absolute left-5 bottom-5 right-5 flex items-end justify-between gap-3">
                <div className="text-white">
                  <div className="text-[11px] uppercase tracking-wider opacity-80">Real applicants</div>
                  <div className="font-heading text-lg font-semibold leading-tight">From your village, for your village</div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="hidden sm:flex absolute -left-6 bottom-10 items-center gap-3 bg-white rounded-2xl shadow-float px-4 py-3 border border-brand-line animate-float-slow"
              data-testid="hero-badge-secure"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-brand-green" strokeWidth={1.75} />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-brand-ink">Verified Kit</div>
                <div className="text-[11px] text-brand-slate">Updated this season</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="hidden sm:flex absolute -right-4 top-8 items-center gap-3 bg-white rounded-2xl shadow-float px-4 py-3 border border-brand-line"
              data-testid="hero-badge-instant"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-brand-blue" strokeWidth={1.75} />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-brand-ink">On your phone</div>
                <div className="text-[11px] text-brand-slate">In under 30 seconds</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

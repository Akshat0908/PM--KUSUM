import { motion } from "framer-motion";
import { FileText, ClipboardList, BadgeCheck, Workflow, CalendarDays, AlertTriangle, Lightbulb, HelpCircle } from "lucide-react";

const features = [
  { icon: FileText, title: "Latest PM Kusum Tender PDF", desc: "The most recent tender information, organised into readable sections." },
  { icon: ClipboardList, title: "Required Document Checklist", desc: "Every document you'll need — printable and shareable." },
  { icon: BadgeCheck, title: "Eligibility Summary", desc: "Quickly check if you qualify before you invest time filling forms." },
  { icon: Workflow, title: "Application Process", desc: "A clean, numbered walkthrough of the entire process." },
  { icon: CalendarDays, title: "Important Dates", desc: "Key dates and windows to plan your submission." },
  { icon: AlertTriangle, title: "Reasons Applications Get Rejected", desc: "Learn what to avoid — save months of rework." },
  { icon: Lightbulb, title: "Tips Before Applying", desc: "Insider suggestions that most first-time applicants miss." },
  { icon: HelpCircle, title: "Frequently Asked Questions", desc: "Common doubts answered in simple language." },
];

export default function WhatsIncluded() {
  return (
    <section id="included" className="py-16 sm:py-24 bg-brand-soft" data-testid="included-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 sm:mb-14">
          <div className="text-xs font-semibold tracking-wider uppercase text-brand-mist">What you&apos;ll receive</div>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-brand-ink">A complete kit, thoughtfully organised</h2>
          <p className="mt-3 text-brand-slate leading-relaxed">Instantly downloadable PDF containing everything below. No fluff, no ads.</p>
          <span className="sr-only">You will receive a complete kit.</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white border border-brand-line rounded-2xl p-5 shadow-soft hover:-translate-y-0.5 transition-transform"
              data-testid={`included-card-${i}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-brand-green" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-heading text-[15px] font-semibold text-brand-ink leading-snug">{f.title}</h3>
                  <p className="mt-1 text-xs text-brand-slate leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

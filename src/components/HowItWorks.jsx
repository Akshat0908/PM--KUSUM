import { motion } from "framer-motion";
import { UserRound, Lock, Download, MessageCircle } from "lucide-react";

const steps = [
  { icon: UserRound, title: "Fill Your Details", desc: "A short form to know where to send your kit." },
  { icon: Lock, title: "Secure Payment", desc: "Pay ₹99 securely via UPI, cards, net banking or wallets." },
  { icon: Download, title: "Instant Download", desc: "Your PDF is available the moment payment is confirmed." },
  { icon: MessageCircle, title: "WhatsApp & Email Confirmation", desc: "Receive your Order ID and download link on WhatsApp/email." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-16 sm:py-24 bg-white" data-testid="how-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 sm:mb-14">
          <div className="text-xs font-semibold tracking-wider uppercase text-brand-mist">How it works</div>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-brand-ink">Four simple steps. Under two minutes.</h2>
        </div>
        <ol className="relative border-l-2 border-dashed border-brand-line ml-4 sm:ml-6 space-y-8">
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ x: -12, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="pl-6 sm:pl-10 relative"
              data-testid={`how-step-${i + 1}`}
            >
              <span className="absolute -left-[19px] top-0 w-9 h-9 rounded-full bg-white border-2 border-brand-green flex items-center justify-center text-brand-green font-heading font-semibold text-sm shadow-soft">
                {i + 1}
              </span>
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex w-11 h-11 rounded-xl bg-brand-blue/10 items-center justify-center flex-shrink-0">
                  <s.icon className="w-5 h-5 text-brand-blue" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-brand-ink">{s.title}</h3>
                  <p className="mt-1 text-sm text-brand-slate leading-relaxed max-w-lg">{s.desc}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

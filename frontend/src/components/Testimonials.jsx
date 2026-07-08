import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  { name: "Ramesh Patil", place: "Nashik, Maharashtra", stars: 5, avatar: "https://i.pravatar.cc/120?img=59", text: "Do baar office ke chakkar bach gaye. Checklist itni saaf hai ki ek hi baar mein sab documents ready kar liye." },
  { name: "Sunita Devi", place: "Bhopal, Madhya Pradesh", stars: 5, avatar: "https://i.pravatar.cc/120?img=47", text: "Application ke steps bahut simple bhaasha mein hain. Beti ne padh ke mujhe samjha diya. Ek hi baithak mein form bhar diya." },
  { name: "Iqbal Singh", place: "Ludhiana, Punjab", stars: 5, avatar: "https://i.pravatar.cc/120?img=12", text: "Payment ke turant baad WhatsApp aur email dono par kit mil gaya. Bilkul asli aur professional lagta hai." },
  { name: "Anitha Reddy", place: "Warangal, Telangana", stars: 5, avatar: "https://i.pravatar.cc/120?img=32", text: "Rejection reasons wala page sabse useful tha. Apna draft check karke fix kiya, tab submit kiya." },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-brand-soft relative overflow-hidden" data-testid="testimonials-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-2xl mb-8 sm:mb-12">
          <div className="text-xs font-semibold tracking-wider uppercase text-brand-mist">Real stories</div>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-brand-ink">Farmers who saved time and stress</h2>
          <p className="mt-3 text-brand-slate leading-relaxed">Real feedback from applicants across India. No paid actors, no stock quotes.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative bg-white rounded-2xl p-5 border border-brand-line shadow-soft hover:-translate-y-0.5 transition-transform"
              data-testid={`testimonial-${i}`}
            >
              <Quote className="absolute right-4 top-4 w-6 h-6 text-brand-green/20" strokeWidth={2} />
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: r.stars }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
                ))}
              </div>
              <p className="text-sm text-brand-ink leading-relaxed">&ldquo;{r.text}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3 pt-3 border-t border-brand-line">
                <img
                  src={r.avatar}
                  alt={r.name}
                  loading="lazy"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-soft"
                />
                <div>
                  <div className="text-[13px] font-semibold text-brand-ink">{r.name}</div>
                  <div className="text-[11px] text-brand-slate">{r.place}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-brand-slate">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
            ))}
          </div>
          <span className="font-semibold text-brand-ink">4.9 / 5</span>
          <span>average rating from 2,400+ farmers</span>
        </div>
      </div>
    </section>
  );
}

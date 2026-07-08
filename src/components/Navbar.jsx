import { motion } from "framer-motion";
import { Sun } from "lucide-react";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-brand-line"
      data-testid="site-navbar"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2" data-testid="nav-logo">
          <div className="w-9 h-9 rounded-xl bg-brand-green/10 flex items-center justify-center">
            <Sun className="w-5 h-5 text-brand-green" strokeWidth={1.75} />
          </div>
          <div className="leading-tight">
            <div className="font-heading font-semibold text-[15px]">PM Kusum Kit</div>
            <div className="text-[11px] text-brand-mist -mt-0.5">Independent Document Portal</div>
          </div>
        </a>
        <a
          href="#lead-form"
          data-testid="nav-cta"
          className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-greenDark text-white font-medium px-5 py-2.5 rounded-full shadow-glowGreen transition-all active:scale-95 text-sm"
        >
          Get My Kit
        </a>
      </div>
    </motion.header>
  );
}

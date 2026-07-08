import { Sun, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-ink text-white pt-14 pb-10" data-testid="site-footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-green/20 flex items-center justify-center">
                <Sun className="w-5 h-5 text-brand-green" strokeWidth={1.75} />
              </div>
              <div className="font-heading font-semibold">PM Kusum Kit</div>
            </div>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-xs">
              Independent portal helping applicants understand the PM Kusum Scheme.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Quick Links</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li><a href="#benefits" className="hover:text-white">Benefits</a></li>
              <li><a href="#included" className="hover:text-white">What&apos;s Included</a></li>
              <li><a href="#how" className="hover:text-white">How it Works</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Legal</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-white" data-testid="link-privacy">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white" data-testid="link-terms">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white" data-testid="link-refund">Refund Policy</a></li>
              <li><a href="#" className="hover:text-white" data-testid="link-disclaimer">Disclaimer</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Contact</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@pmkusumkit.in</li>
              <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp Support</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>© {new Date().getFullYear()} PM Kusum Document Portal · Independent Information Kit</div>
          <div>Not a Government Website</div>
        </div>
      </div>
    </footer>
  );
}

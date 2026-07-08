import { Info } from "lucide-react";

export default function Disclaimer() {
  return (
    <section className="py-10 bg-white" data-testid="disclaimer-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 sm:p-6 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-amber-700" strokeWidth={1.75} />
          </div>
          <div className="text-sm text-amber-900 leading-relaxed">
            <div className="font-heading font-semibold text-amber-900 mb-1">Disclaimer</div>
            This platform is an independent information portal created to help applicants understand the PM Kusum Scheme. It is <b>not</b> affiliated with, endorsed by, or operated by the Government of India or any government department. The amount charged is only for compiling, organizing and delivering the document kit. It is <b>NOT</b> a government application fee.
          </div>
        </div>
      </div>
    </section>
  );
}

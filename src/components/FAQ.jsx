import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const items = [
  { q: "What is included in the PM Kusum Kit?", a: "You get the latest tender highlights, a complete document checklist, eligibility summary, application process, important dates, reasons for rejection, tips, and a full FAQ — all in a single PDF." },
  { q: "How will I receive my kit?", a: "As soon as your ₹99 payment is confirmed, you get an instant download link on the success page. You'll also receive it on your WhatsApp/email." },
  { q: "How often is the kit updated?", a: "Whenever there are tender changes or new circulars, the kit is refreshed. You always receive the most recent version at the time of purchase." },
  { q: "Is this a government website?", a: "No. This is an independent information portal. It is NOT affiliated with any government department. The fee is only for compiling and delivering the document kit." },
  { q: "Who should buy this?", a: "Any farmer, land owner, business or applicant planning to apply for the PM Kusum scheme and wants clarity before starting the process." },
  { q: "Can I get support after purchase?", a: "Yes, reach out on WhatsApp / email listed in the footer. We answer application-related doubts related to the kit." },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-16 sm:py-24 bg-white" data-testid="faq-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <div className="text-xs font-semibold tracking-wider uppercase text-brand-mist">FAQ</div>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-brand-ink">Common questions, answered</h2>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-3" data-testid="faq-accordion">
          {items.map((it, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-brand-line rounded-2xl bg-white shadow-soft px-4 sm:px-5">
              <AccordionTrigger data-testid={`faq-trigger-${i}`} className="text-left font-heading font-medium text-brand-ink hover:no-underline py-4">
                {it.q}
              </AccordionTrigger>
              <AccordionContent className="text-brand-slate text-sm leading-relaxed pb-4">
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

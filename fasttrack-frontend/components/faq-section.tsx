import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "How can I track my parcel?",
      answer:
        "You can track your parcel using the tracking ID provided when you book a delivery. Simply enter the tracking ID in our tracking section above or on our website.",
    },
    {
      question: "What are your delivery timeframes?",
      answer:
        "We offer same-day delivery within major cities, next-day delivery for nearby areas, and 2-3 day delivery for remote locations. Express delivery options are also available.",
    },
    {
      question: "Do you provide packaging services?",
      answer:
        "Yes, we offer professional packaging services to ensure your items are properly protected during transit. Our team uses high-quality materials and follows best practices.",
    },
    {
      question: "How do I become a merchant?",
      answer:
        "You can sign up as a merchant through our website or mobile app. Simply provide your business details, verify your information, and start using our services immediately.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept cash on delivery, mobile banking (bKash, Nagad, Rocket), bank transfers, and credit/debit cards. Payment can be made online or upon delivery.",
    },
    {
      question: "Do you offer insurance for valuable items?",
      answer:
        "Yes, we provide insurance coverage for valuable items. The insurance cost depends on the declared value of your parcel. Please contact our customer service for more details.",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Find answers to common questions about our courier services</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

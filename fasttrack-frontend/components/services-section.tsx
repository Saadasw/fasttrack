import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Package, Box, Warehouse } from "lucide-react"

export function ServicesSection() {
  const services = [
    {
      icon: ShoppingCart,
      title: "Ecommerce Delivery",
      description: "Seamless integration with your online store for automated order fulfillment.",
    },
    {
      icon: Package,
      title: "Pick and Drop",
      description: "Door-to-door pickup and delivery service for your convenience.",
    },
    {
      icon: Box,
      title: "Packaging",
      description: "Professional packaging services to ensure your items arrive safely.",
    },
    {
      icon: Warehouse,
      title: "Warehousing",
      description: "Secure storage solutions with inventory management capabilities.",
    },
  ]

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive courier solutions tailored to meet your business needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="bg-primary/10 rounded-full p-4 w-fit mx-auto">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

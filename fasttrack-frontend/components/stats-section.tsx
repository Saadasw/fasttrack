import { Users, Truck, MapPin } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "300k+",
      label: "Registered Merchants",
    },
    {
      icon: Truck,
      value: "10k+",
      label: "Delivery Personnel",
    },
    {
      icon: MapPin,
      value: "500+",
      label: "Delivery Points",
    },
  ]

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="bg-primary/10 rounded-full p-6 w-fit mx-auto">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

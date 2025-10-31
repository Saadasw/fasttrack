"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Package, Truck, CheckCircle } from "lucide-react"

export function TrackingSection() {
  const [trackingId, setTrackingId] = useState("")
  const [isTracking, setIsTracking] = useState(false)

  const handleTrack = () => {
    setIsTracking(true)
    // Simulate tracking delay
    setTimeout(() => setIsTracking(false), 2000)
  }

  const trackingSteps = [
    { icon: Package, label: "Order Received", completed: true },
    { icon: Truck, label: "In Transit", completed: true, active: true },
    { icon: CheckCircle, label: "Delivered", completed: false },
  ]

  return (
    <section id="tracking" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">Track Your Delivery</h2>
            <p className="text-lg text-muted-foreground">Enter your tracking ID to see real-time delivery status</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Tracking ID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter your tracking ID (e.g., FT123456789)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleTrack} disabled={isTracking}>
                  <Search className="h-4 w-4 mr-2" />
                  {isTracking ? "Tracking..." : "Track"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {trackingId && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Status - {trackingId}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-full ${
                          step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        } ${step.active ? "delivery-pulse" : ""}`}
                      >
                        <step.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-semibold ${step.completed ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {step.label}
                        </div>
                        {step.active && <div className="text-sm text-primary">Currently in progress</div>}
                      </div>
                      {index < trackingSteps.length - 1 && (
                        <div className={`w-px h-8 ${step.completed ? "bg-primary" : "bg-border"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}

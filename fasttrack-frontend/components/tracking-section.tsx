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
    if (!trackingId.trim()) {
      alert('Please enter a tracking ID')
      return
    }
    // Redirect to tracking page
    window.location.href = `/tracking/${trackingId.trim()}`
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
                <Button onClick={handleTrack} disabled={!trackingId.trim()}>
                  <Search className="h-4 w-4 mr-2" />
                  Track
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Track Your Parcel Anytime
                </h3>
                <p className="text-gray-600 mb-4">
                  No login required! Just enter your tracking ID to see real-time updates on your delivery.
                </p>
                <div className="flex gap-3 justify-center text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Real-time updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>No login needed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

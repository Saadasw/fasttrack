'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Package, Search, Truck, CheckCircle, Clock, AlertCircle, MapPin, User, Phone } from 'lucide-react'

interface TrackingResult {
  tracking_id: string
  status: string
  recipient_name: string
  created_at: string
  updated_at: string
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock, description: 'Parcel is waiting to be processed' },
  assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-800', icon: Truck, description: 'Parcel has been assigned to a courier' },
  picked_up: { label: 'Picked Up', color: 'bg-purple-100 text-purple-800', icon: Truck, description: 'Parcel has been picked up from sender' },
  in_transit: { label: 'In Transit', color: 'bg-indigo-100 text-indigo-800', icon: Truck, description: 'Parcel is on its way to destination' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle, description: 'Parcel has been delivered successfully' },
  returned: { label: 'Returned', color: 'bg-red-100 text-red-800', icon: AlertCircle, description: 'Parcel has been returned to sender' }
}

export default function TrackingPage() {
  const params = useParams()
  const [trackingId, setTrackingId] = useState(params.tracking_id as string || '')
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID')
      return
    }

    setIsLoading(true)
    setError(null)
    setTrackingResult(null)

    try {
      // Call backend directly from browser (client-side)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/parcels/tracking/${trackingId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Parcel not found')
        }
        throw new Error('Failed to track parcel')
      }
      
      const data = await response.json()
      setTrackingResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to track parcel')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  }

  // Auto-track when page loads with tracking ID in URL
  useEffect(() => {
    if (trackingId && trackingId.trim()) {
      handleTrack()
    }
  }, []) // Empty dependency array means run once on mount

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Parcel</h1>
          <p className="text-gray-600">
            Enter your tracking ID to get real-time updates on your parcel
          </p>
        </div>

        {/* Tracking Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Enter Tracking ID
            </CardTitle>
            <CardDescription>
              Find your tracking ID on your receipt or confirmation email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="e.g., FT12345678"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                className="flex-1"
              />
              <Button 
                onClick={handleTrack}
                disabled={isLoading || !trackingId.trim()}
              >
                {isLoading ? 'Tracking...' : 'Track'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-800 mb-2">Tracking Failed</h3>
                <p className="text-red-600">{error}</p>
                <p className="text-sm text-red-500 mt-2">
                  Please check your tracking ID and try again
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tracking Result */}
        {trackingResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Tracking Result
              </CardTitle>
              <CardDescription>
                Tracking ID: {trackingResult.tracking_id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status */}
              <div className="text-center">
                {(() => {
                  const status = getStatusConfig(trackingResult.status)
                  const StatusIcon = status.icon
                  return (
                    <div className="space-y-3">
                      <Badge className={`${status.color} text-lg px-4 py-2`}>
                        <StatusIcon className="h-5 w-5 mr-2" />
                        {status.label}
                      </Badge>
                      <p className="text-gray-600">{status.description}</p>
                    </div>
                  )
                })()}
              </div>

              {/* Recipient Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Recipient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{trackingResult.recipient_name}</p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Parcel Created</p>
                      <p className="text-sm text-gray-500">{formatDate(trackingResult.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-sm text-gray-500">{formatDate(trackingResult.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-6">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTrackingResult(null)
                      setError(null)
                    }}
                    className="flex-1"
                  >
                    Track Another Parcel
                  </Button>
                  <Button
                    onClick={() => window.history.back()}
                    className="flex-1"
                  >
                    Go Back
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        {!trackingResult && !error && (
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                  Can't find your tracking ID or having trouble tracking your parcel?
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" asChild>
                    <a href="#contact">Contact Support</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/login">Login to Your Account</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Clock, Package, Eye, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { apiClient } from '@/lib/api'
import { PickupRequest } from '@/lib/supabase'
import { toast } from 'sonner'

interface PickupRequestListProps {
  refreshTrigger?: number
}

export function PickupRequestList({ refreshTrigger }: PickupRequestListProps) {
  const { profile } = useAuth()
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPickupRequests()
  }, [refreshTrigger])

  const loadPickupRequests = async () => {
    try {
      setLoading(true)
      const requests = await apiClient.getPickupRequests()
      setPickupRequests(requests || [])
    } catch (error) {
      console.error('Error loading pickup requests:', error)
      toast.error('Failed to load pickup requests')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this pickup request?')) {
      return
    }

    try {
      await apiClient.updatePickupRequest(requestId, { status: 'cancelled' })
      toast.success('Pickup request cancelled')
      loadPickupRequests()
    } catch (error: any) {
      console.error('Error cancelling pickup request:', error)
      toast.error(error.message || 'Failed to cancel pickup request')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading pickup requests...</div>
        </CardContent>
      </Card>
    )
  }

  if (pickupRequests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No pickup requests found</p>
            <p className="text-sm">Create your first pickup request to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {pickupRequests.map((request) => (
        <Card key={request.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Pickup Request
              </CardTitle>
              <Badge className={getStatusColor(request.status)}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Pickup Address</p>
                    <p className="text-sm text-muted-foreground">
                      {request.pickup_address || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Pickup Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(request.pickup_date)}
                    </p>
                  </div>
                </div>

                {request.pickup_time_slot && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Time Slot</p>
                      <p className="text-sm text-muted-foreground">
                        {request.pickup_time_slot}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Request Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Package className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Package Count</p>
                    <p className="text-sm text-muted-foreground">
                      {request.package_count || 1} package(s)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Requested On</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(request.created_at)}
                    </p>
                  </div>
                </div>

                {request.special_instructions && (
                  <div className="flex items-start gap-3">
                    <div className="h-4 w-4 mt-1 text-muted-foreground">📝</div>
                    <div>
                      <p className="text-sm font-medium">Special Instructions</p>
                      <p className="text-sm text-muted-foreground">
                        {request.special_instructions}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Notes */}
            {request.admin_notes && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Admin Notes:</p>
                <p className="text-sm text-muted-foreground">{request.admin_notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t">
              {request.status === 'pending' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteRequest(request.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { apiClient } from '@/lib/api'
import { 
  Package, 
  User, 
  MapPin, 
  Phone, 
  Weight, 
  Ruler, 
  Truck, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Calendar,
  Edit,
  Save,
  X,
  Copy,
  ExternalLink
} from 'lucide-react'

interface Parcel {
  id: string
  tracking_id: string
  recipient_name: string
  recipient_phone: string
  recipient_address?: string
  origin_address?: string
  destination_address?: string
  package_description?: string
  weight?: number
  dimensions?: string
  status: string
  status_notes?: string
  created_at: string
  updated_at: string
}

interface ParcelDetailProps {
  parcel: Parcel
  onClose: () => void
  onUpdate?: () => void
  isAdmin?: boolean
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-800', icon: Truck },
  picked_up: { label: 'Picked Up', color: 'bg-purple-100 text-purple-800', icon: Truck },
  in_transit: { label: 'In Transit', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  returned: { label: 'Returned', color: 'bg-red-100 text-red-800', icon: AlertCircle }
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'returned', label: 'Returned' }
]

export function ParcelDetail({ parcel, onClose, onUpdate, isAdmin = false }: ParcelDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState(parcel.status)
  const [notes, setNotes] = useState(parcel.status_notes || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const statusInfo = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = statusInfo.icon

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyTrackingId = () => {
    navigator.clipboard.writeText(parcel.tracking_id)
    toast({
      title: "Copied!",
      description: "Tracking ID copied to clipboard",
      variant: "default"
    })
  }

  const openTrackingPage = () => {
    window.open(`/tracking/${parcel.tracking_id}`, '_blank')
  }

  const handleStatusUpdate = async () => {
    try {
      setIsUpdating(true)
      
      await apiClient.updateParcelStatus(parcel.id, {
        status,
        notes: notes.trim() || undefined
      })
      
      toast({
        title: "Status Updated!",
        description: `Parcel status has been updated to ${status}`,
        variant: "default"
      })
      
      setIsEditing(false)
      onUpdate?.()
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const canEditStatus = isAdmin || parcel.status === 'pending'

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6" />
            <div>
              <CardTitle>Parcel Details</CardTitle>
              <CardDescription>
                Tracking ID: {parcel.tracking_id}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyTrackingId}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy ID
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={openTrackingPage}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Track
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Current Status</h3>
            
            {canEditStatus && (
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Status
                  </>
                )}
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={`${statusInfo.color} text-sm px-3 py-1`}>
              <StatusIcon className="h-4 w-4 mr-2" />
              {statusInfo.label}
            </Badge>
            
            {parcel.status_notes && (
              <span className="text-sm text-gray-600">
                {parcel.status_notes}
              </span>
            )}
          </div>
          
          {isEditing && (
            <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Notes
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this status change..."
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                  className="flex-1"
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Recipient Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Recipient Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{parcel.recipient_name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{parcel.recipient_phone}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Address</label>
                              <p className="text-gray-900">{parcel.origin_address || parcel.recipient_address}</p>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Package Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {parcel.weight && (
              <div>
                <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Weight className="h-4 w-4" />
                  Weight
                </label>
                <p className="text-gray-900">{parcel.weight} kg</p>
              </div>
            )}
            
            {parcel.dimensions && (
              <div>
                <label className="block text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Dimensions
                </label>
                <p className="text-gray-900">{parcel.dimensions}</p>
              </div>
            )}
            
            {parcel.package_description && (
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900">{parcel.package_description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Timestamps */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timestamps
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">Created</label>
              <p className="text-gray-900">{formatDate(parcel.created_at)}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-gray-900">{formatDate(parcel.updated_at)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
          
          {canEditStatus && !isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Status
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

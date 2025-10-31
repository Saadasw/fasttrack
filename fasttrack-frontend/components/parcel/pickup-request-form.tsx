'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar, MapPin, Clock, Package, Check } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { apiClient } from '@/lib/api'
import { toast } from 'sonner'
import { Parcel } from '@/lib/supabase'

interface PickupRequestFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  preselectedParcels?: string[]
}

export function PickupRequestForm({ isOpen, onClose, onSuccess, preselectedParcels = [] }: PickupRequestFormProps) {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [availableParcels, setAvailableParcels] = useState<Parcel[]>([])
  const [selectedParcels, setSelectedParcels] = useState<string[]>([])
  const [formData, setFormData] = useState({
    pickup_address: '',
    pickup_date: '',
    pickup_time_slot: '',
    package_count: 1,
    special_instructions: ''
  })

  const timeSlots = [
    '09:00 - 12:00',
    '12:00 - 15:00',
    '15:00 - 18:00',
    '18:00 - 21:00'
  ]

  useEffect(() => {
    if (isOpen) {
      // Set default pickup address from profile
      if (profile?.address) {
        setFormData(prev => ({ ...prev, pickup_address: profile.address! }))
      }
      
      // Set preselected parcels if provided
      if (preselectedParcels.length > 0) {
        setSelectedParcels(preselectedParcels)
      }
      
      // Load available parcels for pickup
      loadAvailableParcels()
    }
  }, [isOpen, profile, preselectedParcels])

  const loadAvailableParcels = async () => {
    try {
      const parcels = await apiClient.getAvailableParcelsForPickup()
      setAvailableParcels(parcels)
    } catch (error) {
      console.error('Failed to load available parcels:', error)
      toast.error('Failed to load available parcels')
    }
  }



  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.pickup_address || !formData.pickup_date) {
      toast.error('Please fill in all required fields')
      return
    }

    if (selectedParcels.length === 0) {
      toast.error('Please select at least one parcel for pickup')
      return
    }

    setLoading(true)
    try {
      const requestData = {
        pickup_address: formData.pickup_address,
        pickup_date: formData.pickup_date,
        pickup_time_slot: formData.pickup_time_slot,
        package_count: selectedParcels.length,
        special_instructions: formData.special_instructions
      }

      console.log('🚀 Creating pickup request with data:', requestData)
      console.log('📦 Selected parcels:', selectedParcels)

      // Create pickup request
      const pickupRequest = await apiClient.createPickupRequest(requestData)
      console.log('✅ Pickup request created:', pickupRequest)
      
      // Add selected parcels to the pickup request
      console.log('🔗 Adding parcels to pickup request...')
      const addParcelsResult = await apiClient.addParcelsToPickupRequest(pickupRequest.id, selectedParcels)
      console.log('✅ Parcels added to pickup request:', addParcelsResult)
      
      toast.success(`Pickup request submitted successfully for ${selectedParcels.length} parcel(s)!`)
      onSuccess?.()
      onClose()
      
      // Reset form
      setFormData({
        pickup_address: '',
        pickup_date: '',
        pickup_time_slot: '',
        package_count: 1,
        special_instructions: ''
      })
      setSelectedParcels([])
    } catch (error: any) {
      console.error('❌ Error creating pickup request:', error)
      console.error('Error details:', error.message)
      toast.error(error.message || 'Failed to submit pickup request')
    } finally {
      setLoading(false)
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Request Pickup
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Pickup Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Pickup Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pickup Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Pickup Address *</label>
                <Textarea
                  value={formData.pickup_address}
                  onChange={(e) => handleInputChange('pickup_address', e.target.value)}
                  placeholder="Enter the pickup address"
                  className="min-h-[80px]"
                  required
                />
              </div>

              {/* Pickup Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Pickup Date *</label>
                <Input
                  type="date"
                  value={formData.pickup_date}
                  onChange={(e) => handleInputChange('pickup_date', e.target.value)}
                  min={getMinDate()}
                  required
                />
              </div>

              {/* Time Slot */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Time Slot</label>
                <Select 
                  value={formData.pickup_time_slot} 
                  onValueChange={(value) => handleInputChange('pickup_time_slot', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {slot}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Package Count */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Packages</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.package_count}
                  onChange={(e) => handleInputChange('package_count', parseInt(e.target.value) || 1)}
                />
              </div>

              {/* Special Instructions */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Special Instructions</label>
                <Textarea
                  value={formData.special_instructions}
                  onChange={(e) => handleInputChange('special_instructions', e.target.value)}
                  placeholder="Any special instructions for the courier..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Parcel Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-4 w-4" />
                Select Parcels for Pickup
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableParcels.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No parcels available for pickup</p>
                  <p className="text-sm">Create some parcels first to request pickup</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {availableParcels.map((parcel) => (
                    <div
                      key={parcel.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedParcels.includes(parcel.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        if (selectedParcels.includes(parcel.id)) {
                          setSelectedParcels(prev => prev.filter(id => id !== parcel.id))
                        } else {
                          setSelectedParcels(prev => [...prev, parcel.id])
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {parcel.tracking_id}
                            </span>
                            {selectedParcels.includes(parcel.id) && (
                              <Check className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            <p><strong>To:</strong> {parcel.recipient_name}</p>
                            <p><strong>Address:</strong> {parcel.recipient_address}</p>
                            {parcel.package_description && (
                              <p><strong>Description:</strong> {parcel.package_description}</p>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <input
                            type="checkbox"
                            checked={selectedParcels.includes(parcel.id)}
                            onChange={() => {}}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedParcels.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>{selectedParcels.length}</strong> parcel(s) selected for pickup
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

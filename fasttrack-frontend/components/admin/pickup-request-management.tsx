"use client"

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, MapPin, Calendar, Package, User, Search, Filter } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface PickupRequest {
  id: string
  merchant_id: string
  pickup_address: string
  pickup_date: string
  pickup_time_slot?: string
  package_count?: number
  special_instructions?: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  courier_id?: string
  created_at: string
  updated_at: string
}

interface Courier {
  id: string
  full_name: string
  phone: string
  vehicle_type?: string
  status: 'active' | 'inactive'
}

export function PickupRequestManagement() {
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([])
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [selectedCourierId, setSelectedCourierId] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [pickupData, couriersData] = await Promise.all([
        apiClient.getPendingPickupRequests(),
        apiClient.getCouriers()
      ])
      setPickupRequests(pickupData)
      setCouriers(couriersData.filter(c => c.status === 'active'))
    } catch (error) {
      console.error('Failed to load data:', error)
      toast({
        title: "Error",
        description: "Failed to load pickup requests",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!selectedRequest) return

    try {
      await apiClient.approvePickupRequest(selectedRequest.id, {
        status: 'approved',
        courier_id: selectedCourierId
      })
      toast({
        title: "Success",
        description: "Pickup request approved successfully"
      })
      setIsApproveDialogOpen(false)
      setSelectedRequest(null)
      setSelectedCourierId('')
      loadData()
    } catch (error) {
      console.error('Failed to approve pickup request:', error)
      toast({
        title: "Error",
        description: "Failed to approve pickup request",
        variant: "destructive"
      })
    }
  }

  const handleReject = async () => {
    if (!selectedRequest) return

    try {
      await apiClient.rejectPickupRequest(selectedRequest.id, rejectionReason)
      toast({
        title: "Success",
        description: "Pickup request rejected"
      })
      setIsRejectDialogOpen(false)
      setSelectedRequest(null)
      setRejectionReason('')
      loadData()
    } catch (error) {
      console.error('Failed to reject pickup request:', error)
      toast({
        title: "Error",
        description: "Failed to reject pickup request",
        variant: "destructive"
      })
    }
  }

  const openApproveDialog = (request: PickupRequest) => {
    setSelectedRequest(request)
    setIsApproveDialogOpen(true)
  }

  const openRejectDialog = (request: PickupRequest) => {
    setSelectedRequest(request)
    setIsRejectDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default'
      case 'approved': return 'secondary'
      case 'rejected': return 'destructive'
      case 'completed': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredRequests = pickupRequests.filter(request => {
    const matchesSearch = request.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading pickup requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Pickup Request Management</h2>
        <p className="text-muted-foreground">Review and manage pickup requests from merchants</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Requests</p>
                <p className="text-2xl font-bold">{pickupRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">{pickupRequests.filter(r => r.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold">{pickupRequests.filter(r => r.status === 'approved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold">{pickupRequests.filter(r => r.status === 'rejected').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search pickup requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pickup Requests List */}
      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <Card key={request.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(request.status)}
                    <h3 className="font-medium">Pickup Request #{request.id.slice(0, 8)}</h3>
                    <Badge variant={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(request.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Pickup Address</Label>
                        <p className="text-sm">{request.pickup_address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Pickup Date</Label>
                        <p className="text-sm">{request.pickup_date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Time Slot</Label>
                        <p className="text-sm">{request.pickup_time_slot || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Package Count</Label>
                        <p className="text-sm">{request.package_count || 1}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {request.special_instructions && (
                  <div>
                    <Label className="text-sm font-medium">Special Instructions</Label>
                    <p className="text-sm text-muted-foreground">{request.special_instructions}</p>
                  </div>
                )}
                
                {request.status === 'pending' && (
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => openApproveDialog(request)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openRejectDialog(request)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No pickup requests found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No pickup requests have been submitted yet'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Pickup Request</DialogTitle>
            <DialogDescription>
              Assign a courier to this pickup request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedRequest && (
              <div className="space-y-2">
                <Label>Pickup Details</Label>
                <div className="p-3 bg-muted rounded-lg space-y-1">
                  <p className="text-sm"><strong>Address:</strong> {selectedRequest.pickup_address}</p>
                  <p className="text-sm"><strong>Date:</strong> {selectedRequest.pickup_date}</p>
                  <p className="text-sm"><strong>Time:</strong> {selectedRequest.pickup_time_slot || 'Not specified'}</p>
                  <p className="text-sm"><strong>Packages:</strong> {selectedRequest.package_count || 1}</p>
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="courier">Select Courier</Label>
              <Select value={selectedCourierId} onValueChange={setSelectedCourierId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a courier" />
                </SelectTrigger>
                <SelectContent>
                  {couriers.map((courier) => (
                    <SelectItem key={courier.id} value={courier.id}>
                      {courier.full_name} - {courier.vehicle_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleApprove} className="w-full" disabled={!selectedCourierId}>
              Approve Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Pickup Request</DialogTitle>
            <DialogDescription>
              Provide a reason for rejection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={3}
              />
            </div>
            <Button
              onClick={handleReject}
              variant="destructive"
              className="w-full"
              disabled={!rejectionReason.trim()}
            >
              Reject Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

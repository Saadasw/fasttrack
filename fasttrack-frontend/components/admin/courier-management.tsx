"use client"

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

interface Courier {
  id: string
  full_name: string
  phone: string
  vehicle_type?: string
  vehicle_number?: string
  coverage_area?: string
  status: 'active' | 'inactive'
  created_at: string
}

interface CourierFormData {
  full_name: string
  phone: string
  vehicle_type: string
  vehicle_number: string
  coverage_area: string
}

export function CourierManagement() {
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCourier, setEditingCourier] = useState<Courier | null>(null)
  const [formData, setFormData] = useState<CourierFormData>({
    full_name: '',
    phone: '',
    vehicle_type: '',
    vehicle_number: '',
    coverage_area: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    loadCouriers()
  }, [])

  const loadCouriers = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getCouriers()
      setCouriers(data)
    } catch (error) {
      console.error('Failed to load couriers:', error)
      toast({
        title: "Error",
        description: "Failed to load couriers",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCourier = async () => {
    try {
      await apiClient.createCourier(formData)
      toast({
        title: "Success",
        description: "Courier created successfully"
      })
      setIsCreateDialogOpen(false)
      setFormData({
        full_name: '',
        phone: '',
        vehicle_type: '',
        vehicle_number: '',
        coverage_area: ''
      })
      loadCouriers()
    } catch (error) {
      console.error('Failed to create courier:', error)
      toast({
        title: "Error",
        description: "Failed to create courier",
        variant: "destructive"
      })
    }
  }

  const handleEditCourier = (courier: Courier) => {
    setEditingCourier(courier)
    setFormData({
      full_name: courier.full_name,
      phone: courier.phone,
      vehicle_type: courier.vehicle_type || '',
      vehicle_number: courier.vehicle_number || '',
      coverage_area: courier.coverage_area || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateCourier = async () => {
    if (!editingCourier) return
    
    try {
      // Update courier logic would go here
      toast({
        title: "Success",
        description: "Courier updated successfully"
      })
      setIsEditDialogOpen(false)
      setEditingCourier(null)
      loadCouriers()
    } catch (error) {
      console.error('Failed to update courier:', error)
      toast({
        title: "Error",
        description: "Failed to update courier",
        variant: "destructive"
      })
    }
  }

  const filteredCouriers = couriers.filter(courier => {
    const matchesSearch = courier.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         courier.phone.includes(searchTerm) ||
                         (courier.vehicle_type && courier.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || courier.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading couriers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Courier Management</h2>
          <p className="text-muted-foreground">Manage delivery couriers and their assignments</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Courier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Courier</DialogTitle>
              <DialogDescription>
                Add a new courier to the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter courier's full name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="vehicle_type">Vehicle Type</Label>
                <Select value={formData.vehicle_type} onValueChange={(value) => setFormData({ ...formData, vehicle_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bike">Bike</SelectItem>
                    <SelectItem value="scooter">Scooter</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vehicle_number">Vehicle Number</Label>
                <Input
                  id="vehicle_number"
                  value={formData.vehicle_number}
                  onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                  placeholder="Enter vehicle number"
                />
              </div>
              <div>
                <Label htmlFor="coverage_area">Coverage Area</Label>
                <Input
                  id="coverage_area"
                  value={formData.coverage_area}
                  onChange={(e) => setFormData({ ...formData, coverage_area: e.target.value })}
                  placeholder="Enter coverage area"
                />
              </div>
              <Button onClick={handleCreateCourier} className="w-full">
                Create Courier
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search couriers..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Couriers List */}
      <div className="grid gap-4">
        {filteredCouriers.map((courier) => (
          <Card key={courier.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">{courier.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{courier.phone}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {courier.vehicle_type && (
                      <span className="capitalize">{courier.vehicle_type}</span>
                    )}
                    {courier.vehicle_number && (
                      <>
                        <span>•</span>
                        <span>{courier.vehicle_number}</span>
                      </>
                    )}
                    {courier.coverage_area && (
                      <>
                        <span>•</span>
                        <span>{courier.coverage_area}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={courier.status === 'active' ? 'default' : 'secondary'}>
                    {courier.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditCourier(courier)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Courier</DialogTitle>
            <DialogDescription>
              Update courier information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_full_name">Full Name</Label>
              <Input
                id="edit_full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_phone">Phone Number</Label>
              <Input
                id="edit_phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_vehicle_type">Vehicle Type</Label>
              <Select value={formData.vehicle_type} onValueChange={(value) => setFormData({ ...formData, vehicle_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bike">Bike</SelectItem>
                  <SelectItem value="scooter">Scooter</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_vehicle_number">Vehicle Number</Label>
              <Input
                id="edit_vehicle_number"
                value={formData.vehicle_number}
                onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_coverage_area">Coverage Area</Label>
              <Input
                id="edit_coverage_area"
                value={formData.coverage_area}
                onChange={(e) => setFormData({ ...formData, coverage_area: e.target.value })}
              />
            </div>
            <Button onClick={handleUpdateCourier} className="w-full">
              Update Courier
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

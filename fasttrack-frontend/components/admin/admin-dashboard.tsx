"use client"

import { useState, useEffect } from 'react'
import { 
  Package, 
  Users, 
  Truck, 
  TrendingUp, 
  Search, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  RefreshCw,
  Filter,
  Download,
  LogOut
} from 'lucide-react'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { PickupRequestManagement } from './pickup-request-management'
import { UserManagement } from './user-management'
import { CourierManagement } from './courier-management'

interface DashboardStats {
  total_merchants: number
  total_admins: number
  total_parcels: number
  pending_parcels: number
  in_transit_parcels: number
  delivered_parcels: number
  total_pickup_requests: number
  pending_pickup_requests: number
  approved_pickup_requests: number
  rejected_pickup_requests: number
  active_couriers: number
}

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

interface User {
  id: string
  email: string
  full_name: string
  business_name?: string
  role: 'admin' | 'merchant'
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
}

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

export function AdminDashboard() {
  const { signOut, user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')

  const handleLogout = async () => {
    try {
      await signOut()
      // Redirect to login page
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Load dashboard data
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [statsData, pickupData, usersData, couriersData] = await Promise.all([
        apiClient.getAdminDashboard(),
        apiClient.getPendingPickupRequests(),
        apiClient.getAllUsers(),
        apiClient.getCouriers()
      ])
      
      setStats(statsData)
      setPickupRequests(pickupData)
      setUsers(usersData)
      setCouriers(couriersData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprovePickup = async (requestId: string, courierId?: string) => {
    try {
      await apiClient.approvePickupRequest(requestId, {
        status: 'approved',
        courier_id: courierId
      })
      await loadDashboardData()
    } catch (error) {
      console.error('Failed to approve pickup request:', error)
    }
  }

  const handleRejectPickup = async (requestId: string, adminNotes: string) => {
    try {
      await apiClient.rejectPickupRequest(requestId, adminNotes)
      await loadDashboardData()
    } catch (error) {
      console.error('Failed to reject pickup request:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your courier service operations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={loadDashboardData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pickup-requests">Pickup Requests</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="couriers">Couriers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Parcels</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_parcels || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.pending_parcels || 0} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(stats?.total_merchants || 0) + (stats?.total_admins || 0)}
          </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.total_merchants || 0} merchants
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats?.pending_pickup_requests || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Couriers</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.active_couriers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Available for assignments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pickup Requests</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_pickup_requests || 0}</div>
                <p className="text-xs text-muted-foreground">
                  All pickup requests
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats?.approved_pickup_requests || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully approved
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected Requests</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats?.rejected_pickup_requests || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Requests rejected
                </p>
              </CardContent>
            </Card>
        </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pickupRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium">New pickup request</p>
                        <p className="text-xs text-muted-foreground">
                          {request.pickup_address} - {new Date(request.created_at).toLocaleDateString()}
                        </p>
            </div>
          </div>
                    <Badge variant="outline">{request.status}</Badge>
        </div>
                ))}
      </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pickup Requests Tab */}
        <TabsContent value="pickup-requests" className="space-y-6">
          <PickupRequestManagement />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        {/* Couriers Tab */}
        <TabsContent value="couriers" className="space-y-6">
          <CourierManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { MerchantDashboard } from "@/components/merchant/merchant-dashboard"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <RoleBasedDashboard />
    </ProtectedRoute>
  )
}

function RoleBasedDashboard() {
  const { profile } = useAuth()
  
  // Show admin dashboard for admin users, merchant dashboard for merchants
  if (profile?.role === 'admin') {
    return <AdminDashboard />
  }
  
  return <MerchantDashboard />
}



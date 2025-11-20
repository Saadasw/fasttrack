"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Truck,
  Plus,
  Eye,
  Edit,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Parcel, PickupRequest } from "@/lib/supabase";
import { ParcelCreateForm } from "@/components/parcel/parcel-create-form";
import { PickupRequestForm } from "@/components/parcel/pickup-request-form";
import { PickupRequestList } from "@/components/parcel/pickup-request-list";

export function MerchantDashboard() {
  const { profile, signOut } = useAuth();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddParcel, setShowAddParcel] = useState(false);
  const [showPickupRequest, setShowPickupRequest] = useState(false);
  const [pickupRefreshTrigger, setPickupRefreshTrigger] = useState(0);
  const [stats, setStats] = useState([
    {
      title: "Total Parcels",
      value: "0",
      icon: Package,
      color: "text-blue-600",
    },
    { title: "In Transit", value: "0", icon: Truck, color: "text-orange-600" },
    { title: "Delivered", value: "0", icon: Package, color: "text-green-600" },
    {
      title: "Pending Pickup",
      value: "0",
      icon: Calendar,
      color: "text-purple-600",
    },
  ]);

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get auth token
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No auth token found");
          setLoading(false);
          return;
        }

        // Fetch parcels from backend
        console.log("🔍 Fetching parcels from backend...");
        const parcelsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/parcels`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("📦 Parcels response status:", parcelsResponse.status);

        if (parcelsResponse.ok) {
          const parcelsData = await parcelsResponse.json();
          console.log("✅ Parcels data received:", parcelsData);
          setParcels(parcelsData);

          // Update stats based on real data
          const totalParcels = parcelsData.length;
          const inTransit = parcelsData.filter(
            (p: any) => p.status === "in_transit"
          ).length;
          const delivered = parcelsData.filter(
            (p: any) => p.status === "delivered"
          ).length;
          const pending = parcelsData.filter(
            (p: any) => p.status === "pending"
          ).length;

          console.log("📊 Stats calculated:", {
            totalParcels,
            inTransit,
            delivered,
            pending,
          });

          setStats([
            {
              title: "Total Parcels",
              value: totalParcels.toString(),
              icon: Package,
              color: "text-blue-600",
            },
            {
              title: "In Transit",
              value: inTransit.toString(),
              icon: Truck,
              color: "text-orange-600",
            },
            {
              title: "Delivered",
              value: delivered.toString(),
              icon: Package,
              color: "text-green-600",
            },
            {
              title: "Pending Pickup",
              value: pending.toString(),
              icon: Calendar,
              color: "text-purple-600",
            },
          ]);
        } else {
          console.error("❌ Failed to fetch parcels:", parcelsResponse.status);
          const errorText = await parcelsResponse.text();
          console.error("❌ Error details:", errorText);

          // Fallback to empty data if API fails
          setParcels([]);
          setStats([
            {
              title: "Total Parcels",
              value: "0",
              icon: Package,
              color: "text-blue-600",
            },
            {
              title: "In Transit",
              value: "0",
              icon: Truck,
              color: "text-orange-600",
            },
            {
              title: "Delivered",
              value: "0",
              icon: Package,
              color: "text-green-600",
            },
            {
              title: "Pending Pickup",
              value: "0",
              icon: Calendar,
              color: "text-purple-600",
            },
          ]);
        }

        // Fetch pickup requests from backend (if endpoint exists)
        try {
          const pickupResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pickup-requests`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (pickupResponse.ok) {
            const pickupData = await pickupResponse.json();
            setPickupRequests(pickupData);
          }
        } catch (error) {
          console.log(
            "Pickup requests endpoint not available yet, using empty array"
          );
          setPickupRequests([]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "in_transit":
        return "bg-blue-100 text-blue-800";
      case "picked_up":
        return "bg-orange-100 text-orange-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const refreshDashboard = () => {
    setLoading(true);
    // Re-fetch data
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const parcelsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/parcels`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (parcelsResponse.ok) {
          const parcelsData = await parcelsResponse.json();
          setParcels(parcelsData);

          const totalParcels = parcelsData.length;
          const inTransit = parcelsData.filter(
            (p: any) => p.status === "in_transit"
          ).length;
          const delivered = parcelsData.filter(
            (p: any) => p.status === "delivered"
          ).length;
          const pending = parcelsData.filter(
            (p: any) => p.status === "pending"
          ).length;

          setStats([
            {
              title: "Total Parcels",
              value: totalParcels.toString(),
              icon: Package,
              color: "text-blue-600",
            },
            {
              title: "In Transit",
              value: inTransit.toString(),
              icon: Truck,
              color: "text-orange-600",
            },
            {
              title: "Delivered",
              value: delivered.toString(),
              icon: Package,
              color: "text-green-600",
            },
            {
              title: "Pending Pickup",
              value: pending.toString(),
              icon: Calendar,
              color: "text-purple-600",
            },
          ]);
        }
      } catch (error) {
        console.error("Error refreshing dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Merchant Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.business_name || profile?.full_name}
              </p>
              <p className="text-xs text-muted-foreground">
                Merchant ID: {profile?.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={refreshDashboard} variant="outline" size="sm">
              <Package className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats && stats.length > 0
            ? stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))
            : // Show loading placeholders
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Loading...
                    </CardTitle>
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold bg-gray-200 h-8 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="parcels">My Parcels</TabsTrigger>
            <TabsTrigger value="pickups">Pickup Requests</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Parcels */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Parcels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {parcels && parcels.length > 0 ? (
                      parcels.slice(0, 3).map((parcel) => (
                        <div
                          key={parcel.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              {parcel.tracking_id || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {parcel.recipient_name || "N/A"}
                            </p>
                          </div>
                          <Badge
                            className={getStatusColor(
                              parcel.status || "pending"
                            )}
                          >
                            {(parcel.status || "pending").replace("_", " ")}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground mb-2">
                          No parcels found
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Create your first parcel to get started
                        </p>
                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() => setShowAddParcel(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Parcel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => setShowAddParcel(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Parcel
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setShowPickupRequest(true)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Request Pickup
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    Track Parcel
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => (window.location.href = '/chat')}>
                    💬
                    <span className="ml-2">Open Chatbot</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Parcels Tab */}
          <TabsContent value="parcels" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">My Parcels</h3>
              <Button onClick={() => setShowAddParcel(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Parcel
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Tracking ID</th>
                        <th className="text-left p-4">Recipient</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Created</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parcels && parcels.length > 0 ? (
                        parcels.map((parcel) => (
                          <tr key={parcel.id} className="border-b">
                            <td className="p-4 font-mono font-medium">
                              {parcel.tracking_id || "N/A"}
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium">
                                  {parcel.recipient_name || "N/A"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {parcel.recipient_phone || "N/A"}
                                </p>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge
                                className={getStatusColor(
                                  parcel.status || "pending"
                                )}
                              >
                                {(parcel.status || "pending").replace("_", " ")}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {parcel.created_at
                                ? new Date(
                                    parcel.created_at
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-8 text-center text-muted-foreground"
                          >
                            <div className="space-y-2">
                              <p>No parcels found</p>
                              <p className="text-sm">
                                Create your first parcel to get started
                              </p>
                              <Button
                                size="sm"
                                onClick={() => setShowAddParcel(true)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Parcel
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pickup Requests Tab */}
          <TabsContent value="pickups" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Pickup Requests</h3>
              <Button onClick={() => setShowPickupRequest(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>

            <PickupRequestList refreshTrigger={pickupRefreshTrigger} />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Business Name
                    </label>
                    <div className="flex items-center gap-2 p-3 border rounded-md">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.business_name || "Not set"}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </label>
                    <div className="flex items-center gap-2 p-3 border rounded-md">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.full_name}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <div className="flex items-center gap-2 p-3 border rounded-md">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Phone
                    </label>
                    <div className="flex items-center gap-2 p-3 border rounded-md">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.phone || "Not set"}</span>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Address
                    </label>
                    <div className="flex items-center gap-2 p-3 border rounded-md">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.address || "Not set"}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Parcel Modal */}
      {showAddParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Create New Parcel</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddParcel(false)}
              >
                ✕
              </Button>
            </div>
            <ParcelCreateForm
              onSuccess={(parcel) => {
                setParcels((prev) => [...prev, parcel]);
                setShowAddParcel(false);
                // Refresh dashboard data to update stats
                refreshDashboard();
              }}
              onCancel={() => setShowAddParcel(false)}
            />
          </div>
        </div>
      )}

      {/* Pickup Request Form Dialog */}
      {showPickupRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <PickupRequestForm
              isOpen={showPickupRequest}
              onClose={() => setShowPickupRequest(false)}
              onSuccess={() => {
                setPickupRefreshTrigger((prev) => prev + 1);
                setShowPickupRequest(false);
                // Refresh dashboard data to update stats
                refreshDashboard();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

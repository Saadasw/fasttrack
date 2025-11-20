"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Parcel } from "@/lib/supabase"; // Import the global Parcel type
// Direct API calls for now'
import {
  Package,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  User,
  Phone,
  ShoppingCart,
} from "lucide-react";
import { PickupRequestForm } from "./pickup-request-form";

interface Parcel {
  id: string;
  tracking_id: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address?: string; // Legacy field
  origin_address?: string; // New field from backend
  destination_address?: string; // New field from backend
  package_description?: string;
  weight?: number;
  dimensions?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ParcelListProps {
  onViewParcel?: (parcel: Parcel) => void;
  onEditParcel?: (parcel: Parcel) => void;
  onCreateParcel?: () => void;
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  assigned: {
    label: "Assigned",
    color: "bg-blue-100 text-blue-800",
    icon: Truck,
  },
  picked_up: {
    label: "Picked Up",
    color: "bg-purple-100 text-purple-800",
    icon: Truck,
  },
  in_transit: {
    label: "In Transit",
    color: "bg-indigo-100 text-indigo-800",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  returned: {
    label: "Returned",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
};

export function ParcelList({
  onViewParcel,
  onEditParcel,
  onCreateParcel,
}: ParcelListProps) {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [filteredParcels, setFilteredParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showPickupForm, setShowPickupForm] = useState(false);
  const [selectedParcelForPickup, setSelectedParcelForPickup] =
    useState<Parcel | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadParcels();
  }, []);

  useEffect(() => {
    filterParcels();
  }, [parcels, searchTerm, statusFilter]);

  const loadParcels = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated. Please login again.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parcels`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to load parcels");
      }

      const data = await response.json();
      setParcels(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load parcels",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterParcels = () => {
    let filtered = parcels;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((parcel) => parcel.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (parcel) =>
          parcel.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          parcel.recipient_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          parcel.recipient_address
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (parcel.package_description &&
            parcel.package_description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredParcels(filtered);
  };

  const handleDeleteParcel = async (parcelId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this parcel? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated. Please login again.");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parcels/${parcelId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete parcel");
      }

      toast({
        title: "Success",
        description: "Parcel deleted successfully",
        variant: "default",
      });
      loadParcels(); // Reload the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete parcel",
        variant: "destructive",
      });
    }
  };

  const handleCreatePickupRequest = (parcel: Parcel) => {
    setSelectedParcelForPickup(parcel);
    setShowPickupForm(true);
  };

  const handlePickupRequestSuccess = () => {
    setShowPickupForm(false);
    setSelectedParcelForPickup(null);
    loadParcels(); // Reload the list
  };

  const handleClosePickupForm = () => {
    setShowPickupForm(false);
    setSelectedParcelForPickup(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading parcels...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Parcels ({filteredParcels.length})
              </CardTitle>
              <CardDescription>
                Manage and track all your parcels
              </CardDescription>
            </div>

            {onCreateParcel && (
              <Button
                onClick={onCreateParcel}
                className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Create Parcel
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by tracking ID, recipient, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Parcels List */}
          {filteredParcels.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No parcels found
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first parcel to get started"}
              </p>
              {!searchTerm && statusFilter === "all" && onCreateParcel && (
                <Button
                  onClick={onCreateParcel}
                  className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Parcel
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredParcels.map((parcel) => {
                const status = getStatusConfig(parcel.status);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={parcel.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={status.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                          <span className="font-mono text-sm text-gray-600">
                            {parcel.tracking_id}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium text-gray-900 mb-1">
                              <User className="h-4 w-4 inline mr-2" />
                              {parcel.recipient_name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                              <Phone className="h-4 w-4 inline mr-2" />
                              {parcel.recipient_phone}
                            </p>
                            <p className="text-sm text-gray-600">
                              <MapPin className="h-4 w-4 inline mr-2" />
                              {parcel.recipient_address}
                            </p>
                          </div>

                          <div>
                            {parcel.package_description && (
                              <p className="text-sm text-gray-600 mb-1">
                                <Package className="h-4 w-4 inline mr-2" />
                                {parcel.package_description}
                              </p>
                            )}
                            {parcel.weight && (
                              <p className="text-sm text-gray-600 mb-1">
                                Weight: {parcel.weight} kg
                              </p>
                            )}
                            {parcel.dimensions && (
                              <p className="text-sm text-gray-600">
                                Dimensions: {parcel.dimensions}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-500">
                          Created: {formatDate(parcel.created_at)}
                          {parcel.updated_at !== parcel.created_at && (
                            <span className="ml-4">
                              Updated: {formatDate(parcel.updated_at)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {onViewParcel && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewParcel(parcel)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}

                        {parcel.status === "pending" && onEditParcel && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditParcel(parcel)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}

                        {parcel.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreatePickupRequest(parcel)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        )}

                        {parcel.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteParcel(parcel.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Pickup Request Form Modal */}
      {showPickupForm && selectedParcelForPickup && (
        <PickupRequestForm
          isOpen={showPickupForm}
          onClose={handleClosePickupForm}
          onSuccess={handlePickupRequestSuccess}
          preselectedParcels={[selectedParcelForPickup.id]}
        />
      )}
    </>
  );
}

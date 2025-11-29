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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Search,
  Filter,
  Eye,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  User,
  Phone,
  Plus,
} from "lucide-react";
import { TrackingUpdateForm } from "./tracking-update-form";
import { TrackingTimeline } from "./tracking-timeline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Parcel {
  id: string;
  tracking_id: string;
  recipient_name: string;
  recipient_phone: string;
  origin_address?: string;
  destination_address?: string;
  package_description?: string;
  weight?: number;
  dimensions?: string;
  status: string;
  created_at: string;
  updated_at: string;
  sender_id: string;
}

const statusConfig: Record<string, any> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  assigned: {
    label: "Assigned",
    color: "bg-blue-100 text-blue-800",
    icon: User,
  },
  picked_up: {
    label: "Picked Up",
    color: "bg-purple-100 text-purple-800",
    icon: Package,
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

export function ParcelManagement() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [filteredParcels, setFilteredParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
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
        throw new Error("Not authenticated");
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/parcels`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load parcels");
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

    if (statusFilter !== "all") {
      filtered = filtered.filter((parcel) => parcel.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (parcel) =>
          parcel.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          parcel.recipient_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredParcels(filtered);
  };

  const handleAddUpdate = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setShowUpdateForm(true);
  };

  const handleViewTimeline = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setShowTimeline(true);
  };

  const handleUpdateSuccess = () => {
    loadParcels();
    setShowUpdateForm(false);
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
    return statusConfig[status] || statusConfig.pending;
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
                Parcel Management ({filteredParcels.length})
              </CardTitle>
              <CardDescription>
                View and manage all parcels, add tracking updates
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by tracking ID or recipient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
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
                  : "No parcels in the system yet"}
              </p>
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
                            {parcel.destination_address && (
                              <p className="text-sm text-gray-600">
                                <MapPin className="h-4 w-4 inline mr-2" />
                                {parcel.destination_address}
                              </p>
                            )}
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

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewTimeline(parcel)}
                          className="whitespace-nowrap"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Timeline
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAddUpdate(parcel)}
                          className="bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Update
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tracking Update Form Dialog */}
      {selectedParcel && (
        <TrackingUpdateForm
          parcelId={selectedParcel.id}
          trackingId={selectedParcel.tracking_id}
          currentStatus={selectedParcel.status}
          isOpen={showUpdateForm}
          onClose={() => setShowUpdateForm(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {/* Timeline Dialog */}
      {selectedParcel && (
        <Dialog open={showTimeline} onOpenChange={setShowTimeline}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Tracking Timeline - {selectedParcel.tracking_id}
              </DialogTitle>
            </DialogHeader>
            <TrackingTimeline
              trackingId={selectedParcel.tracking_id}
              parcelId={selectedParcel.id}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

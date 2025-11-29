"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  FileText,
  User,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface TrackingUpdate {
  id: string;
  parcel_id: string;
  status: string;
  location?: string;
  timestamp: string;
  notes?: string;
  updated_by?: string;
}

interface TrackingTimelineProps {
  trackingId: string;
  parcelId?: string;
}

const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Clock,
  },
  assigned: {
    label: "Assigned",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: User,
  },
  picked_up: {
    label: "Picked Up",
    color: "bg-purple-100 text-purple-800 border-purple-300",
    icon: Package,
  },
  in_transit: {
    label: "In Transit",
    color: "bg-indigo-100 text-indigo-800 border-indigo-300",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-300",
    icon: CheckCircle,
  },
  returned: {
    label: "Returned",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: AlertCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-800 border-gray-300",
    icon: AlertCircle,
  },
};

export function TrackingTimeline({
  trackingId,
  parcelId,
}: TrackingTimelineProps) {
  const [updates, setUpdates] = useState<TrackingUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrackingUpdates();
  }, [trackingId, parcelId]);

  const loadTrackingUpdates = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const endpoint = parcelId
        ? `${apiUrl}/parcels/${parcelId}/tracking-updates`
        : `${apiUrl}/parcels/tracking/${trackingId}/updates`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error("Failed to load tracking updates");
      }

      const data = await response.json();
      setUpdates(data);
    } catch (err: any) {
      setError(err.message || "Failed to load tracking updates");
    } finally {
      setIsLoading(false);
    }
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
      statusConfig[status] || {
        label: status,
        color: "bg-gray-100 text-gray-800 border-gray-300",
        icon: Clock,
      }
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading tracking updates...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-red-600">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (updates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tracking Timeline</CardTitle>
          <CardDescription>No tracking updates yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4" />
            <p>No tracking updates have been added for this parcel.</p>
            <p className="text-sm mt-2">
              Add the first update to start tracking this parcel's journey.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Tracking Timeline
        </CardTitle>
        <CardDescription>
          Complete tracking history for this parcel ({updates.length} updates)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Timeline items */}
          <div className="space-y-6">
            {updates.map((update, index) => {
              const config = getStatusConfig(update.status);
              const StatusIcon = config.icon;
              const isLatest = index === updates.length - 1;

              return (
                <div key={update.id} className="relative pl-12">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      isLatest
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : "bg-white border-2 border-gray-300 text-gray-600"
                    }`}
                  >
                    <StatusIcon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <div
                    className={`border rounded-lg p-4 ${
                      isLatest ? "border-blue-300 bg-blue-50" : "bg-white"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Badge className={config.color}>{config.label}</Badge>
                        {isLatest && (
                          <Badge className="ml-2 bg-blue-600 text-white">
                            Latest
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(update.timestamp)}
                      </div>
                    </div>

                    {/* Location */}
                    {update.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{update.location}</span>
                      </div>
                    )}

                    {/* Notes */}
                    {update.notes && (
                      <div className="flex items-start gap-2 text-sm text-gray-600 bg-white rounded p-2 border">
                        <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>{update.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

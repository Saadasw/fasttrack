"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { MapPin, FileText, Truck } from "lucide-react";

const trackingUpdateSchema = z.object({
  status: z.enum([
    "pending",
    "assigned",
    "picked_up",
    "in_transit",
    "delivered",
    "returned",
    "cancelled",
  ]),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type TrackingUpdateFormData = z.infer<typeof trackingUpdateSchema>;

interface TrackingUpdateFormProps {
  parcelId: string;
  trackingId: string;
  currentStatus: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "text-yellow-600" },
  { value: "assigned", label: "Assigned to Courier", color: "text-blue-600" },
  { value: "picked_up", label: "Picked Up", color: "text-purple-600" },
  { value: "in_transit", label: "In Transit", color: "text-indigo-600" },
  { value: "delivered", label: "Delivered", color: "text-green-600" },
  { value: "returned", label: "Returned", color: "text-red-600" },
  { value: "cancelled", label: "Cancelled", color: "text-gray-600" },
];

export function TrackingUpdateForm({
  parcelId,
  trackingId,
  currentStatus,
  isOpen,
  onClose,
  onSuccess,
}: TrackingUpdateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TrackingUpdateFormData>({
    resolver: zodResolver(trackingUpdateSchema),
    defaultValues: {
      status: currentStatus as any,
    },
  });

  const selectedStatus = watch("status");

  const onSubmit = async (data: TrackingUpdateFormData) => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated. Please login again.");
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(
        `${apiUrl}/parcels/${parcelId}/tracking-updates`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add tracking update");
      }

      const result = await response.json();

      toast({
        title: "✅ Tracking Update Added!",
        description: `Status updated to ${
          statusOptions.find((s) => s.value === data.status)?.label
        }. Email notification sent to merchant.`,
        variant: "default",
      });

      reset();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add tracking update",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Add Tracking Update
          </DialogTitle>
          <DialogDescription>
            Add a new tracking update for parcel {trackingId}. This will update
            the parcel status and send an email notification to the merchant.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Status Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Current Status:</strong>{" "}
              {statusOptions.find((s) => s.value === currentStatus)?.label ||
                currentStatus}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Select a new status below to update the parcel tracking
            </p>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status">
              New Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setValue("status", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className={option.color}>{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location (Optional)
            </Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="e.g., Central Hub, Highway 101, Customer Address"
              className={errors.location ? "border-red-500" : ""}
            />
            <p className="text-xs text-gray-500">
              Where is the parcel currently? (e.g., warehouse, in transit,
              delivered location)
            </p>
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="e.g., Assigned to Courier John, Signed by Jane Doe, Delayed due to weather"
              rows={3}
              className={errors.notes ? "border-red-500" : ""}
            />
            <p className="text-xs text-gray-500">
              Add any additional information about this update
            </p>
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>

          {/* Status Examples */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              💡 Examples:
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>
                <strong>Assigned:</strong> Location: "Central Hub", Notes:
                "Assigned to Courier John"
              </li>
              <li>
                <strong>Picked Up:</strong> Location: "Warehouse A", Notes:
                "Package collected"
              </li>
              <li>
                <strong>In Transit:</strong> Location: "Highway 101", Notes:
                "On the way to destination"
              </li>
              <li>
                <strong>Delivered:</strong> Location: "Customer Address",
                Notes: "Signed by: Jane Doe"
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? "Adding Update..." : "Add Tracking Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

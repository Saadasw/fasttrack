"use client";

import { useState } from "react";
import { ParcelCreateForm } from "@/components/parcel/parcel-create-form";
import { ParcelList } from "@/components/parcel/parcel-list";
import { ParcelDetail } from "@/components/parcel/parcel-detail";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface Parcel {
  id: string;
  tracking_id: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  package_description?: string;
  weight?: number;
  dimensions?: string;
  status: string;
  status_notes?: string;
  created_at: string;
  updated_at: string;
}

export default function ParcelsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateSuccess = (parcel: Parcel) => {
    setShowCreateForm(false);
    setRefreshKey((prev) => prev + 1); // Trigger refresh of parcel list
  };

  const handleViewParcel = (parcel: Parcel) => {
    setSelectedParcel(parcel);
  };

  const handleEditParcel = (parcel: Parcel) => {
    setSelectedParcel(parcel);
  };

  const handleCloseDetail = () => {
    setSelectedParcel(null);
  };

  const handleParcelUpdate = () => {
    setRefreshKey((prev) => prev + 1); // Trigger refresh of parcel list
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Parcel Management
        </h1>
        <p className="text-gray-600">
          Create, manage, and track all your parcels in one place
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Create Parcel Button */}
        {!showCreateForm && (
          <div className="flex justify-end">
            <Button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Parcel
            </Button>
          </div>
        )}

        {/* Create Parcel Form */}
        {showCreateForm && (
          <div className="relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Parcel</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ParcelCreateForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {/* Parcel List */}
        <ParcelList
          key={refreshKey}
          onViewParcel={handleViewParcel}
          onEditParcel={handleEditParcel}
          onCreateParcel={() => setShowCreateForm(true)}
        />
      </div>

      {/* Parcel Detail Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <ParcelDetail
              parcel={selectedParcel}
              onClose={handleCloseDetail}
              onUpdate={handleParcelUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
}

import { Parcel } from "./supabase";

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8000"
  ) {
    this.baseUrl = baseUrl;
    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    console.log("🌐 API Request:", {
      url,
      method: options.method || "GET",
      headers,
      body: options.body,
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        // Add timeout and error handling
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      console.log("🌐 API Response:", {
        status: response.status,
        statusText: response.statusText,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("🌐 API Error:", errorData);
        throw new Error(
          errorData.detail || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("🌐 API Success:", result);
      return result;
    } catch (error) {
      console.error(`🌐 API Request failed for ${url}:`, error);
      if (error instanceof Error) {
        if (error.name === "TimeoutError") {
          throw new Error(
            "Request timeout - please check your network connection"
          );
        }
        if (error.message.includes("Failed to fetch")) {
          throw new Error(
            "Connection failed - please check if the API server is running and accessible"
          );
        }
      }
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request<{
      access_token: string;
      token_type: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    this.token = response.access_token;
    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      localStorage.setItem("token", response.access_token);
    }
    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    full_name: string;
    role: string;
    business_name?: string;
  }) {
    const response = await this.request<{ message: string; user_id: string }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(userData),
      }
    );
    return response;
  }

  async getCurrentUser() {
    return this.request<{ user: any; profile: any }>("/auth/me");
  }

  // Parcel Management
  async createParcel(parcelData: any) {
    return this.request<any>("/parcels", {
      method: "POST",
      body: JSON.stringify(parcelData),
    });
  }

  async getParcels() {
    return this.request<any[]>("/parcels");
  }

  async getParcel(id: string) {
    return this.request<any>(`/parcels/${id}`);
  }

  async updateParcel(id: string, data: any): Promise<any> {
    const response = await this.request(`/parcels/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  }

  async deleteParcel(id: string): Promise<any> {
    const response = await this.request(`/parcels/${id}`, {
      method: "DELETE",
    });
    return response;
  }

  async updateParcelStatus(id: string, data: any): Promise<any> {
    const response = await this.request(`/parcels/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  }

  async searchParcels(filters: any): Promise<any[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value as string);
    });

    const response = await this.request<any[]>(
      `/parcels/search?${params.toString()}`
    );
    return response;
  }

  async getParcelsByStatus(status: string): Promise<any[]> {
    const response = await this.request<any[]>(`/parcels/status/${status}`);
    return response;
  }

  async trackParcel(trackingId: string): Promise<any> {
    const response = await this.request(`/parcels/tracking/${trackingId}`);
    return response;
  }

  // Pickup Requests
  async createPickupRequest(requestData: any) {
    return this.request<any>("/pickup-requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  }

  async getPickupRequests() {
    return this.request<any[]>("/pickup-requests");
  }

  async updatePickupRequest(id: string, updates: any) {
    return this.request<any>(`/pickup-requests/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  // Admin Statistics
  async getAdminStats() {
    return this.request<any>("/admin/stats");
  }
  // Admin Management
  async getAdminDashboard() {
    return this.request<any>("/admin/dashboard");
  }

  async getAllUsers() {
    return this.request<any[]>("/admin/users");
  }

  async getPendingPickupRequests() {
    return this.request<any[]>("/admin/pickup-requests/pending");
  }

  async approvePickupRequest(requestId: string, data: any) {
    return this.request<any>(`/admin/pickup-requests/${requestId}/approve`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async rejectPickupRequest(requestId: string, adminNotes: string) {
    return this.request<any>(`/admin/pickup-requests/${requestId}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ admin_notes: adminNotes }),
    });
  }

  async getCouriers() {
    return this.request<any[]>("/admin/couriers");
  }

  async createCourier(courierData: any) {
    return this.request<any>("/admin/couriers", {
      method: "POST",
      body: JSON.stringify(courierData),
    });
  }

  async assignParcelToCourier(parcelId: string, courierId: string) {
    return this.request<any>(`/admin/parcels/${parcelId}/assign`, {
      method: "PUT",
      body: JSON.stringify({ courier_id: courierId }),
    });
  }

  // Pickup Request Parcels Junction Table Methods
  async getAvailableParcelsForPickup() {
    return this.request<Parcel[]>("/merchants/parcels/available");
  }

  async getPickupRequestParcels(requestId: string) {
    return this.request<Parcel[]>(`/pickup-requests/${requestId}/parcels`);
  }

  async addParcelsToPickupRequest(requestId: string, parcelIds: string[]) {
    console.log("🔗 API: Adding parcels to pickup request", {
      requestId,
      parcelIds,
    });
    const result = await this.request<any>(
      `/pickup-requests/${requestId}/parcels`,
      {
        method: "POST",
        body: JSON.stringify(parcelIds),
      }
    );
    console.log("🔗 API: Add parcels result", result);
    return result;
  }

  // Utility
  logout() {
    this.token = null;
    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiClient = new ApiClient();
export default ApiClient;

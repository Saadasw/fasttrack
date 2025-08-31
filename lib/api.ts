// API client for FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  business_name?: string;
  full_name: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'merchant';
}

export interface User {
  id: string;
  email: string;
  business_name?: string;
  full_name: string;
  phone?: string;
  address?: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Parcel {
  id: string;
  tracking_id: string;
  sender_id: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  package_description?: string;
  weight?: number;
  dimensions?: string;
  status: string;
  pickup_date?: string;
  delivery_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PickupRequest {
  id: string;
  merchant_id: string;
  parcel_id: string;
  preferred_pickup_date: string;
  preferred_pickup_time?: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateParcelRequest {
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  package_description?: string;
  weight?: number;
  dimensions?: string;
}

export interface CreatePickupRequest {
  parcel_id: string;
  preferred_pickup_date: string;
  preferred_pickup_time?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token
    this.token = response.access_token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.access_token);
    }
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response = await this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token if it's included in the response
    if ('access_token' in response) {
      this.token = (response as any).access_token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', (response as any).access_token);
      }
    }
    
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Parcel methods
  async createParcel(parcelData: CreateParcelRequest): Promise<Parcel> {
    return this.request<Parcel>('/parcels', {
      method: 'POST',
      body: JSON.stringify(parcelData),
    });
  }

  async getParcels(): Promise<Parcel[]> {
    return this.request<Parcel[]>('/parcels');
  }

  async getParcel(parcelId: string): Promise<Parcel> {
    return this.request<Parcel>(`/parcels/${parcelId}`);
  }

  // Pickup request methods
  async createPickupRequest(requestData: CreatePickupRequest): Promise<PickupRequest> {
    return this.request<PickupRequest>('/pickup-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async getPickupRequests(): Promise<PickupRequest[]> {
    return this.request<PickupRequest[]>('/pickup-requests');
  }

  async updatePickupRequest(
    requestId: string,
    status: string,
    adminNotes?: string
  ): Promise<{ message: string }> {
    const body: any = { status };
    if (adminNotes) body.admin_notes = adminNotes;
    
    return this.request<{ message: string }>(`/pickup-requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // Admin methods
  async getAdminStats(): Promise<any> {
    return this.request('/admin/stats');
  }

  // Utility methods
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export the class for testing or custom instances
export { ApiClient };

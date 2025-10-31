import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  business_name?: string
  full_name: string
  phone?: string
  address?: string
  role: 'admin' | 'merchant'
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  updated_at: string
}

export interface Parcel {
  id: string
  tracking_id: string
  sender_id: string
  recipient_name: string
  recipient_phone: string
  recipient_address: string
  package_description?: string
  weight?: number
  dimensions?: string
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled' | 'returned'
  pickup_date?: string
  delivery_date?: string
  created_at: string
  updated_at: string
}

export interface PickupRequest {
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



-- Migration: Create pickup_request_parcels junction table
-- This allows multiple parcels to be included in a single pickup request

-- Create pickup_request_parcels junction table
CREATE TABLE IF NOT EXISTS pickup_request_parcels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pickup_request_id UUID NOT NULL REFERENCES pickup_requests(id) ON DELETE CASCADE,
    parcel_id UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique combination
    UNIQUE(pickup_request_id, parcel_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pickup_request_parcels_pickup_request_id 
    ON pickup_request_parcels(pickup_request_id);

CREATE INDEX IF NOT EXISTS idx_pickup_request_parcels_parcel_id 
    ON pickup_request_parcels(parcel_id);

-- Add RLS policies
ALTER TABLE pickup_request_parcels ENABLE ROW LEVEL SECURITY;

-- Policy: Merchants can only see their own pickup request parcels
CREATE POLICY "Merchants can view their pickup request parcels" ON pickup_request_parcels
    FOR SELECT USING (
        pickup_request_id IN (
            SELECT id FROM pickup_requests 
            WHERE merchant_id = auth.uid()
        )
    );

-- Policy: Merchants can insert their own pickup request parcels
CREATE POLICY "Merchants can insert their pickup request parcels" ON pickup_request_parcels
    FOR INSERT WITH CHECK (
        pickup_request_id IN (
            SELECT id FROM pickup_requests 
            WHERE merchant_id = auth.uid()
        ) AND
        parcel_id IN (
            SELECT id FROM parcels 
            WHERE sender_id = auth.uid()
        )
    );

-- Policy: Admins can view all pickup request parcels
CREATE POLICY "Admins can view all pickup request parcels" ON pickup_request_parcels
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

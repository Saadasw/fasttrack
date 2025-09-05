-- Fix RLS policies for pickup_request_parcels table
-- The current policies use auth.uid() which doesn't work with service key

-- Drop existing policies
DROP POLICY IF EXISTS "Merchants can view their pickup request parcels" ON pickup_request_parcels;
DROP POLICY IF EXISTS "Merchants can insert their pickup request parcels" ON pickup_request_parcels;
DROP POLICY IF EXISTS "Admins can view all pickup request parcels" ON pickup_request_parcels;

-- Create new policies that work with service key
-- Policy: Allow all operations for service key (backend operations)
CREATE POLICY "Service key can manage pickup request parcels" ON pickup_request_parcels
    FOR ALL USING (true);

-- Policy: Allow merchants to view their own pickup request parcels
CREATE POLICY "Merchants can view their pickup request parcels" ON pickup_request_parcels
    FOR SELECT USING (
        pickup_request_id IN (
            SELECT id FROM pickup_requests 
            WHERE merchant_id = auth.uid()
        )
    );

-- Policy: Allow merchants to insert their own pickup request parcels
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

-- Policy: Allow admins to view all pickup request parcels
CREATE POLICY "Admins can view all pickup request parcels" ON pickup_request_parcels
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

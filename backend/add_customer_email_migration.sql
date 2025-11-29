-- Migration: Add customer_email field to parcels table
-- This allows sending notifications directly to customers

-- Add customer_email column to parcels table
ALTER TABLE parcels 
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_parcels_customer_email ON parcels(customer_email);

-- Add comment
COMMENT ON COLUMN parcels.customer_email IS 'Customer email address for direct notifications';

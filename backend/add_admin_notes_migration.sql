-- Migration: Add admin_notes column to pickup_requests table
-- This fixes the admin pickup request management functionality

-- Add admin_notes column to pickup_requests table
ALTER TABLE pickup_requests ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Update the table comment to reflect the new column
COMMENT ON COLUMN pickup_requests.admin_notes IS 'Admin notes for pickup request approval/rejection';


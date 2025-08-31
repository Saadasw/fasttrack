-- Force Cleanup Script - Remove ALL tables and policies
-- This will completely reset your database

-- Drop all tables with CASCADE to remove all dependencies
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS tracking_updates CASCADE;
DROP TABLE IF EXISTS parcel_assignments CASCADE;
DROP TABLE IF EXISTS hubs CASCADE;
DROP TABLE IF EXISTS couriers CASCADE;
DROP TABLE IF EXISTS pickup_requests CASCADE;
DROP TABLE IF EXISTS parcels CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop all views
DROP VIEW IF EXISTS admin_dashboard_stats CASCADE;
DROP VIEW IF EXISTS merchant_dashboard_stats CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS generate_tracking_id() CASCADE;

-- Drop all triggers (they should be dropped with tables, but just in case)
-- Drop all indexes (they should be dropped with tables, but just in case)

-- Force refresh of schema cache
NOTIFY pgrst, 'reload schema';

-- Verify cleanup
SELECT 'Cleanup completed. All tables should be removed.' as status;

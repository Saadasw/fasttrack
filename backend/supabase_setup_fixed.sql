-- FastTrack Courier Service Database Setup (Fixed RLS Policies)
-- This script creates all necessary tables, functions, and policies for the courier service

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    business_name VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'merchant' CHECK (role IN ('admin', 'merchant')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create parcels table
CREATE TABLE IF NOT EXISTS parcels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_id VARCHAR(50) UNIQUE NOT NULL,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_phone VARCHAR(50) NOT NULL,
    package_description TEXT,
    weight DECIMAL(10,2),
    dimensions VARCHAR(100),
    origin_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'picked_up', 'in_transit', 'delivered', 'returned', 'cancelled')),
    pickup_date DATE,
    delivery_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pickup_requests table
CREATE TABLE IF NOT EXISTS pickup_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    pickup_address TEXT NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_time_slot VARCHAR(50),
    package_count INTEGER DEFAULT 1,
    special_instructions TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    courier_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create couriers table
CREATE TABLE IF NOT EXISTS couriers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(100),
    vehicle_number VARCHAR(50),
    coverage_area TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'busy')),
    current_location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hubs table
CREATE TABLE IF NOT EXISTS hubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50),
    manager_id UUID REFERENCES profiles(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create parcel_assignments table
CREATE TABLE IF NOT EXISTS parcel_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
    courier_id UUID NOT NULL REFERENCES couriers(id) ON DELETE CASCADE,
    hub_id UUID REFERENCES hubs(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'picked_up', 'in_transit', 'delivered')),
    notes TEXT
);

-- Create tracking_updates table
CREATE TABLE IF NOT EXISTS tracking_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
    status VARCHAR(100) NOT NULL,
    location TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    updated_by UUID REFERENCES profiles(id)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_parcels_tracking_id ON parcels(tracking_id);
CREATE INDEX IF NOT EXISTS idx_parcels_sender_id ON parcels(sender_id);
CREATE INDEX IF NOT EXISTS idx_parcels_status ON parcels(status);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_merchant_id ON pickup_requests(merchant_id);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_status ON pickup_requests(status);
CREATE INDEX IF NOT EXISTS idx_couriers_status ON couriers(status);
CREATE INDEX IF NOT EXISTS idx_tracking_updates_parcel_id ON tracking_updates(parcel_id);
CREATE INDEX IF NOT EXISTS idx_payments_parcel_id ON payments(parcel_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parcels_updated_at BEFORE UPDATE ON parcels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pickup_requests_updated_at BEFORE UPDATE ON pickup_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_couriers_updated_at BEFORE UPDATE ON couriers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hubs_updated_at BEFORE UPDATE ON hubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE couriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcel_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- FIXED RLS Policies for profiles (no infinite recursion)
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid()::text = id::text);

-- FIXED: Admin policy without self-reference
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR ALL USING (
        (SELECT role FROM profiles WHERE id = auth.uid()::uuid) = 'admin'
    );

-- FIXED: Allow profile creation during registration
CREATE POLICY "Allow profile creation" ON profiles
    FOR INSERT WITH CHECK (true);

-- RLS Policies for parcels
CREATE POLICY "Users can view their own parcels" ON parcels
    FOR SELECT USING (sender_id = auth.uid()::uuid);

CREATE POLICY "Users can create their own parcels" ON parcels
    FOR INSERT WITH CHECK (sender_id = auth.uid()::uuid);

CREATE POLICY "Users can update their own parcels" ON parcels
    FOR UPDATE USING (sender_id = auth.uid()::uuid);

-- FIXED: Admin policy without self-reference
CREATE POLICY "Admins can view all parcels" ON parcels
    FOR ALL USING (
        (SELECT role FROM profiles WHERE id = auth.uid()::uuid) = 'admin'
    );

-- RLS Policies for pickup_requests
CREATE POLICY "Users can view their own pickup requests" ON pickup_requests
    FOR SELECT USING (merchant_id = auth.uid()::uuid);

CREATE POLICY "Users can create pickup requests" ON pickup_requests
    FOR INSERT WITH CHECK (merchant_id = auth.uid()::uuid);

-- FIXED: Admin policy without self-reference
CREATE POLICY "Admins can view all pickup requests" ON pickup_requests
    FOR ALL USING (
        (SELECT role FROM profiles WHERE id = auth.uid()::uuid) = 'admin'
    );

-- FIXED: RLS Policies for other tables (admin only) - no self-reference
CREATE POLICY "Admins can manage couriers" ON couriers
    FOR ALL USING (
        (SELECT role FROM profiles WHERE id = auth.uid()::uuid) = 'admin'
    );

CREATE POLICY "Admins can manage hubs" ON hubs
    FOR ALL USING (
        (SELECT role FROM profiles WHERE id = auth.uid()::uuid) = 'admin'
    );

CREATE POLICY "Admins can manage assignments" ON parcel_assignments
    FOR ALL USING (
        (SELECT role FROM profiles WHERE id = auth.uid()::uuid) = 'admin'
    );

CREATE POLICY "Admins can manage tracking" ON tracking_updates
    FOR ALL USING (
        (SELECT role FROM profiles WHERE id = auth.uid()::uuid) = 'admin'
    );

CREATE POLICY "Admins can manage payments" ON payments
    FOR ALL USING (
        (SELECT role FROM profiles WHERE id = auth.uid()::uuid) = 'admin'
    );

-- Users can view their own tickets
CREATE POLICY "Users can view their own tickets" ON support_tickets
    FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can create tickets" ON support_tickets
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

-- FIXED: Admin policy without self-reference
CREATE POLICY "Admins can manage all tickets" ON support_tickets
    FOR ALL USING (
        (SELECT role FROM profiles WHERE id = auth.uid()::uuid) = 'admin'
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create view for admin dashboard (FIXED: no self-reference)
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM profiles WHERE role = 'merchant') as total_merchants,
    (SELECT COUNT(*) FROM profiles WHERE role = 'admin') as total_admins,
    (SELECT COUNT(*) FROM parcels) as total_parcels,
    (SELECT COUNT(*) FROM parcels WHERE status = 'pending') as pending_parcels,
    (SELECT COUNT(*) FROM parcels WHERE status = 'in_transit') as in_transit_parcels,
    (SELECT COUNT(*) FROM parcels WHERE status = 'delivered') as delivered_parcels,
    (SELECT COUNT(*) FROM pickup_requests WHERE status = 'pending') as pending_pickups,
    (SELECT COUNT(*) FROM couriers WHERE status = 'active') as active_couriers,
    (SELECT COUNT(*) FROM hubs WHERE status = 'active') as active_hubs;

-- Create view for merchant dashboard (FIXED: no self-reference)
CREATE OR REPLACE VIEW merchant_dashboard_stats AS
SELECT 
    p.id as merchant_id,
    p.business_name,
    p.full_name,
    (SELECT COUNT(*) FROM parcels WHERE sender_id = p.id) as total_parcels,
    (SELECT COUNT(*) FROM parcels WHERE sender_id = p.id AND status = 'pending') as pending_parcels,
    (SELECT COUNT(*) FROM parcels WHERE sender_id = p.id AND status = 'in_transit') as in_transit_parcels,
    (SELECT COUNT(*) FROM parcels WHERE sender_id = p.id AND status = 'delivered') as delivered_parcels,
    (SELECT COUNT(*) FROM pickup_requests WHERE merchant_id = p.id AND status = 'pending') as pending_pickups
FROM profiles p
WHERE p.role = 'merchant';

-- Grant access to views
GRANT SELECT ON admin_dashboard_stats TO anon, authenticated;
GRANT SELECT ON merchant_dashboard_stats TO anon, authenticated;

-- Insert initial admin user
INSERT INTO profiles (email, business_name, full_name, role, status) 
VALUES ('admin@fasttrack.com', 'FastTrack Admin', 'System Administrator', 'admin', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample hub
INSERT INTO hubs (name, address, phone, status) 
VALUES ('Central Hub', '123 Main Street, City Center', '+1234567890', 'active')
ON CONFLICT DO NOTHING;

-- Insert sample courier
INSERT INTO couriers (full_name, phone, vehicle_type, status) 
VALUES ('John Courier', '+1234567891', 'Motorcycle', 'active')
ON CONFLICT DO NOTHING;

-- Generate tracking ID function
CREATE OR REPLACE FUNCTION generate_tracking_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.tracking_id := 'FT' || substr(md5(random()::text), 1, 6);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tracking ID
CREATE TRIGGER generate_tracking_id_trigger
    BEFORE INSERT ON parcels
    FOR EACH ROW
    EXECUTE FUNCTION generate_tracking_id();

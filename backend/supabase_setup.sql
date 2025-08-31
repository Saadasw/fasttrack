-- FastTrack Courier Service Database Setup
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    business_name VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    role VARCHAR(20) DEFAULT 'merchant' CHECK (role IN ('admin', 'merchant')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create parcels table
CREATE TABLE IF NOT EXISTS parcels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tracking_id VARCHAR(50) UNIQUE NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_phone VARCHAR(50) NOT NULL,
    recipient_address TEXT NOT NULL,
    package_description TEXT,
    weight DECIMAL(10,2),
    dimensions VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled', 'returned')),
    pickup_date TIMESTAMP WITH TIME ZONE,
    delivery_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pickup_requests table
CREATE TABLE IF NOT EXISTS pickup_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    merchant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    parcel_id UUID REFERENCES parcels(id) ON DELETE CASCADE,
    preferred_pickup_date DATE NOT NULL,
    preferred_pickup_time TIME,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create couriers table
CREATE TABLE IF NOT EXISTS couriers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50),
    vehicle_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'busy')),
    current_location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hubs table
CREATE TABLE IF NOT EXISTS hubs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create parcel_assignments table
CREATE TABLE IF NOT EXISTS parcel_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    parcel_id UUID REFERENCES parcels(id) ON DELETE CASCADE,
    courier_id UUID REFERENCES couriers(id) ON DELETE SET NULL,
    hub_id UUID REFERENCES hubs(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'picked_up', 'in_transit', 'delivered')),
    notes TEXT
);

-- Create tracking_updates table
CREATE TABLE IF NOT EXISTS tracking_updates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    parcel_id UUID REFERENCES parcels(id) ON DELETE CASCADE,
    status VARCHAR(100) NOT NULL,
    location TEXT,
    description TEXT,
    updated_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    parcel_id UUID REFERENCES parcels(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_type VARCHAR(20) DEFAULT 'cod' CHECK (payment_type IN ('cod', 'prepaid', 'credit')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user
INSERT INTO profiles (email, business_name, full_name, role, status) 
VALUES ('admin@fasttrack.com', 'FastTrack Corporate', 'System Administrator', 'admin', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample hub
INSERT INTO hubs (name, address, city, state, phone, email) 
VALUES ('Dhaka Central Hub', '123 Central Road, Dhaka', 'Dhaka', 'Dhaka Division', '+8801234567890', 'dhaka@fasttrack.com')
ON CONFLICT DO NOTHING;

-- Insert sample courier
INSERT INTO couriers (full_name, phone, email, vehicle_type, vehicle_number) 
VALUES ('Ahmed Khan', '+8801234567891', 'ahmed@fasttrack.com', 'Motorcycle', 'DHK-1234')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_parcels_tracking_id ON parcels(tracking_id);
CREATE INDEX IF NOT EXISTS idx_parcels_sender_id ON parcels(sender_id);
CREATE INDEX IF NOT EXISTS idx_parcels_status ON parcels(status);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_merchant_id ON pickup_requests(merchant_id);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_status ON pickup_requests(status);
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

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::uuid AND role = 'admin'
        )
    );

-- RLS Policies for parcels
CREATE POLICY "Users can view their own parcels" ON parcels
    FOR SELECT USING (sender_id = auth.uid()::uuid);

CREATE POLICY "Users can create their own parcels" ON parcels
    FOR INSERT WITH CHECK (sender_id = auth.uid()::uuid);

CREATE POLICY "Users can update their own parcels" ON parcels
    FOR UPDATE USING (sender_id = auth.uid()::uuid);

CREATE POLICY "Admins can view all parcels" ON parcels
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::uuid AND role = 'admin'
        )
    );

-- RLS Policies for pickup_requests
CREATE POLICY "Users can view their own pickup requests" ON pickup_requests
    FOR SELECT USING (merchant_id = auth.uid()::uuid);

CREATE POLICY "Users can create pickup requests" ON pickup_requests
    FOR INSERT WITH CHECK (merchant_id = auth.uid()::uuid);

CREATE POLICY "Admins can view all pickup requests" ON pickup_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::uuid AND role = 'admin'
        )
    );

-- RLS Policies for other tables (admin only)
CREATE POLICY "Admins can manage couriers" ON couriers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::uuid AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage hubs" ON hubs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::uuid AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage assignments" ON parcel_assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::uuid AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage tracking" ON tracking_updates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::uuid AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage payments" ON payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::uuid AND role = 'admin'
        )
    );

CREATE POLICY "Users can view their own tickets" ON support_tickets
    FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can create tickets" ON support_tickets
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Admins can manage all tickets" ON support_tickets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid()::uuid AND role = 'admin'
        )
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create view for admin dashboard
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

-- Create view for merchant dashboard
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

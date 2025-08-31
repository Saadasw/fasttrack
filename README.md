# 🚚 FastTrack Courier Service

A comprehensive courier and logistics management system built with FastAPI (Python) backend and Next.js (React) frontend, integrated with Supabase for database and authentication.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Features](#features)
- [What's Implemented](#whats-implemented)
- [What's Missing](#whats-missing)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Development Status](#development-status)
- [Known Issues](#known-issues)
- [Future Roadmap](#future-roadmap)

## 🎯 Project Overview

FastTrack is a modern courier service management platform that enables merchants to create, track, and manage parcel deliveries. The system provides real-time tracking, pickup scheduling, and comprehensive logistics management capabilities.

### Core Use Cases
- **Merchants**: Create parcels, schedule pickups, track deliveries
- **Admins**: Manage users, monitor system statistics, approve pickup requests
- **Public**: Track parcels using tracking IDs

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (Supabase)    │
│   Port: 3000    │    │   Port: 8000    │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ✨ Features

### ✅ **Fully Implemented**
- **User Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Role-based access control (Admin/Merchant)
  - Protected routes

- **Parcel Management**
  - Create new parcels with tracking IDs
  - View parcel list and details
  - Update parcel status
  - Delete parcels (pending status only)
  - Search and filter parcels

- **Dashboard System**
  - Merchant dashboard with statistics
  - Real-time parcel counts
  - Recent parcels display
  - Quick actions

- **Pickup Request System**
  - Create pickup requests
  - Admin approval workflow
  - Status management

- **Public Tracking**
  - Public parcel tracking endpoint
  - Tracking ID generation

### 🔄 **Partially Implemented**
- **Admin Panel**
  - Basic admin statistics
  - User management (structure exists, limited functionality)

- **Status Management**
  - Parcel status updates
  - Admin-only status restrictions

### ❌ **Not Yet Implemented**
- **Courier Management**
  - Courier registration and profiles
  - Vehicle management
  - Coverage area management

- **Hub Management**
  - Distribution hub setup
  - Hub assignment system

- **Advanced Tracking**
  - Real-time location tracking
  - Delivery route optimization
  - ETA calculations

- **Notification System**
  - Email/SMS notifications
  - Push notifications
  - Status update alerts

- **Payment Integration**
  - Payment processing
  - Invoice generation
  - Pricing calculations

- **Mobile App**
  - React Native mobile application
  - Courier mobile interface

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.13+)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT with PyJWT
- **HTTP Client**: httpx
- **Environment**: python-dotenv
- **CORS**: FastAPI CORS middleware

### Frontend
- **Framework**: Next.js 15.2.4 (React 19)
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context + Hooks
- **Theming**: next-themes

### Database
- **Provider**: Supabase
- **Extensions**: UUID generation
- **Security**: Row Level Security (RLS)
- **API**: REST API with automatic CRUD

## 🚀 Setup & Installation

### Prerequisites
- Python 3.13+
- Node.js 18+
- Supabase account
- Git

### Backend Setup
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### Frontend Setup
```bash
cd fasttrack-frontend
npm install
```

### Environment Configuration
Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
SECRET_KEY=your_jwt_secret_key
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup
1. Run the SQL script in Supabase SQL Editor:
   ```sql
   -- Use supabase_setup_fixed.sql for proper RLS policies
   ```

2. Enable Row Level Security on all tables
3. Verify RLS policies are working correctly

### Running the Application
```bash
# Terminal 1 - Backend
cd backend
python start.py

# Terminal 2 - Frontend
cd fasttrack-frontend
npm run dev
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile

### Parcel Endpoints
- `POST /parcels` - Create new parcel
- `GET /parcels` - Get user's parcels
- `GET /parcels/{id}` - Get specific parcel
- `PUT /parcels/{id}` - Update parcel
- `DELETE /parcels/{id}` - Delete parcel
- `PUT /parcels/{id}/status` - Update parcel status
- `GET /parcels/tracking/{tracking_id}` - Public tracking
- `GET /parcels/search` - Search parcels
- `GET /parcels/status/{status}` - Get parcels by status

### Pickup Request Endpoints
- `POST /pickup-requests` - Create pickup request
- `GET /pickup-requests` - Get pickup requests
- `GET /pickup-requests/{id}` - Get specific request
- `PUT /pickup-requests/{id}` - Update request status
- `DELETE /pickup-requests/{id}` - Delete request

### Admin Endpoints
- `GET /admin/stats` - Admin dashboard statistics
- `GET /merchant/stats` - Merchant statistics

## 🗄️ Database Schema

### Core Tables
- **profiles**: User accounts and business information
- **parcels**: Parcel details and tracking information
- **pickup_requests**: Pickup scheduling and management
- **couriers**: Courier profiles and vehicle information
- **hubs**: Distribution center management
- **parcel_assignments**: Parcel-courier assignments
- **tracking_updates**: Parcel status history

### Key Relationships
- Users (profiles) → Parcels (sender_id)
- Users → Pickup Requests (merchant_id)
- Parcels → Tracking Updates (parcel_id)
- Couriers → Parcel Assignments (courier_id)

## 📁 Project Structure

```
fasttrack/
├── backend/                          # FastAPI backend
│   ├── main.py                      # Main application file
│   ├── requirements.txt             # Python dependencies
│   ├── start.py                     # Server startup script
│   ├── supabase_setup_fixed.sql    # Database schema
│   └── venv/                        # Python virtual environment
│
├── fasttrack-frontend/              # Next.js frontend
│   ├── app/                         # App router pages
│   │   ├── dashboard/               # Merchant dashboard
│   │   ├── parcels/                 # Parcel management
│   │   ├── admin/                   # Admin panel
│   │   └── tracking/                # Public tracking
│   ├── components/                  # React components
│   │   ├── auth/                    # Authentication components
│   │   ├── merchant/                # Merchant-specific components
│   │   ├── parcel/                  # Parcel management components
│   │   ├── admin/                   # Admin components
│   │   └── ui/                      # Reusable UI components
│   ├── contexts/                    # React contexts
│   ├── lib/                         # Utility functions
│   └── package.json                 # Node dependencies
│
└── README.md                        # This file
```

## 🚧 Development Status

### Phase 1: Core Infrastructure ✅
- [x] Project setup and structure
- [x] Database schema design
- [x] Basic authentication system
- [x] CORS configuration

### Phase 2: Backend API ✅
- [x] User management endpoints
- [x] Parcel CRUD operations
- [x] Pickup request system
- [x] Basic admin functionality

### Phase 3: Frontend Integration ✅
- [x] User authentication UI
- [x] Dashboard implementation
- [x] Parcel management interface
- [x] Responsive design

### Phase 4: Advanced Features 🔄
- [ ] Courier management system
- [ ] Real-time tracking
- [ ] Notification system
- [ ] Payment integration

### Phase 5: Production Ready 🚫
- [ ] Testing suite
- [ ] CI/CD pipeline
- [ ] Performance optimization
- [ ] Security hardening

## ⚠️ Known Issues

1. **Authentication Flow**
   - Password hashing not implemented (demo only)
   - Token refresh mechanism missing

2. **Database**
   - Some RLS policies may need refinement
   - Indexing optimization required for large datasets

3. **Frontend**
   - Hydration warnings in development
   - Some TypeScript type definitions incomplete

4. **API**
   - Error handling could be more robust
   - Rate limiting not implemented
   - Input validation could be enhanced

## 🗺️ Future Roadmap

### Short Term (1-2 months)
- [ ] Implement password hashing and security
- [ ] Add comprehensive error handling
- [ ] Complete admin panel functionality
- [ ] Add unit tests for critical functions

### Medium Term (3-6 months)
- [ ] Courier mobile application
- [ ] Real-time tracking with WebSockets
- [ ] Advanced analytics and reporting
- [ ] Multi-language support

### Long Term (6+ months)
- [ ] AI-powered route optimization
- [ ] IoT integration for smart tracking
- [ ] Blockchain for delivery verification
- [ ] International expansion features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the known issues section

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Development Phase 3 Complete

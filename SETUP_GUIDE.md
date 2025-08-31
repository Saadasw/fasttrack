# 🚀 FastTrack Courier Service - Complete Setup Guide

This guide will help you set up both the **FastAPI Backend** and **Next.js Frontend** with your new Supabase credentials.

## 🎯 **What We're Building**

- **Backend**: FastAPI with JWT authentication and Supabase integration
- **Frontend**: Next.js with real API calls (no more mock data!)
- **Database**: PostgreSQL via Supabase with proper RLS policies
- **Authentication**: Secure JWT-based system

## 📋 **Prerequisites**

- ✅ **Python 3.8+** installed
- ✅ **Node.js 18+** installed
- ✅ **Git** installed
- ✅ **Supabase account** with your new project

## 🗄️ **Step 1: Database Setup (Supabase)**

### **1.1 Go to Your Supabase Project**
- Visit: [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Select your project: `cxpplkqmjutdcelainet`

### **1.2 Run Database Setup Script**
1. **Navigate to SQL Editor** in your Supabase dashboard
2. **Copy the entire content** from `backend/supabase_setup.sql`
3. **Paste and run** the script
4. **Verify** all tables are created successfully

### **1.3 Verify Setup**
You should see these tables created:
- ✅ `profiles` - User accounts
- ✅ `parcels` - Package tracking
- ✅ `pickup_requests` - Pickup scheduling
- ✅ `couriers` - Delivery personnel
- ✅ `hubs` - Distribution centers
- ✅ And more...

## 🔧 **Step 2: Backend Setup (FastAPI)**

### **2.1 Navigate to Backend Directory**
```bash
cd backend
```

### **2.2 Create Environment File**
```bash
# Copy the environment template
copy env.txt .env

# Edit .env file with your credentials
notepad .env
```

**Update these values in `.env`:**
```env
SUPABASE_URL=https://cxpplkqmjutdcelainet.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cHBsa3FtanV0ZGNlbGFpbmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNDUzNzIsImV4cCI6MjA3MTkyMTM3Mn0.g6IX7OCYPjQAh2E5TiQylBB2zROBvl0ow-cSlJqiiDg
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1b21zcG1ybHp3Ymdhb2Vlb21jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIzNDkzOCwiZXhwIjoyMDcxODEwOTM4fQ.eoF2CdLb6Zn_MvLmrM7CEfN8_BvjitaD5u4vu7rPhkg
SUPABASE_JWT_SECRET=F6sOzn7mvzDG8UgpsbOMffuL6Fn5iJtDtsbYCc3UGY3s69VTHW18unQ9usmtnJ1kQAqrE1clA5ewAe5K9/IJpA==
```

### **2.3 Install Dependencies**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### **2.4 Start Backend Server**
```bash
# Option 1: Use the startup script (Windows)
start.bat

# Option 2: Manual start
python start.py

# Option 3: Direct uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### **2.5 Verify Backend is Running**
- **API**: `http://localhost:8000`
- **Health Check**: `http://localhost:8000/health`
- **Documentation**: `http://localhost:8000/docs`

## 🌐 **Step 3: Frontend Setup (Next.js)**

### **3.1 Navigate to Frontend Directory**
```bash
cd ..\fasttrack-frontend
```

### **3.2 Update Environment Variables**
**Copy the content from `env-frontend.txt` to `.env.local`:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://cxpplkqmjutdcelainet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cHBsa3FtanV0ZGNlbGFpbmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNDUzNzIsImV4cCI6MjA3MTkyMTM3Mn0.g6IX7OCYPjQAh2E5TiQylBB2zROBvl0ow-cSlJqiiDg
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### **3.3 Start Frontend Server**
```bash
npm run dev
```

### **3.4 Verify Frontend is Running**
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:8000`

## 🔐 **Step 4: Test the System**

### **4.1 Test Backend API**
```bash
# Health check
curl http://localhost:8000/health

# Test registration
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"full_name\":\"Test User\",\"role\":\"merchant\"}"
```

### **4.2 Test Frontend Integration**
1. **Open**: `http://localhost:3000`
2. **Go to**: Registration page
3. **Create account** with role "Merchant"
4. **Login** with your credentials
5. **Access** merchant dashboard

## 📱 **Step 5: Available Features**

### **🔐 Authentication**
- ✅ User registration (Admin/Merchant)
- ✅ Secure login with JWT
- ✅ Role-based access control
- ✅ Protected routes

### **📦 Merchant Dashboard**
- ✅ View all parcels
- ✅ Create new parcels
- ✅ Request pickups
- ✅ Track package status
- ✅ Profile management

### **👨‍💼 Admin Dashboard**
- ✅ View all users
- ✅ Manage parcels
- ✅ Approve/reject pickups
- ✅ System statistics
- ✅ Full administrative control

### **🗄️ Database Features**
- ✅ Secure user profiles
- ✅ Parcel tracking system
- ✅ Pickup request management
- ✅ Row Level Security (RLS)
- ✅ Automatic timestamps

## 🚀 **Step 6: Production Deployment**

### **6.1 Backend Deployment**
```bash
# Set production environment
export ENVIRONMENT=production
export SECRET_KEY=your-super-secure-production-key

# Use production server
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### **6.2 Frontend Deployment**
```bash
# Build for production
npm run build

# Start production server
npm start
```

### **6.3 Environment Variables**
- **Production**: Set `NEXT_PUBLIC_API_URL` to your production backend URL
- **Security**: Use strong `SECRET_KEY` in production
- **CORS**: Update `FRONTEND_URL` in backend `.env`

## 🐛 **Troubleshooting**

### **Common Issues & Solutions**

#### **1. Backend Won't Start**
```bash
# Check Python version
python --version

# Verify virtual environment
venv\Scripts\activate

# Check dependencies
pip list

# Check environment file
echo %SUPABASE_URL%
```

#### **2. Database Connection Issues**
- ✅ Verify Supabase credentials
- ✅ Check if SQL script ran successfully
- ✅ Verify tables exist in Supabase dashboard

#### **3. Frontend API Errors**
- ✅ Check if backend is running on port 8000
- ✅ Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- ✅ Check browser console for CORS errors

#### **4. Authentication Issues**
- ✅ Verify JWT token in localStorage
- ✅ Check backend logs for errors
- ✅ Verify user exists in database

### **Debug Commands**
```bash
# Backend logs
uvicorn main:app --reload --log-level debug

# Frontend logs
npm run dev

# Check ports
netstat -an | findstr :8000
netstat -an | findstr :3000
```

## 📊 **Monitoring & Testing**

### **API Testing**
- **Swagger UI**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/health`
- **Manual Testing**: Use the provided curl commands

### **Frontend Testing**
- **User Registration**: Test with different roles
- **Login Flow**: Verify JWT token storage
- **Dashboard Access**: Test role-based routing
- **API Integration**: Verify real data from backend

## 🎉 **Success Indicators**

You'll know everything is working when:

1. ✅ **Backend**: `http://localhost:8000/health` returns `{"status": "healthy"}`
2. ✅ **Frontend**: `http://localhost:3000` loads without errors
3. ✅ **Registration**: Can create new user accounts
4. ✅ **Login**: Can authenticate and get JWT token
5. ✅ **Dashboard**: Can access role-appropriate dashboards
6. ✅ **API Calls**: Frontend successfully communicates with backend

## 🆘 **Need Help?**

### **Immediate Issues**
1. **Check logs** in both terminal windows
2. **Verify ports** are not in use
3. **Check environment** variables are correct
4. **Restart** both servers

### **Documentation**
- **Backend**: `backend/README.md`
- **API Docs**: `http://localhost:8000/docs`
- **This Guide**: Keep this file handy

### **Next Steps**
- ✅ **Test all features** thoroughly
- ✅ **Customize** the system for your needs
- ✅ **Add more endpoints** as required
- ✅ **Deploy** to production when ready

---

## 🎯 **Quick Start Commands**

```bash
# Terminal 1 - Backend
cd backend
copy env.txt .env
# Edit .env with your Supabase credentials
start.bat

# Terminal 2 - Frontend  
cd fasttrack-frontend
# Copy env-frontend.txt content to .env.local
npm run dev
```

**Your FastTrack Courier Service is now running with a real backend! 🚀**

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

**Happy coding! 🎉**

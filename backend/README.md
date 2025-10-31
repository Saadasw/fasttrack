# 🚀 FastTrack Courier Service - FastAPI Backend

A robust, scalable backend API for the FastTrack Courier Service built with FastAPI and integrated with Supabase.

## 🏗️ **Architecture Overview**

- **Framework**: FastAPI (Python 3.8+)
- **Database**: PostgreSQL via Supabase
- **Authentication**: JWT-based with Supabase integration
- **API Documentation**: Auto-generated with Swagger UI
- **CORS**: Configured for frontend integration
- **Security**: Row Level Security (RLS) policies

## 📋 **Prerequisites**

- Python 3.8 or higher
- pip or conda package manager
- Supabase account and project
- Git

## 🚀 **Quick Start**

### 1. **Clone and Setup**

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/Scripts/activate
# Or,
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. **Environment Configuration**

Copy the environment template and configure your Supabase credentials:

```bash
# Copy environment template
cp env.txt .env

# Edit .env file with your credentials
# Update the following variables:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_KEY
# - SUPABASE_JWT_SECRET
```

### 3. **Database Setup**

1. **Go to your Supabase project dashboard**
2. **Navigate to SQL Editor**
3. **Copy and paste the contents of `supabase_setup.sql`**
4. **Run the script to create all tables and policies**

### 4. **Start the Server**

```bash
# Development mode with auto-reload
python start.py

# Or directly with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

## 📚 **API Documentation**

Once the server is running, you can access:

- **Interactive API Docs**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`

## 🔐 **Authentication Flow**

### **Registration**

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "business_name": "My Company",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "address": "123 Business St",
  "role": "merchant"
}
```

### **Login**

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### **Protected Endpoints**

```http
GET /auth/me
Authorization: Bearer <your_jwt_token>
```

## 🗄️ **Database Schema**

### **Core Tables**

1. **`profiles`** - User accounts and business information
2. **`parcels`** - Package details and tracking information
3. **`pickup_requests`** - Merchant pickup scheduling
4. **`couriers`** - Delivery personnel management
5. **`hubs`** - Distribution center locations
6. **`parcel_assignments`** - Courier-parcel assignments
7. **`tracking_updates`** - Real-time status updates
8. **`payments`** - Financial transaction records
9. **`support_tickets`** - Customer support system

### **Key Features**

- **UUID Primary Keys** for security
- **Automatic Timestamps** (created_at, updated_at)
- **Row Level Security** policies
- **Foreign Key Constraints** for data integrity
- **Indexes** for performance optimization

## 🔒 **Security Features**

### **Row Level Security (RLS)**

- Users can only access their own data
- Admins have full access to all data
- Role-based permissions enforced at database level

### **JWT Authentication**

- Secure token-based authentication
- Configurable token expiration
- Automatic token validation

### **CORS Protection**

- Configured for frontend integration
- Secure cross-origin requests

## 📊 **API Endpoints**

### **Authentication**

- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user profile

### **Parcels**

- `POST /parcels` - Create new parcel
- `GET /parcels` - List user's parcels
- `GET /parcels/{id}` - Get parcel details

### **Pickup Requests**

- `POST /pickup-requests` - Create pickup request
- `GET /pickup-requests` - List pickup requests
- `PUT /pickup-requests/{id}` - Update request status

### **Admin Operations**

- `GET /admin/stats` - Dashboard statistics
- Full CRUD operations for all entities

## 🧪 **Testing**

### **Manual Testing**

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test registration
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","full_name":"Test User","role":"merchant"}'
```

### **Automated Testing**

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## 🚀 **Deployment**

### **Production Considerations**

1. **Environment Variables**

   - Set `ENVIRONMENT=production`
   - Use strong `SECRET_KEY`
   - Configure production database URLs

2. **Security**

   - Enable HTTPS
   - Configure proper CORS origins
   - Set up monitoring and logging

3. **Performance**
   - Use production ASGI server (Gunicorn + Uvicorn)
   - Enable connection pooling
   - Configure proper timeouts

### **Docker Deployment**

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🔧 **Configuration Options**

### **Environment Variables**

| Variable                      | Description            | Default               |
| ----------------------------- | ---------------------- | --------------------- |
| `SUPABASE_URL`                | Supabase project URL   | Required              |
| `SUPABASE_ANON_KEY`           | Supabase anonymous key | Required              |
| `SUPABASE_SERVICE_KEY`        | Supabase service key   | Required              |
| `SECRET_KEY`                  | JWT signing key        | Generated             |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time  | 30                    |
| `FRONTEND_URL`                | Frontend URL for CORS  | http://localhost:3000 |
| `HOST`                        | Server host            | 0.0.0.0               |
| `PORT`                        | Server port            | 8000                  |

## 📝 **Development Workflow**

1. **Feature Development**

   - Create feature branch
   - Implement API endpoints
   - Add tests
   - Update documentation

2. **Database Changes**

   - Update `supabase_setup.sql`
   - Test in development
   - Apply to production

3. **API Updates**
   - Modify Pydantic models
   - Update endpoint logic
   - Test with frontend

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Database Connection**

   - Verify Supabase credentials
   - Check network connectivity
   - Validate database schema

2. **Authentication Errors**

   - Check JWT token expiration
   - Verify user permissions
   - Check RLS policies

3. **CORS Issues**
   - Verify frontend URL configuration
   - Check browser console for errors
   - Validate CORS middleware setup

### **Logs and Debugging**

```bash
# Enable debug logging
uvicorn main:app --reload --log-level debug

# Check application logs
tail -f logs/app.log
```

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Submit pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy Coding! 🚀**

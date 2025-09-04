from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from typing import List, Optional
import jwt as PyJWT
from datetime import datetime, timedelta
from pydantic import BaseModel
import httpx

# Load environment variables with override to ensure fresh values
load_dotenv(override=True)

app = FastAPI(
    title="FastTrack Courier API",
    description="Backend API for FastTrack Courier Service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Pydantic models
class UserCreate(BaseModel):
    email: str
    password: str
    business_name: Optional[str] = None
    full_name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    role: str = "merchant"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    business_name: Optional[str]
    full_name: str
    phone: Optional[str]
    address: Optional[str]
    role: str
    status: str
    created_at: str
    updated_at: str

class ParcelCreate(BaseModel):
    recipient_name: str
    recipient_phone: str
    recipient_address: str  # For backward compatibility
    package_description: Optional[str] = None
    weight: Optional[float] = None
    dimensions: Optional[str] = None

class ParcelResponse(BaseModel):
    id: str
    tracking_id: str
    sender_id: str
    recipient_name: str
    recipient_phone: str
    origin_address: str
    destination_address: str
    package_description: Optional[str]
    weight: Optional[float]
    dimensions: Optional[str]
    status: str
    pickup_date: Optional[str]
    delivery_date: Optional[str]
    created_at: str
    updated_at: str

class PickupRequestCreate(BaseModel):
    pickup_address: str
    pickup_date: str
    pickup_time_slot: Optional[str] = None
    package_count: Optional[int] = 1
    special_instructions: Optional[str] = None

class PickupRequestResponse(BaseModel):
    id: str
    merchant_id: str
    pickup_address: str
    pickup_date: str
    pickup_time_slot: Optional[str]
    package_count: Optional[int]
    special_instructions: Optional[str]
    status: str
    courier_id: Optional[str]
    created_at: str
    updated_at: str
# Admin Models
class CourierCreate(BaseModel):
    full_name: str
    phone: str
    vehicle_type: Optional[str] = None
    vehicle_number: Optional[str] = None
    coverage_area: Optional[str] = None

class CourierResponse(BaseModel):
    id: str
    full_name: str
    phone: str
    vehicle_type: Optional[str]
    vehicle_number: Optional[str]
    coverage_area: Optional[str]
    status: str
    current_location: Optional[str]
    created_at: str
    updated_at: str

class PickupRequestUpdate(BaseModel):
    status: str
    admin_notes: Optional[str] = None
    courier_id: Optional[str] = None

# Admin authentication helper
def verify_admin(token: dict = Depends(verify_token)):
    """Verify admin role"""
    user_role = token.get("role")
    if user_role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    return token
# Authentication functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = PyJWT.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = PyJWT.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except PyJWT.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except (PyJWT.PyJWTError, PyJWT.InvalidTokenError, PyJWT.DecodeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

# Supabase client functions
async def get_supabase_client():
    return {
        "url": SUPABASE_URL,
        "key": SUPABASE_ANON_KEY
    }

async def supabase_request(endpoint: str, method: str = "GET", data: dict = None, headers: dict = None):
    """Make requests to Supabase API"""
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise HTTPException(status_code=500, detail="Supabase configuration missing")
    
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    default_headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json"
    }
    
    if headers:
        default_headers.update(headers)
    
    async with httpx.AsyncClient() as client:
        try:
            if method == "GET":
                response = await client.get(url, headers=default_headers)
            elif method == "POST":
                response = await client.post(url, headers=default_headers, json=data)
            elif method == "PUT":
                response = await client.put(url, headers=default_headers, json=data)
            elif method == "DELETE":
                response = await client.delete(url, headers=default_headers)
            else:
                raise HTTPException(status_code=400, detail="Invalid HTTP method")
            
            # Log response details for debugging
            print(f"Supabase {method} {endpoint}: Status={response.status_code}, Response={response.text}")
            
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=f"Supabase error: {response.text}")
            
            # Handle empty responses (common with POST/PUT operations)
            if response.text.strip():
                try:
                    return response.json()
                except:
                    # If JSON parsing fails, return empty dict
                    return {}
            else:
                # For successful POST/PUT operations, return the data that was sent
                return data if data else {}
        except Exception as e:
            print(f"Supabase request error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Supabase request failed: {str(e)}")

# Routes
@app.get("/")
async def root():
    return {"message": "FastTrack Courier API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    """User registration endpoint"""
    try:
        # Check if user already exists
        existing_user = await supabase_request(
            f"profiles?email=eq.{user_data.email}",
            "GET"
        )
        
        if existing_user and len(existing_user) > 0:
            raise HTTPException(
                status_code=400,
                detail="User with this email already exists"
            )
        
        # Create user profile
        profile_data = {
            "email": user_data.email,
            "business_name": user_data.business_name,
            "full_name": user_data.full_name,
            "phone": user_data.phone,
            "address": user_data.address,
            "role": user_data.role,
            "status": "active",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        # Insert profile into Supabase
        result = await supabase_request(
            "profiles",
            "POST",
            profile_data
        )
        
        if not result:
            raise HTTPException(status_code=500, detail="Failed to create user profile")
        
        # Create access token
        token_data = {
            "sub": result.get("id"),
            "email": user_data.email,
            "role": user_data.role
        }
        access_token = create_access_token(token_data)
        
        return {
            **profile_data,
            "id": result.get("id"),
            "access_token": access_token
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/login")
async def login(user_data: UserLogin):
    """User login endpoint"""
    try:
        # Find user by email
        user = await supabase_request(
            f"profiles?email=eq.{user_data.email}",
            "GET"
        )
        
        if not user or len(user) == 0:
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )
        
        user_profile = user[0]
        
        # In a real app, you'd verify the password here
        # For now, we'll just check if the user exists
        
        # Create access token
        token_data = {
            "sub": user_profile.get("id"),
            "email": user_profile.get("email"),
            "role": user_profile.get("role")
        }
        access_token = create_access_token(token_data)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_profile
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/auth/me", response_model=UserResponse)
async def get_current_user(token: dict = Depends(verify_token)):
    """Get current user profile"""
    try:
        user_id = token.get("sub")
        user = await supabase_request(
            f"profiles?id=eq.{user_id}",
            "GET"
        )
        
        if not user or len(user) == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user[0]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/parcels", response_model=ParcelResponse)
async def create_parcel(
    parcel_data: ParcelCreate,
    token: dict = Depends(verify_token)
):
    """Create a new parcel"""
    try:
        user_id = token.get("sub")
        
        # Generate tracking ID
        import uuid
        tracking_id = f"FT{uuid.uuid4().hex[:8].upper()}"
        
        parcel_data_dict = parcel_data.dict()
        
        # Map recipient_address to origin_address and destination_address for compatibility
        if "recipient_address" in parcel_data_dict:
            parcel_data_dict["origin_address"] = parcel_data_dict.pop("recipient_address")
            parcel_data_dict["destination_address"] = parcel_data_dict["origin_address"]
        
        parcel_data_dict.update({
            "sender_id": user_id,
            "tracking_id": tracking_id,
            "status": "pending",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        })
        
        result = await supabase_request(
            "parcels",
            "POST",
            parcel_data_dict
        )
        
        if not result:
            raise HTTPException(status_code=500, detail="Failed to create parcel")
        
        return {**parcel_data_dict, "id": result.get("id")}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/parcels", response_model=List[ParcelResponse])
async def get_parcels(token: dict = Depends(verify_token)):
    """Get user's parcels"""
    try:
        user_id = token.get("sub")
        user_role = token.get("role")
        
        if user_role == "admin":
            # Admin can see all parcels
            parcels = await supabase_request("parcels", "GET")
        else:
            # Merchant can only see their own parcels
            parcels = await supabase_request(
                f"parcels?sender_id=eq.{user_id}",
                "GET"
            )
        
        return parcels or []
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/parcels/{parcel_id}", response_model=ParcelResponse)
async def get_parcel(
    parcel_id: str,
    token: dict = Depends(verify_token)
):
    """Get specific parcel details"""
    try:
        parcel = await supabase_request(
            f"parcels?id=eq.{parcel_id}",
            "GET"
        )
        
        if not parcel or len(parcel) == 0:
            raise HTTPException(status_code=404, detail="Parcel not found")
        
        return parcel[0]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/parcels/{parcel_id}", response_model=ParcelResponse)
async def update_parcel(
    parcel_id: str,
    parcel_data: dict,
    token: dict = Depends(verify_token)
):
    """Update parcel details"""
    try:
        user_id = token.get("sub")
        user_role = token.get("role")
        
        # Check if parcel exists and user has permission
        existing_parcel = await supabase_request(
            f"parcels?id=eq.{parcel_id}",
            "GET"
        )
        
        if not existing_parcel or len(existing_parcel) == 0:
            raise HTTPException(status_code=404, detail="Parcel not found")
        
        parcel = existing_parcel[0]
        
        # Only sender or admin can update
        if user_role != "admin" and parcel.get("sender_id") != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to update this parcel")
        
        # Add updated timestamp
        update_data = parcel_data.copy()
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        result = await supabase_request(
            f"parcels?id=eq.{parcel_id}",
            "PUT",
            update_data
        )
        
        if not result:
            raise HTTPException(status_code=500, detail="Failed to update parcel")
        
        return {**parcel, **update_data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/parcels/{parcel_id}")
async def delete_parcel(
    parcel_id: str,
    token: dict = Depends(verify_token)
):
    """Delete a parcel (only if status is pending)"""
    try:
        user_id = token.get("sub")
        user_role = token.get("role")
        
        # Check if parcel exists
        existing_parcel = await supabase_request(
            f"parcels?id=eq.{parcel_id}",
            "GET"
        )
        
        if not existing_parcel or len(existing_parcel) == 0:
            raise HTTPException(status_code=404, detail="Parcel not found")
        
        parcel = existing_parcel[0]
        
        # Only sender or admin can delete
        if user_role != "admin" and parcel.get("sender_id") != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this parcel")
        
        # Only allow deletion if status is pending
        if parcel.get("status") != "pending":
            raise HTTPException(status_code=400, detail="Can only delete parcels with pending status")
        
        result = await supabase_request(
            f"parcels?id=eq.{parcel_id}",
            "DELETE"
        )
        
        return {"message": "Parcel deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/parcels/{parcel_id}/status")
async def update_parcel_status(
    parcel_id: str,
    status_update: dict,
    token: dict = Depends(verify_token)
):
    """Update parcel status (admin only for certain statuses)"""
    try:
        user_id = token.get("sub")
        user_role = token.get("role")
        
        new_status = status_update.get("status")
        notes = status_update.get("notes", "")
        
        if not new_status:
            raise HTTPException(status_code=400, detail="Status is required")
        
        # Check if parcel exists
        existing_parcel = await supabase_request(
            f"parcels?id=eq.{parcel_id}",
            "GET"
        )
        
        if not existing_parcel or len(existing_parcel) == 0:
            raise HTTPException(status_code=404, detail="Parcel not found")
        
        parcel = existing_parcel[0]
        
        # Only sender or admin can update status
        if user_role != "admin" and parcel.get("sender_id") != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to update this parcel")
        
        # Admin-only statuses
        admin_only_statuses = ["assigned", "picked_up", "in_transit", "delivered", "returned"]
        if new_status in admin_only_statuses and user_role != "admin":
            raise HTTPException(status_code=403, detail="Only admins can set this status")
        
        # Update status and add timestamp
        update_data = {
            "status": new_status,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        if notes:
            update_data["status_notes"] = notes
        
        result = await supabase_request(
            f"parcels?id=eq.{parcel_id}",
            "PUT",
            update_data
        )
        
        if not result:
            raise HTTPException(status_code=500, detail="Failed to update parcel status")
        
        return {"message": f"Parcel status updated to {new_status}"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/parcels/tracking/{tracking_id}")
async def track_parcel(tracking_id: str):
    """Track parcel by tracking ID (public endpoint)"""
    try:
        parcel = await supabase_request(
            f"parcels?tracking_id=eq.{tracking_id}",
            "GET"
        )
        
        if not parcel or len(parcel) == 0:
            raise HTTPException(status_code=404, detail="Parcel not found")
        
        # Return limited information for public tracking
        parcel_data = parcel[0]
        return {
            "tracking_id": parcel_data.get("tracking_id"),
            "status": parcel_data.get("status"),
            "recipient_name": parcel_data.get("recipient_name"),
            "created_at": parcel_data.get("created_at"),
            "updated_at": parcel_data.get("updated_at")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/pickup-requests", response_model=PickupRequestResponse)
async def create_pickup_request(
    request_data: PickupRequestCreate,
    token: dict = Depends(verify_token)
):
    """Create a pickup request"""
    try:
        user_id = token.get("sub")
        
        pickup_data = request_data.dict()
        pickup_data.update({
            "merchant_id": user_id,
            "status": "pending",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        })
        
        result = await supabase_request(
            "pickup_requests",
            "POST",
            pickup_data
        )
        
        # Generate a UUID for the response if not provided
        import uuid
        pickup_id = result.get("id") if result and result.get("id") else str(uuid.uuid4())
        
        return {**pickup_data, "id": pickup_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/pickup-requests", response_model=List[PickupRequestResponse])
async def get_pickup_requests(token: dict = Depends(verify_token)):
    """Get pickup requests"""
    try:
        user_id = token.get("sub")
        user_role = token.get("role")
        
        if user_role == "admin":
            # Admin can see all pickup requests
            requests = await supabase_request("pickup_requests", "GET")
        else:
            # Merchant can only see their own requests
            requests = await supabase_request(
                f"pickup_requests?merchant_id=eq.{user_id}",
                "GET"
            )
        
        return requests or []
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/pickup-requests/{request_id}", response_model=PickupRequestResponse)
async def get_pickup_request(
    request_id: str,
    token: dict = Depends(verify_token)
):
    """Get specific pickup request details"""
    try:
        user_id = token.get("sub")
        user_role = token.get("role")
        
        request_data = await supabase_request(
            f"pickup_requests?id=eq.{request_id}",
            "GET"
        )
        
        if not request_data or len(request_data) == 0:
            raise HTTPException(status_code=404, detail="Pickup request not found")
        
        request = request_data[0]
        
        # Check permissions
        if user_role != "admin" and request.get("merchant_id") != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to view this request")
        
        return request
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/pickup-requests/{request_id}")
async def update_pickup_request(
    request_id: str,
    status: str,
    admin_notes: Optional[str] = None,
    token: dict = Depends(verify_token)
):
    """Update pickup request status (admin only)"""
    try:
        user_role = token.get("role")
        
        if user_role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Only admins can update pickup requests"
            )
        
        # Check if request exists
        existing_request = await supabase_request(
            f"pickup_requests?id=eq.{request_id}",
            "GET"
        )
        
        if not existing_request or len(existing_request) == 0:
            raise HTTPException(status_code=404, detail="Pickup request not found")
        
        # Valid statuses
        valid_statuses = ["pending", "approved", "rejected", "cancelled", "completed"]
        if status not in valid_statuses:
            raise HTTPException(status_code=400, detail="Invalid status")
        
        update_data = {
            "status": status,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        if admin_notes:
            update_data["admin_notes"] = admin_notes
        
        result = await supabase_request(
            f"pickup_requests?id=eq.{request_id}",
            "PUT",
            update_data
        )
        
        if not result:
            raise HTTPException(status_code=500, detail="Failed to update pickup request")
        
        return {"message": f"Pickup request status updated to {status}"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/pickup-requests/{request_id}")
async def delete_pickup_request(
    request_id: str,
    token: dict = Depends(verify_token)
):
    """Delete pickup request (only if status is pending)"""
    try:
        user_id = token.get("sub")
        user_role = token.get("role")
        
        # Check if request exists
        existing_request = await supabase_request(
            f"pickup_requests?id=eq.{request_id}",
            "GET"
        )
        
        if not existing_request or len(existing_request) == 0:
            raise HTTPException(status_code=404, detail="Pickup request not found")
        
        request = existing_request[0]
        
        # Only merchant or admin can delete
        if user_role != "admin" and request.get("merchant_id") != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this request")
        
        # Only allow deletion if status is pending
        if request.get("status") != "pending":
            raise HTTPException(status_code=400, detail="Can only delete requests with pending status")
        
        result = await supabase_request(
            f"pickup_requests?id=eq.{request_id}",
            "DELETE"
        )
        
        return {"message": "Pickup request deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/pickup-requests/{request_id}")
async def update_pickup_request(
    request_id: str,
    status: str,
    admin_notes: Optional[str] = None,
    token: dict = Depends(verify_token)
):
    """Update pickup request status (admin only)"""
    try:
        user_role = token.get("role")
        
        if user_role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Only admins can update pickup requests"
            )
        
        update_data = {
            "status": status,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        if admin_notes:
            update_data["admin_notes"] = admin_notes
        
        result = await supabase_request(
            f"pickup_requests?id=eq.{request_id}",
            "PUT",
            update_data
        )
        
        if not result:
            raise HTTPException(status_code=500, detail="Failed to update pickup request")
        
        return {"message": "Pickup request updated successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/stats")
async def get_admin_stats(token: dict = Depends(verify_token)):
    """Get admin dashboard statistics"""
    try:
        user_role = token.get("role")
        
        if user_role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )
        
        # Get counts from Supabase
        users = await supabase_request("profiles", "GET")
        parcels = await supabase_request("parcels", "GET")
        pickup_requests = await supabase_request("pickup_requests", "GET")
        
        stats = {
            "total_users": len(users) if users else 0,
            "total_parcels": len(parcels) if parcels else 0,
            "total_pickup_requests": len(pickup_requests) if pickup_requests else 0,
            "pending_pickups": len([r for r in (pickup_requests or []) if r.get("status") == "pending"]),
            "active_parcels": len([p for p in (parcels or []) if p.get("status") in ["assigned", "picked_up", "in_transit"]])
        }
        
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/merchant/stats")
async def get_merchant_stats(token: dict = Depends(verify_token)):
    """Get merchant dashboard statistics"""
    try:
        user_id = token.get("sub")
        user_role = token.get("role")
        
        if user_role == "admin":
            raise HTTPException(
                status_code=400,
                detail="Use /admin/stats for admin statistics"
            )
        
        # Get merchant's data
        parcels = await supabase_request(f"parcels?sender_id=eq.{user_id}", "GET")
        pickup_requests = await supabase_request(f"pickup_requests?merchant_id=eq.{user_id}", "GET")
        
        stats = {
            "total_parcels": len(parcels) if parcels else 0,
            "pending_parcels": len([p for p in (parcels or []) if p.get("status") == "pending"]),
            "in_transit_parcels": len([p for p in (parcels or []) if p.get("status") in ["assigned", "picked_up", "in_transit"]]),
            "delivered_parcels": len([p for p in (parcels or []) if p.get("status") == "delivered"]),
            "total_pickup_requests": len(pickup_requests) if pickup_requests else 0,
            "pending_pickup_requests": len([r for r in (pickup_requests or []) if r.get("status") == "pending"]),
            "approved_pickup_requests": len([r for r in (pickup_requests or []) if r.get("status") == "approved"])
        }
        
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/parcels/search")
async def search_parcels(
    tracking_id: Optional[str] = None,
    status: Optional[str] = None,
    recipient_name: Optional[str] = None,
    token: dict = Depends(verify_token)
):
    """Search parcels with filters"""
    try:
        user_id = token.get("sub")
        user_role = token.get("role")
        
        # Build query parameters
        query_params = []
        
        if tracking_id:
            query_params.append(f"tracking_id=eq.{tracking_id}")
        if status:
            query_params.append(f"status=eq.{status}")
        if recipient_name:
            query_params.append(f"recipient_name=ilike.*{recipient_name}*")
        
        # Add user restriction for non-admin users
        if user_role != "admin":
            query_params.append(f"sender_id=eq.{user_id}")
        
        # Build query string
        query_string = "&".join(query_params) if query_params else ""
        
        parcels = await supabase_request(f"parcels?{query_string}", "GET")
        return parcels or []
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# ================ ADMIN ROUTES ================

@app.get("/admin/dashboard")
async def get_admin_dashboard(token: dict = Depends(verify_admin)):
    """Get admin dashboard overview"""
    try:
        # Get all data for dashboard
        users = await supabase_request("profiles", "GET")
        parcels = await supabase_request("parcels", "GET")
        pickup_requests = await supabase_request("pickup_requests", "GET")
        couriers = await supabase_request("couriers", "GET")
        
        # Calculate statistics
        stats = {
            "total_merchants": len([u for u in (users or []) if u.get("role") == "merchant"]),
            "total_admins": len([u for u in (users or []) if u.get("role") == "admin"]),
            "total_parcels": len(parcels) if parcels else 0,
            "pending_parcels": len([p for p in (parcels or []) if p.get("status") == "pending"]),
            "in_transit_parcels": len([p for p in (parcels or []) if p.get("status") in ["assigned", "picked_up", "in_transit"]]),
            "delivered_parcels": len([p for p in (parcels or []) if p.get("status") == "delivered"]),
            "total_pickup_requests": len(pickup_requests) if pickup_requests else 0,
            "pending_pickup_requests": len([r for r in (pickup_requests or []) if r.get("status") == "pending"]),
            "approved_pickup_requests": len([r for r in (pickup_requests or []) if r.get("status") == "approved"]),
            "active_couriers": len([c for c in (couriers or []) if c.get("status") == "active"]) if couriers else 0,
        }
        
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/users")
async def get_all_users(token: dict = Depends(verify_admin)):
    """Get all users"""
    try:
        users = await supabase_request("profiles", "GET")
        return users or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/pickup-requests/pending")
async def get_pending_pickup_requests(token: dict = Depends(verify_admin)):
    """Get all pending pickup requests"""
    try:
        requests = await supabase_request("pickup_requests?status=eq.pending", "GET")
        return requests or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/admin/pickup-requests/{request_id}/approve")
async def approve_pickup_request(
    request_id: str,
    approval_data: PickupRequestUpdate,
    token: dict = Depends(verify_admin)
):
    """Approve pickup request"""
    try:
        update_data = {
            "status": "approved",
            "admin_notes": approval_data.admin_notes,
            "courier_id": approval_data.courier_id,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = await supabase_request(
            f"pickup_requests?id=eq.{request_id}",
            "PUT",
            update_data
        )
        
        return {"message": "Pickup request approved"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/admin/pickup-requests/{request_id}/reject")
async def reject_pickup_request(
    request_id: str,
    admin_notes: str,
    token: dict = Depends(verify_admin)
):
    """Reject pickup request"""
    try:
        update_data = {
            "status": "rejected",
            "admin_notes": admin_notes,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = await supabase_request(
            f"pickup_requests?id=eq.{request_id}",
            "PUT",
            update_data
        )
        
        return {"message": "Pickup request rejected"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/couriers")
async def get_couriers(token: dict = Depends(verify_admin)):
    """Get all couriers"""
    try:
        couriers = await supabase_request("couriers", "GET")
        return couriers or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/couriers")
async def create_courier(
    courier_data: CourierCreate,
    token: dict = Depends(verify_admin)
):
    """Create new courier"""
    try:
        courier_dict = courier_data.dict()
        courier_dict.update({
            "status": "active",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        })
        
        result = await supabase_request("couriers", "POST", courier_dict)
        
        import uuid
        courier_id = result.get("id") if result and result.get("id") else str(uuid.uuid4())
        
        return {**courier_dict, "id": courier_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/admin/parcels/{parcel_id}/assign")
async def assign_parcel_to_courier(
    parcel_id: str,
    courier_id: str,
    token: dict = Depends(verify_admin)
):
    """Assign parcel to courier"""
    try:
        # Update parcel status
        parcel_update = {
            "status": "assigned",
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = await supabase_request(
            f"parcels?id=eq.{parcel_id}",
            "PUT",
            parcel_update
        )
        
        return {"message": "Parcel assigned to courier successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/parcels/status/{status}")
async def get_parcels_by_status(
    status: str,
    token: dict = Depends(verify_token)
):
    """Get parcels by specific status"""
    try:
        user_id = token.get("sub")
        user_role = token.get("role")
        
        # Build query
        if user_role == "admin":
            parcels = await supabase_request(f"parcels?status=eq.{status}", "GET")
        else:
            parcels = await supabase_request(f"parcels?sender_id=eq.{user_id}&status=eq.{status}", "GET")
        
        return parcels or []
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

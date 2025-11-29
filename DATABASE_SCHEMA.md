# FastTrack Courier Database Schema

## Tables Overview

### Core Tables
1. **profiles** - User accounts (merchants and admins)
2. **parcels** - Package/shipment information
3. **pickup_requests** - Merchant requests for package pickup
4. **pickup_request_parcels** - Junction table linking pickup requests to parcels
5. **couriers** - Delivery personnel
6. **hubs** - Distribution centers
7. **parcel_assignments** - Assigns parcels to couriers
8. **tracking_updates** - Parcel status history
9. **payments** - Payment transactions
10. **support_tickets** - Customer support tickets

---

## Table Relationships Diagram

```
┌─────────────────┐
│    profiles     │
│  (Users/Auth)   │
│─────────────────│
│ id (PK)         │
│ email           │
│ full_name       │
│ role            │◄──────────────┐
│ business_name   │               │
└────────┬────────┘               │
         │                        │
         │ sender_id              │ merchant_id
         │                        │
         ▼                        ▼
┌─────────────────┐      ┌──────────────────┐
│    parcels      │      │ pickup_requests  │
│─────────────────│      │──────────────────│
│ id (PK)         │◄────┐│ id (PK)          │
│ tracking_id     │     ││ merchant_id (FK) │
│ sender_id (FK)  │     ││ pickup_address   │
│ recipient_name  │     ││ pickup_date      │
│ recipient_phone │     ││ status           │
│ origin_address  │     ││ courier_id (FK)  │
│ destination_addr│     │└──────────────────┘
│ status          │     │         │
│ weight          │     │         │
│ dimensions      │     │         │
└────────┬────────┘     │         │
         │              │         │
         │              │         │
         │              │         │
         │   ┌──────────┴─────────┴──────────┐
         │   │  pickup_request_parcels       │
         │   │  (Junction Table)              │
         │   │────────────────────────────────│
         │   │ id (PK)                        │
         └───┤ parcel_id (FK)                 │
             │ pickup_request_id (FK)         │
             │ UNIQUE(pickup_request_id,      │
             │        parcel_id)              │
             └────────────────────────────────┘


┌─────────────────┐
│    couriers     │
│─────────────────│
│ id (PK)         │◄────┐
│ full_name       │     │
│ phone           │     │
│ vehicle_type    │     │
│ status          │     │
└─────────────────┘     │
                        │ courier_id
                        │
              ┌─────────┴──────────┐
              │ parcel_assignments │
              │────────────────────│
              │ id (PK)            │
              │ parcel_id (FK)     │
              │ courier_id (FK)    │
              │ hub_id (FK)        │
              │ status             │
              └────────────────────┘
                        │
                        │ hub_id
                        ▼
              ┌─────────────────┐
              │      hubs       │
              │─────────────────│
              │ id (PK)         │
              │ name            │
              │ address         │
              │ manager_id (FK) │
              └─────────────────┘


┌─────────────────┐
│    parcels      │
│─────────────────│
│ id (PK)         │◄────┐
└─────────────────┘     │
                        │ parcel_id
              ┌─────────┴──────────┐
              │ tracking_updates   │
              │────────────────────│
              │ id (PK)            │
              │ parcel_id (FK)     │
              │ status             │
              │ location           │
              │ timestamp          │
              │ updated_by (FK)    │
              └────────────────────┘


┌─────────────────┐
│    parcels      │
│─────────────────│
│ id (PK)         │◄────┐
└─────────────────┘     │
                        │ parcel_id
              ┌─────────┴──────────┐
              │     payments       │
              │────────────────────│
              │ id (PK)            │
              │ parcel_id (FK)     │
              │ amount             │
              │ payment_method     │
              │ status             │
              │ transaction_id     │
              └────────────────────┘


┌─────────────────┐
│    profiles     │
│─────────────────│
│ id (PK)         │◄────┐
└─────────────────┘     │
                        │ user_id
              ┌─────────┴──────────┐
              │ support_tickets    │
              │────────────────────│
              │ id (PK)            │
              │ user_id (FK)       │
              │ subject            │
              │ description        │
              │ priority           │
              │ status             │
              │ assigned_to (FK)   │
              └────────────────────┘
```

---

## Key Relationships

### 1. **Profiles → Parcels** (One-to-Many)
- One merchant can create many parcels
- `parcels.sender_id` → `profiles.id`

### 2. **Profiles → Pickup Requests** (One-to-Many)
- One merchant can create many pickup requests
- `pickup_requests.merchant_id` → `profiles.id`

### 3. **Pickup Requests ↔ Parcels** (Many-to-Many via Junction Table)
- One pickup request can include multiple parcels
- One parcel can be in one pickup request
- Junction table: `pickup_request_parcels`
  - `pickup_request_parcels.pickup_request_id` → `pickup_requests.id`
  - `pickup_request_parcels.parcel_id` → `parcels.id`
  - **UNIQUE constraint** ensures a parcel can't be added to the same pickup request twice

### 4. **Couriers → Pickup Requests** (One-to-Many)
- One courier can be assigned to many pickup requests
- `pickup_requests.courier_id` → `couriers.id`

### 5. **Parcels → Parcel Assignments** (One-to-Many)
- One parcel can have multiple assignments (history)
- `parcel_assignments.parcel_id` → `parcels.id`

### 6. **Couriers → Parcel Assignments** (One-to-Many)
- One courier can have many parcel assignments
- `parcel_assignments.courier_id` → `couriers.id`

### 7. **Hubs → Parcel Assignments** (One-to-Many)
- One hub can have many parcel assignments
- `parcel_assignments.hub_id` → `hubs.id`

### 8. **Parcels → Tracking Updates** (One-to-Many)
- One parcel can have many tracking updates (status history)
- `tracking_updates.parcel_id` → `parcels.id`

### 9. **Parcels → Payments** (One-to-Many)
- One parcel can have multiple payment records
- `payments.parcel_id` → `parcels.id`

### 10. **Profiles → Support Tickets** (One-to-Many)
- One user can create many support tickets
- `support_tickets.user_id` → `profiles.id`

---

## Important Business Rules

### Parcel Workflow
1. **Merchant creates parcel** → Status: `pending`
2. **Merchant creates pickup request** → Links parcels via junction table
3. **Admin approves pickup request** → Assigns courier
4. **Courier picks up parcels** → Status: `picked_up`
5. **Parcel in transit** → Status: `in_transit`
6. **Parcel delivered** → Status: `delivered`

### Junction Table Rules
- A parcel can only be in ONE pickup request at a time
- Once a parcel is in a pickup request, it cannot be added to another
- The `UNIQUE(pickup_request_id, parcel_id)` constraint enforces this
- Only parcels with status `pending` should be available for pickup requests

### Row Level Security (RLS)
- **Merchants** can only see/modify their own parcels and pickup requests
- **Admins** can see/modify everything
- **Service key** (backend API) bypasses RLS for operations

---

## Status Values

### Parcel Status
- `pending` - Created, waiting for pickup
- `picked_up` - Collected by courier
- `in_transit` - On the way to destination
- `delivered` - Successfully delivered
- `returned` - Returned to sender
- `cancelled` - Cancelled by merchant/admin

### Pickup Request Status
- `pending` - Waiting for admin approval
- `approved` - Approved by admin, courier assigned
- `rejected` - Rejected by admin
- `completed` - Pickup completed

### Courier Status
- `active` - Available for assignments
- `inactive` - Not available
- `busy` - Currently on delivery

### Payment Status
- `pending` - Payment not yet processed
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

---

## Indexes for Performance

All foreign keys have indexes:
- `idx_parcels_sender_id`
- `idx_parcels_tracking_id`
- `idx_pickup_requests_merchant_id`
- `idx_pickup_request_parcels_pickup_request_id`
- `idx_pickup_request_parcels_parcel_id`
- `idx_tracking_updates_parcel_id`
- `idx_payments_parcel_id`

Status fields also have indexes for filtering:
- `idx_parcels_status`
- `idx_pickup_requests_status`
- `idx_couriers_status`

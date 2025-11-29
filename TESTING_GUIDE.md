# Complete Testing Guide

## 🧪 Test All Features

This guide will help you test all the fixes and new features we implemented.

---

## Prerequisites

### 1. Make sure Docker is running
```bash
docker ps
```
Should show 3 containers running:
- `fasttrack_frontend`
- `fasttrack_backend`
- `fasttrack_chatbot`

### 2. Apply all changes
```bash
# Stop containers
docker-compose down

# Rebuild frontend (for hardcoded IP fixes)
docker-compose build frontend

# Start everything
docker-compose up -d

# Check logs
docker logs fasttrack_backend
docker logs fasttrack_frontend
```

---

## Test 1: Public Tracking (No Login Required) ✅

### Purpose: Verify anyone can track parcels without logging in

**Steps:**

1. **Open incognito/private browser window** (to ensure no login)
2. Go to: `http://localhost:3000`
3. Scroll down to "Track Your Delivery" section
4. Enter a tracking ID (you'll get one from Test 2)
5. Click "Track" button

**Expected Result:**
- ✅ Redirects to tracking page
- ✅ Shows parcel status
- ✅ Shows recipient name
- ✅ Shows created/updated dates
- ✅ No login required

**Alternative Test:**
- Go directly to: `http://localhost:3000/tracking/FT12345678`
- Should show tracking page (or "not found" if tracking ID doesn't exist)

---

## Test 2: Add Parcel ✅

### Purpose: Verify parcel creation works on any network

**Steps:**

1. **Login as merchant**
   - Go to: `http://localhost:3000/login`
   - Email: `merchant@example.com` (or your merchant account)
   - Password: Your password

2. **Navigate to Parcels**
   - Click "Dashboard" in navigation
   - Click "Parcels" in sidebar (or go to `/dashboard/parcels`)

3. **Create New Parcel**
   - Click "Create Parcel" button
   - Fill in the form:
     - **Recipient Name**: John Doe
     - **Phone**: +1234567890
     - **Address**: 123 Main Street, City, State, ZIP
     - **Package Type**: Select any (e.g., "Electronics")
     - **Weight**: 2.5 kg
     - **Dimensions**: 30 x 20 x 15 cm
     - **Description**: Test parcel (optional)
   - Click "Create Parcel"

**Expected Result:**
- ✅ Success message appears
- ✅ Shows tracking ID (e.g., `FT12AB34CD`)
- ✅ Parcel appears in the list
- ✅ Status shows "Pending" with yellow badge
- ✅ **Copy the tracking ID for next tests**

**If Email is Configured:**
- ✅ Check merchant's email inbox
- ✅ Should receive "Parcel Created" email
- ✅ Email contains tracking ID
- ✅ Email has "Track Your Parcel" button

**Troubleshooting:**
- If error occurs, check browser console (F12)
- Check backend logs: `docker logs fasttrack_backend`
- Verify API URL is correct in `.env`

---

## Test 3: Track the Created Parcel ✅

### Purpose: Verify public tracking works with real parcel

**Steps:**

1. **Copy tracking ID from Test 2** (e.g., `FT12AB34CD`)
2. **Open new incognito window** (no login)
3. Go to: `http://localhost:3000`
4. Scroll to "Track Your Delivery"
5. Enter the tracking ID
6. Click "Track"

**Expected Result:**
- ✅ Shows tracking page
- ✅ Status: "Pending" with yellow badge
- ✅ Recipient name: "John Doe"
- ✅ Created date shown
- ✅ No sensitive information (no sender details, no full address)

---

## Test 4: Update Parcel Status (Admin) ✅

### Purpose: Verify status updates work and trigger emails

**Steps:**

1. **Login as admin**
   - Go to: `http://localhost:3000/login`
   - Email: `admin@fasttrack.com` (or your admin account)
   - Password: Your password

2. **Navigate to Admin Dashboard**
   - Click "Dashboard"
   - Should see admin dashboard with statistics

3. **Find the Parcel**
   - Go to "Parcels" section
   - Find the parcel created in Test 2

4. **Update Status**
   - Click on the parcel or "Edit" button
   - Change status from "Pending" to "Assigned"
   - Optionally add notes: "Assigned to courier John"
   - Click "Update" or "Save"

**Expected Result:**
- ✅ Status updated successfully
- ✅ Parcel shows "Assigned" with blue badge
- ✅ Updated timestamp changes

**If Email is Configured:**
- ✅ Check merchant's email inbox
- ✅ Should receive "Status Update" email
- ✅ Email shows: Pending → Assigned
- ✅ Email includes admin notes (if added)
- ✅ Email has "Track Your Parcel" button

---

## Test 5: Track Updated Parcel ✅

### Purpose: Verify tracking shows updated status

**Steps:**

1. **Use same tracking ID from Test 2**
2. **Open incognito window** (no login)
3. Go to: `http://localhost:3000/tracking/FT12AB34CD`

**Expected Result:**
- ✅ Status now shows "Assigned" with blue badge
- ✅ Updated timestamp is recent
- ✅ Status description updated

---

## Test 6: Multiple Status Changes ✅

### Purpose: Verify email notifications for each status change

**Steps:**

1. **Login as admin**
2. **Update parcel status multiple times:**
   - Assigned → Picked Up
   - Picked Up → In Transit
   - In Transit → Delivered

**Expected Result:**
- ✅ Each status update succeeds
- ✅ Status badge color changes appropriately:
  - Picked Up: Purple
  - In Transit: Indigo
  - Delivered: Green

**If Email is Configured:**
- ✅ Merchant receives 3 separate emails
- ✅ Each email shows correct status transition
- ✅ Each email has correct color badge

---

## Test 7: Email Configuration (Optional) ✅

### Purpose: Verify email notifications work

**Only if you configured email in `.env`**

**Steps:**

1. **Check backend logs**
   ```bash
   docker logs fasttrack_backend | grep -i email
   ```

2. **Look for:**
   - ✅ `✅ Email sent to merchant@example.com: Parcel Created`
   - ✅ `✅ Email sent to merchant@example.com: Status Update`

3. **Check merchant's email inbox**
   - ✅ "Parcel Created" email received
   - ✅ "Status Update" emails received
   - ✅ Emails not in spam folder
   - ✅ Tracking links work when clicked

**If Email NOT Configured:**
- ⚠️ Logs show: `⚠️ Email not configured. Would have sent to...`
- ✅ This is normal - system works without email

---

## Test 8: Different Network Access ✅

### Purpose: Verify system works on different networks

**Steps:**

1. **Find your machine's IP address**
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. **Update `.env` file** (root directory)
   ```env
   NEXT_PUBLIC_API_URL=http://YOUR_IP:8000
   ```

3. **Rebuild frontend**
   ```bash
   docker-compose build frontend
   docker-compose up -d
   ```

4. **Test from another device on same network**
   - Open browser on phone/tablet
   - Go to: `http://YOUR_IP:3000`
   - Try creating parcel
   - Try tracking parcel

**Expected Result:**
- ✅ Works from any device on same network
- ✅ No hardcoded IP errors
- ✅ All features work

---

## Test 9: Parcel List Features ✅

### Purpose: Verify parcel list functionality

**Steps:**

1. **Login as merchant**
2. **Go to Parcels page**
3. **Test search:**
   - Search by tracking ID
   - Search by recipient name
   - ✅ Results filter correctly

4. **Test status filter:**
   - Filter by "Pending"
   - Filter by "Assigned"
   - Filter by "All Statuses"
   - ✅ Results filter correctly

5. **Test actions:**
   - View parcel details
   - Edit pending parcel
   - Delete pending parcel
   - ✅ All actions work

---

## Test 10: Pickup Request (Bonus) ✅

### Purpose: Verify pickup request functionality

**Steps:**

1. **Login as merchant**
2. **Create a parcel** (if not already done)
3. **Create pickup request:**
   - Click shopping cart icon on pending parcel
   - Fill in pickup details:
     - Address
     - Date
     - Time slot
   - Submit

**Expected Result:**
- ✅ Pickup request created
- ✅ Parcel linked to pickup request
- ✅ Shows in pickup requests list

---

## 🐛 Troubleshooting

### Issue: "Failed to create parcel"

**Check:**
1. Backend is running: `docker ps`
2. Backend logs: `docker logs fasttrack_backend`
3. Browser console (F12) for errors
4. Network tab shows API call to correct URL

**Solution:**
- Verify `NEXT_PUBLIC_API_URL` in `.env`
- Restart frontend: `docker-compose restart frontend`

---

### Issue: "Tracking not found"

**Check:**
1. Tracking ID is correct (case-sensitive)
2. Parcel exists in database
3. Backend is accessible

**Solution:**
- Verify tracking ID
- Check backend: `http://localhost:8000/health`

---

### Issue: Emails not sending

**Check:**
1. SMTP credentials in `backend/.env`
2. Backend logs: `docker logs fasttrack_backend | grep -i email`

**Solution:**
- Verify SMTP settings
- Test with Outlook (easier than Gmail)
- Or skip email setup (system works without it)

---

### Issue: "Network error" or "Connection refused"

**Check:**
1. All containers running: `docker ps`
2. Ports not blocked by firewall
3. Correct URLs in `.env`

**Solution:**
```bash
# Restart everything
docker-compose down
docker-compose up -d

# Check container health
docker ps
docker logs fasttrack_backend
docker logs fasttrack_frontend
```

---

## ✅ Success Checklist

After completing all tests, you should have:

- [ ] Created parcel successfully
- [ ] Received tracking ID
- [ ] Tracked parcel without login (public tracking)
- [ ] Updated parcel status (as admin)
- [ ] Verified status changes reflect in tracking
- [ ] Received email notifications (if configured)
- [ ] Tested from different network (optional)
- [ ] All features work without errors

---

## 📊 Test Results Summary

| Test | Feature | Status |
|------|---------|--------|
| 1 | Public Tracking | ⬜ |
| 2 | Add Parcel | ⬜ |
| 3 | Track Created Parcel | ⬜ |
| 4 | Update Status (Admin) | ⬜ |
| 5 | Track Updated Parcel | ⬜ |
| 6 | Multiple Status Changes | ⬜ |
| 7 | Email Notifications | ⬜ |
| 8 | Different Network | ⬜ |
| 9 | Parcel List Features | ⬜ |
| 10 | Pickup Request | ⬜ |

Check off each test as you complete it!

---

## 🎉 All Tests Passed?

Congratulations! Your FastTrack Courier system is fully functional with:

✅ Public tracking (no login required)
✅ Parcel creation (works on any network)
✅ Status updates
✅ Email notifications (optional)
✅ Multi-network support
✅ No hardcoded IPs

---

## 📞 Need Help?

If any test fails:

1. Check the specific troubleshooting section above
2. Review backend logs: `docker logs fasttrack_backend`
3. Review frontend logs: `docker logs fasttrack_frontend`
4. Check browser console (F12)
5. Verify `.env` configuration

**Common Issues:**
- Hardcoded IPs → Rebuild frontend
- Email not working → Use Outlook or skip email
- Network errors → Check Docker containers running
- Database errors → Check Supabase connection

---

## Summary

**Quick Test (5 minutes):**
1. Create parcel (Test 2)
2. Track parcel (Test 3)
3. Update status (Test 4)
4. Verify tracking updated (Test 5)

**Full Test (15 minutes):**
- Complete all 10 tests
- Verify email notifications
- Test from different device

**Result:** Fully functional courier system! 🚀

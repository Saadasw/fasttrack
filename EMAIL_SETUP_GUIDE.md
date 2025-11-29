# Email Notification Setup Guide

## Overview

FastTrack Courier now supports **automatic email notifications** sent from admin email to merchant email when:
1. ✅ A new parcel is created
2. ✅ Parcel status changes (pending → assigned → picked_up → in_transit → delivered)

---

## 🎯 Features

### Email Notifications Sent:

**1. Parcel Created Email**
- Sent when merchant creates a new parcel
- Includes tracking ID, recipient details
- Provides tracking link to share with customers

**2. Status Change Email**
- Sent when admin updates parcel status
- Shows old status → new status
- Color-coded status badges
- Includes tracking link
- Optional admin notes

### Email Content:
- ✅ Professional HTML design
- ✅ Mobile-responsive
- ✅ Color-coded status badges
- ✅ Clickable tracking links
- ✅ Plain text fallback
- ✅ Branded with FastTrack Courier

---

## 📧 Email Configuration

### Option 1: Gmail (Recommended for Testing)

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com
2. Click "Security" in the left menu
3. Under "Signing in to Google", click "2-Step Verification"
4. Follow the steps to enable 2FA

#### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Enter "FastTrack Courier"
4. Click "Generate"
5. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

#### Step 3: Update .env File
```env
# In backend/.env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
ADMIN_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:3000
```

**Important**: 
- Remove spaces from app password: `abcd efgh ijkl mnop` → `abcdefghijklmnop`
- Use the app password, NOT your regular Gmail password

---

### Option 2: Other Email Providers

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USERNAME=your-email@outlook.com
SMTP_PASSWORD=your-password
ADMIN_EMAIL=your-email@outlook.com
```

#### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USERNAME=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=your-email@yahoo.com
```

#### Custom SMTP Server
```env
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_USERNAME=noreply@yourdomain.com
SMTP_PASSWORD=your-password
ADMIN_EMAIL=admin@yourdomain.com
```

---

## 🚀 Setup Instructions

### Step 1: Update Environment Variables

Edit `backend/.env`:
```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@fasttrack.com
FRONTEND_URL=http://localhost:3000
```

### Step 2: Restart Backend

**If using Docker:**
```bash
docker-compose restart backend
```

**If running locally:**
```bash
cd backend
# Stop the server (Ctrl+C)
python main.py
```

### Step 3: Test Email Notifications

#### Test 1: Parcel Creation Email
1. Login as merchant
2. Create a new parcel
3. Check merchant's email inbox
4. Should receive "Parcel Created" email with tracking ID

#### Test 2: Status Change Email
1. Login as admin
2. Go to admin dashboard
3. Update a parcel status (e.g., pending → assigned)
4. Check merchant's email inbox
5. Should receive "Status Update" email

---

## 📋 Email Templates

### 1. Parcel Created Email

**Subject**: `Parcel Created: FT12AB34CD`

**Content**:
- ✅ Green header "Parcel Created!"
- Tracking ID in highlighted box
- Recipient name and address
- Current status badge
- "Track Your Parcel" button
- Tip to share tracking link with customer

### 2. Status Change Email

**Subject**: `Parcel Status Update: FT12AB34CD - In Transit`

**Content**:
- Blue header "Parcel Status Update"
- Color-coded status badge
- Status description
- Parcel details table (tracking ID, recipient, old status, new status)
- Optional admin notes (if provided)
- "Track Your Parcel" button
- Timestamp

### Status Colors:
- 🟡 **Pending** - Yellow/Orange
- 🔵 **Assigned** - Blue
- 🟣 **Picked Up** - Purple
- 🔵 **In Transit** - Indigo
- 🟢 **Delivered** - Green
- 🔴 **Returned** - Red
- ⚫ **Cancelled** - Gray

---

## 🔧 Troubleshooting

### Issue: "Email not configured" message in logs

**Solution**: Check that SMTP_USERNAME and SMTP_PASSWORD are set in `.env`

```bash
# Check if variables are set
docker exec fasttrack_backend env | grep SMTP
```

### Issue: "Authentication failed" error

**Possible causes**:
1. **Wrong password** - Make sure you're using App Password, not regular password
2. **Spaces in password** - Remove all spaces from app password
3. **2FA not enabled** - Enable 2-Factor Authentication first
4. **Less secure apps** - For Gmail, use App Password instead

**Solution**:
```bash
# Regenerate app password
# Go to: https://myaccount.google.com/apppasswords
# Delete old password and create new one
```

### Issue: Emails going to spam

**Solutions**:
1. Add sender email to contacts
2. Mark email as "Not Spam"
3. Use a custom domain email (not Gmail)
4. Set up SPF/DKIM records (advanced)

### Issue: Emails not sending but no error

**Check**:
1. SMTP port is correct (587 for TLS, 465 for SSL)
2. Firewall allows outbound connections on SMTP port
3. Email provider allows SMTP access
4. Check backend logs: `docker logs fasttrack_backend`

---

## 🧪 Testing Without Email Setup

If you don't want to configure email yet, the system will still work:

- ✅ Parcels will be created normally
- ✅ Status updates will work
- ⚠️ Emails won't be sent (logged to console instead)
- Console will show: `⚠️ Email not configured. Would have sent to...`

This allows you to test the system without email setup.

---

## 🔒 Security Best Practices

### 1. Use App Passwords
- ✅ Never use your main email password
- ✅ Use app-specific passwords
- ✅ Revoke app passwords when not needed

### 2. Environment Variables
- ✅ Never commit `.env` file to git
- ✅ Keep `.env.example` without real credentials
- ✅ Use different credentials for production

### 3. Email Rate Limits
- Gmail: 500 emails/day for free accounts
- Consider using dedicated email service for production:
  - SendGrid (100 emails/day free)
  - Mailgun (5,000 emails/month free)
  - Amazon SES (62,000 emails/month free)

---

## 📊 Email Notification Flow

```
┌─────────────────────┐
│  Merchant Creates   │
│      Parcel         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Backend Saves to   │
│     Database        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Send "Parcel       │
│  Created" Email     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Merchant Receives  │
│  Email with         │
│  Tracking ID        │
└─────────────────────┘


┌─────────────────────┐
│  Admin Updates      │
│  Parcel Status      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Backend Updates    │
│     Database        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Send "Status       │
│  Change" Email      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Merchant Receives  │
│  Email with New     │
│  Status             │
└─────────────────────┘
```

---

## 🎨 Customization

### Change Email Templates

Edit `backend/email_service.py`:

**Change colors**:
```python
# Line ~150 - Header color
<td style="background-color: #2563eb; ...">  # Change #2563eb to your color
```

**Change company name**:
```python
# Line ~155
<h1 style="color: #ffffff; ...">FastTrack Courier</h1>
```

**Change button text**:
```python
# Line ~250
Track Your Parcel  # Change to your text
```

### Add More Email Types

Add new functions in `backend/email_service.py`:
```python
def send_delivery_confirmation_email(...):
    # Your custom email
    pass
```

---

## 📱 Example Emails

### Parcel Created Email Preview:
```
┌────────────────────────────────────┐
│     ✅ Parcel Created!             │
│  Your parcel has been registered   │
├────────────────────────────────────┤
│                                    │
│  Hello John Merchant,              │
│                                    │
│  Your parcel has been successfully │
│  created and registered.           │
│                                    │
│  ┌──────────────────────────────┐ │
│  │    TRACKING ID               │ │
│  │    FT12AB34CD                │ │
│  └──────────────────────────────┘ │
│                                    │
│  Recipient: Jane Customer          │
│  Destination: 123 Main St          │
│  Status: ⏳ PENDING                │
│                                    │
│  [Track Your Parcel]               │
│                                    │
└────────────────────────────────────┘
```

### Status Change Email Preview:
```
┌────────────────────────────────────┐
│   Parcel Status Update             │
├────────────────────────────────────┤
│                                    │
│      🚚 In Transit                 │
│                                    │
│  Hello John Merchant,              │
│                                    │
│  Your parcel is on its way to      │
│  the destination.                  │
│                                    │
│  Tracking ID: FT12AB34CD           │
│  Recipient: Jane Customer          │
│  Previous: Picked Up               │
│  Updated: Nov 28, 2025 10:30 AM    │
│                                    │
│  [Track Your Parcel]               │
│                                    │
└────────────────────────────────────┘
```

---

## ✅ Checklist

Before going live with email notifications:

- [ ] Gmail 2FA enabled
- [ ] App password generated
- [ ] `.env` file updated with SMTP credentials
- [ ] Backend restarted
- [ ] Test email sent successfully
- [ ] Emails not going to spam
- [ ] Tracking links work correctly
- [ ] Email templates look good on mobile
- [ ] Admin email address is correct
- [ ] Frontend URL is correct in emails

---

## 🚀 Production Recommendations

For production use, consider:

1. **Use dedicated email service**:
   - SendGrid
   - Mailgun
   - Amazon SES
   - Postmark

2. **Set up custom domain**:
   - Use `noreply@yourdomain.com`
   - Set up SPF, DKIM, DMARC records
   - Improves deliverability

3. **Add email queue**:
   - Use Celery or RQ for async email sending
   - Prevents blocking API requests
   - Retry failed emails

4. **Monitor email delivery**:
   - Track open rates
   - Track click rates
   - Monitor bounce rates

5. **Add unsubscribe option**:
   - Allow merchants to opt-out
   - Store preferences in database

---

## 📞 Support

If you need help setting up email notifications:

1. Check backend logs: `docker logs fasttrack_backend`
2. Test SMTP connection manually
3. Verify environment variables are loaded
4. Check firewall settings

**Common Gmail Issues**:
- https://support.google.com/accounts/answer/185833
- https://support.google.com/mail/answer/7126229

---

## Summary

✅ **Email notifications are now implemented!**

**What works**:
- Automatic emails on parcel creation
- Automatic emails on status changes
- Professional HTML templates
- Mobile-responsive design
- Tracking links included
- No database changes needed

**To enable**:
1. Set up Gmail app password
2. Update `backend/.env`
3. Restart backend
4. Test by creating/updating parcels

**Optional**: Works without email setup (logs to console instead)

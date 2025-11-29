 # Quick Start: Email Notifications (5 Minutes)

## ✅ Yes! Email notifications are now implemented!

Merchants will receive emails from admin email when:
- ✅ They create a new parcel (with tracking ID)
- ✅ Admin changes parcel status (with status update)

---

## 🚀 Setup in 4 Steps

### Option A: Gmail (Requires 2FA)

**Step 1: Get Gmail App Password (2 min)**

1. Go to: **https://myaccount.google.com/apppasswords**
2. If asked, enable 2-Factor Authentication first
3. Select "Mail" and "Other (Custom name)"
4. Type: "FastTrack Courier"
5. Click "Generate"
6. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

**⚠️ If you see "Setting not available"**: You need to enable 2FA first, or use Option B below.

---

### Option B: Outlook (Easiest - No 2FA Required!)

**Step 1: Create Outlook Account (2 min)**

1. Go to: **https://outlook.live.com/owa/**
2. Click "Create free account"
3. Choose email (e.g., fasttrack.courier@outlook.com)
4. Set password and complete verification

**Step 2: Use Outlook Credentials**

No app password needed! Just use your regular Outlook password.

---

### Step 2: Update .env File (1 min)

**For Gmail:**
```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:3000
```

**For Outlook (Easier!):**

Open `backend/.env` and add these lines at the end:

```env
# Email Configuration
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USERNAME=fasttrack.courier@outlook.com
SMTP_PASSWORD=your-outlook-password
ADMIN_EMAIL=fasttrack.courier@outlook.com
FRONTEND_URL=http://localhost:3000
```

**Important**: 
- Replace with your actual Outlook email and password
- Use your regular password (no app password needed!)
- Much easier than Gmail!

### Step 3: Restart Backend (1 min)

```bash
docker-compose restart backend
```

### Step 4: Test It! (1 min)

1. Login as merchant at `http://localhost:3000/login`
2. Create a new parcel
3. Check your email inbox
4. ✅ You should receive "Parcel Created" email!

---

## 📧 What Emails Look Like

### Email 1: Parcel Created
- **Subject**: Parcel Created: FT12AB34CD
- **Content**: 
  - Green header "✅ Parcel Created!"
  - Tracking ID in big box
  - Recipient details
  - "Track Your Parcel" button
  - Tip to share tracking link

### Email 2: Status Changed
- **Subject**: Parcel Status Update: FT12AB34CD - In Transit
- **Content**:
  - Blue header "Parcel Status Update"
  - Color-coded status badge (🚚 In Transit)
  - Old status → New status
  - "Track Your Parcel" button
  - Timestamp

---

## ⚠️ Important Notes

### 1. Use App Password (Not Regular Password!)
- ❌ Regular Gmail password won't work
- ✅ Must use 16-character app password
- ✅ Must enable 2FA first

### 2. Works Without Email Setup
- If you don't configure email, system still works
- Parcels are created normally
- Status updates work normally
- Emails just won't be sent (logged to console)

### 3. No Database Changes
- ✅ Zero database changes needed
- ✅ All changes in application code only
- ✅ Can disable anytime by removing SMTP settings

---

## 🐛 Troubleshooting

### Problem: "Authentication failed"
**Solution**: 
- Make sure you're using app password, not regular password
- Remove all spaces from app password
- Enable 2FA on your Google account first

### Problem: Emails not sending
**Check**:
```bash
# View backend logs
docker logs fasttrack_backend

# Check if SMTP is configured
docker exec fasttrack_backend env | grep SMTP
```

### Problem: Emails going to spam
**Solution**:
- Add sender email to your contacts
- Mark email as "Not Spam"
- Check spam folder first time

---

## ✅ Testing Checklist

- [ ] Gmail app password generated
- [ ] `.env` file updated
- [ ] Backend restarted
- [ ] Created test parcel
- [ ] Received "Parcel Created" email
- [ ] Updated parcel status (as admin)
- [ ] Received "Status Update" email
- [ ] Tracking links work in emails
- [ ] Emails look good on mobile

---

## 📱 Example Email Preview

```
┌─────────────────────────────────────┐
│  FastTrack Courier                  │
│  Parcel Status Update               │
├─────────────────────────────────────┤
│                                     │
│       🚚 In Transit                 │
│                                     │
│  Hello John Merchant,               │
│                                     │
│  Your parcel is on its way to       │
│  the destination.                   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Tracking ID: FT12AB34CD       │ │
│  │ Recipient: Jane Customer      │ │
│  │ Previous: Picked Up           │ │
│  │ Updated: Nov 28, 2025 10:30AM │ │
│  └───────────────────────────────┘ │
│                                     │
│     [Track Your Parcel]             │
│                                     │
│  Track at: localhost:3000/tracking/ │
│            FT12AB34CD               │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎯 What Happens Now

### When Merchant Creates Parcel:
1. Parcel saved to database ✅
2. Tracking ID generated ✅
3. Email sent to merchant ✅
4. Merchant receives email with tracking ID ✅
5. Merchant can share tracking link with customer ✅

### When Admin Updates Status:
1. Status updated in database ✅
2. Email sent to merchant ✅
3. Merchant receives email with new status ✅
4. Merchant knows parcel progress ✅

---

## 🚀 Ready to Use!

That's it! Email notifications are now working.

**Files created:**
- ✅ `backend/email_service.py` - Email service
- ✅ `EMAIL_SETUP_GUIDE.md` - Detailed guide
- ✅ `EMAIL_FEATURE_SUMMARY.md` - Feature overview
- ✅ `QUICK_START_EMAIL.md` - This file

**Files modified:**
- ✅ `backend/main.py` - Added email triggers
- ✅ `backend/.env` - Added SMTP config
- ✅ `backend/.env.example` - Added SMTP template

**To apply:**
```bash
# Just restart backend
docker-compose restart backend

# Or rebuild if needed
docker-compose build backend
docker-compose up -d
```

**Test it:**
1. Create parcel → Check email ✅
2. Update status → Check email ✅

Done! 🎉

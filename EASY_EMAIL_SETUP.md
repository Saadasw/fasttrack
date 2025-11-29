# Super Easy Email Setup (2 Minutes)

## Problem: Gmail App Passwords Not Available

**Solution: Use Outlook Instead!** (No 2FA, no app passwords needed)

---

## 🚀 Quick Setup with Outlook

### Step 1: Create Free Outlook Account (1 minute)

1. Go to: **https://outlook.live.com/owa/**
2. Click **"Create free account"**
3. Choose an email address:
   - Example: `fasttrack.courier@outlook.com`
   - Or: `yourname.fasttrack@outlook.com`
4. Create a password
5. Complete the verification (phone or email)
6. Done! ✅

### Step 2: Update .env File (30 seconds)

Open `backend/.env` and add these lines at the end:

```env
# Email Configuration
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USERNAME=fasttrack.courier@outlook.com
SMTP_PASSWORD=YourOutlookPassword123
ADMIN_EMAIL=fasttrack.courier@outlook.com
FRONTEND_URL=http://localhost:3000
```

**Replace**:
- `fasttrack.courier@outlook.com` → Your Outlook email
- `YourOutlookPassword123` → Your Outlook password

### Step 3: Restart Backend (30 seconds)

```bash
docker-compose restart backend
```

### Step 4: Test It!

1. Login to FastTrack as merchant
2. Create a new parcel
3. Check your Outlook inbox
4. ✅ You should see "Parcel Created" email!

---

## That's It! 🎉

**Total time: 2 minutes**

No 2FA, no app passwords, no complicated setup!

---

## Alternative: Test Without Email (0 minutes)

Don't want to set up email right now? No problem!

**Just skip the email setup** - the system will work normally:
- ✅ Parcels are created
- ✅ Status updates work
- ⚠️ Emails are logged to console instead of sending

To see the logs:
```bash
docker logs fasttrack_backend
```

You'll see messages like:
```
⚠️ Email not configured. Would have sent to merchant@example.com: Parcel Created: FT12AB34CD
```

---

## Troubleshooting

### "Authentication failed" with Outlook

**Solution 1**: Verify password
- Try logging into https://outlook.live.com with same credentials
- If login works there, password is correct

**Solution 2**: Check .env file
- Make sure no extra spaces
- Make sure quotes are not included
- Example: `SMTP_PASSWORD=MyPass123` (no quotes)

### Still not working?

**Check backend logs**:
```bash
docker logs fasttrack_backend
```

Look for lines with "Email" or "SMTP" to see what's happening.

---

## Why Outlook is Easier

| Feature | Gmail | Outlook |
|---------|-------|---------|
| 2FA Required | ✅ Yes | ❌ No |
| App Password | ✅ Yes | ❌ No |
| Setup Time | 5 min | 2 min |
| Complexity | Medium | Easy |

**Recommendation**: Use Outlook for quick setup!

---

## What Emails Look Like

### Email 1: Parcel Created
```
From: FastTrack Courier <fasttrack.courier@outlook.com>
To: merchant@example.com
Subject: Parcel Created: FT12AB34CD

✅ Parcel Created!

Hello John Merchant,

Your parcel has been successfully created!

TRACKING ID: FT12AB34CD

Recipient: Jane Customer
Status: ⏳ PENDING

[Track Your Parcel]
```

### Email 2: Status Changed
```
From: FastTrack Courier <fasttrack.courier@outlook.com>
To: merchant@example.com
Subject: Parcel Status Update: FT12AB34CD - In Transit

Parcel Status Update

🚚 In Transit

Your parcel is on its way to the destination.

Tracking ID: FT12AB34CD
Previous: Picked Up
Updated: Nov 28, 2025

[Track Your Parcel]
```

---

## Summary

✅ **Easiest way**: Use Outlook (2 minutes)
✅ **No setup way**: Skip email (0 minutes, logs to console)
✅ **Gmail way**: Enable 2FA first, then get app password (5 minutes)

**Recommended**: Start with Outlook, it's the easiest!

Check `EMAIL_ALTERNATIVES.md` for more options (Mailtrap, SendGrid, etc.)

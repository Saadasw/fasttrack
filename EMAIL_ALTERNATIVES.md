# Email Setup Alternatives

## Problem: "App passwords not available" on Gmail

This happens when 2-Factor Authentication (2FA) is not enabled on your Google account.

---

## Solution 1: Enable 2FA on Gmail (Recommended)

### Step 1: Enable 2-Factor Authentication

1. Go to: **https://myaccount.google.com/security**
2. Scroll to "Signing in to Google"
3. Click "2-Step Verification"
4. Click "Get Started"
5. Follow the steps:
   - Enter your password
   - Add phone number
   - Verify with code sent to phone
   - Turn on 2-Step Verification

### Step 2: Generate App Password

1. Go back to: **https://myaccount.google.com/apppasswords**
2. Select "Mail" and "Other (Custom name)"
3. Type: "FastTrack Courier"
4. Click "Generate"
5. Copy the 16-character password

### Step 3: Use in .env

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
ADMIN_EMAIL=your-email@gmail.com
```

---

## Solution 2: Use "Less Secure Apps" (Not Recommended)

⚠️ **Warning**: Google is phasing this out. Not recommended for security reasons.

### Steps:

1. Go to: **https://myaccount.google.com/lesssecureapps**
2. Turn ON "Allow less secure apps"
3. Use your regular Gmail password in `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-regular-gmail-password
ADMIN_EMAIL=your-email@gmail.com
```

⚠️ **Note**: This may not work if you have a Google Workspace account.

---

## Solution 3: Use Outlook/Hotmail (Easiest Alternative)

No 2FA or app password needed!

### Steps:

1. Create free Outlook account: **https://outlook.live.com/owa/**
2. Use in `.env`:

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USERNAME=your-email@outlook.com
SMTP_PASSWORD=your-outlook-password
ADMIN_EMAIL=your-email@outlook.com
```

That's it! No extra setup needed.

---

## Solution 4: Use Mailtrap (Best for Testing)

Free email testing service - emails don't actually send, but you can see them in inbox.

### Steps:

1. Sign up free: **https://mailtrap.io/**
2. Go to "Email Testing" → "Inboxes"
3. Click your inbox
4. Copy SMTP credentials
5. Use in `.env`:

```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USERNAME=your-mailtrap-username
SMTP_PASSWORD=your-mailtrap-password
ADMIN_EMAIL=test@fasttrack.com
```

**Pros**:
- ✅ No real emails sent (safe for testing)
- ✅ See all emails in web interface
- ✅ No setup needed
- ✅ Free forever

**Cons**:
- ❌ Emails don't actually reach recipients (testing only)

---

## Solution 5: Use SendGrid (Best for Production)

Free tier: 100 emails/day

### Steps:

1. Sign up: **https://sendgrid.com/free/**
2. Verify your email
3. Create API key:
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name: "FastTrack Courier"
   - Permissions: "Full Access"
   - Copy the API key

4. Use in `.env`:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
ADMIN_EMAIL=your-verified-email@domain.com
```

**Note**: `SMTP_USERNAME` is literally the word "apikey"

---

## Solution 6: Use Mailgun (Alternative to SendGrid)

Free tier: 5,000 emails/month

### Steps:

1. Sign up: **https://www.mailgun.com/**
2. Verify your email
3. Go to "Sending" → "Domain settings" → "SMTP credentials"
4. Copy credentials

5. Use in `.env`:

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USERNAME=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
ADMIN_EMAIL=your-email@domain.com
```

---

## Solution 7: Use Yahoo Mail

### Steps:

1. Create Yahoo account: **https://mail.yahoo.com/**
2. Generate app password:
   - Go to: **https://login.yahoo.com/account/security**
   - Click "Generate app password"
   - Select "Other App"
   - Name: "FastTrack Courier"
   - Copy password

3. Use in `.env`:

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USERNAME=your-email@yahoo.com
SMTP_PASSWORD=your-yahoo-app-password
ADMIN_EMAIL=your-email@yahoo.com
```

---

## Solution 8: Skip Email Setup (Testing Only)

The system works without email configuration!

### What happens:

- ✅ Parcels are created normally
- ✅ Status updates work normally
- ⚠️ Emails are logged to console instead of sending
- Console shows: `⚠️ Email not configured. Would have sent to...`

### To use:

Just **don't set** SMTP variables in `.env`, or leave them empty:

```env
# Email disabled - will log to console
SMTP_HOST=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=
```

**Good for**: Testing the system without email setup

---

## Comparison Table

| Solution | Setup Time | Cost | Real Emails | Best For |
|----------|-----------|------|-------------|----------|
| Gmail + 2FA | 5 min | Free | ✅ Yes | Production (small) |
| Gmail Less Secure | 2 min | Free | ✅ Yes | Not recommended |
| Outlook | 2 min | Free | ✅ Yes | Quick testing |
| Mailtrap | 3 min | Free | ❌ No | Development/Testing |
| SendGrid | 5 min | Free* | ✅ Yes | Production |
| Mailgun | 5 min | Free* | ✅ Yes | Production |
| Yahoo | 5 min | Free | ✅ Yes | Alternative |
| No Email | 0 min | Free | ❌ No | Testing only |

*Free tier with limits

---

## Recommended Solutions by Use Case

### For Testing/Development:
1. **Mailtrap** - See emails without sending
2. **Outlook** - Quick and easy
3. **No Email** - Skip setup entirely

### For Production (Small):
1. **Gmail + 2FA** - 500 emails/day
2. **Outlook** - Reliable
3. **Yahoo** - Alternative

### For Production (Large):
1. **SendGrid** - 100 emails/day free
2. **Mailgun** - 5,000 emails/month free
3. **Amazon SES** - Very cheap

---

## Quick Recommendation

**If you want to test NOW (2 minutes):**
→ Use **Outlook** (no 2FA needed)

**If you want production-ready (5 minutes):**
→ Enable **Gmail 2FA** and get app password

**If you just want to test the system (0 minutes):**
→ Skip email setup, it will log to console

---

## Step-by-Step: Outlook Setup (Easiest)

### 1. Create Outlook Account
- Go to: https://outlook.live.com/owa/
- Click "Create free account"
- Choose email address (e.g., fasttrack.courier@outlook.com)
- Set password
- Complete verification

### 2. Update .env
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USERNAME=fasttrack.courier@outlook.com
SMTP_PASSWORD=your-outlook-password
ADMIN_EMAIL=fasttrack.courier@outlook.com
FRONTEND_URL=http://localhost:3000
```

### 3. Restart Backend
```bash
docker-compose restart backend
```

### 4. Test
- Create a parcel
- Check Outlook inbox
- Done! ✅

---

## Step-by-Step: Mailtrap Setup (Best for Testing)

### 1. Sign Up
- Go to: https://mailtrap.io/
- Click "Sign Up"
- Use Google/GitHub or email
- Verify email

### 2. Get Credentials
- Go to "Email Testing" → "Inboxes"
- Click "My Inbox"
- Click "SMTP Settings"
- Copy credentials

### 3. Update .env
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USERNAME=abc123def456
SMTP_PASSWORD=xyz789uvw012
ADMIN_EMAIL=test@fasttrack.com
FRONTEND_URL=http://localhost:3000
```

### 4. Restart Backend
```bash
docker-compose restart backend
```

### 5. Test
- Create a parcel
- Go to Mailtrap inbox
- See email there! ✅

**Advantage**: All emails appear in Mailtrap web interface, not real inboxes

---

## Troubleshooting

### "Authentication failed" with Outlook
- Make sure you're using correct password
- Try logging into Outlook web to verify password
- Check if account is locked

### "Connection refused"
- Check firewall allows port 587
- Try port 465 with SSL instead
- Check if SMTP is enabled on your network

### Still not working?
```bash
# Test SMTP connection manually
docker exec -it fasttrack_backend python3 -c "
import smtplib
server = smtplib.SMTP('smtp-mail.outlook.com', 587)
server.starttls()
server.login('your-email@outlook.com', 'your-password')
print('✅ SMTP connection successful!')
server.quit()
"
```

---

## Summary

**Easiest for testing**: Outlook (2 minutes, no 2FA)
**Best for testing**: Mailtrap (3 minutes, see emails in web)
**Best for production**: Gmail + 2FA (5 minutes, reliable)
**No setup**: Skip email (0 minutes, logs to console)

Choose what works best for you!

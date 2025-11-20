# FastTrack Deployment Guide

## 🚀 Free Hosting Setup (Render + Vercel)

This guide will help you deploy all three services of FastTrack to free hosting platforms.

---

## 📋 Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Render Account** - Sign up at https://render.com (free)
3. **Vercel Account** - Sign up at https://vercel.com (free)
4. **Supabase Account** - Already set up ✅

---

## 🔧 PART 1: Deploy Backend (Render)

### Step 1: Prepare Your Repository

```bash
# Make sure all changes are committed
git add .
git commit -m "Add deployment configurations"
git push origin main
```

### Step 2: Deploy to Render

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the **fasttrack** repository

**Configuration:**
```
Name: fasttrack-backend
Environment: Python 3
Region: Choose closest to you
Branch: main
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Environment Variables** (Add these in Render):
```
SUPABASE_URL=<your-supabase-project-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_KEY=<your-supabase-service-role-key>
SECRET_KEY=<generate-a-random-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Note**: Get Supabase values from your `.env` file in `backend/.env` or from Supabase Dashboard → Project Settings → API

4. Click **"Create Web Service"**
5. **Copy the URL** (e.g., `https://fasttrack-backend.onrender.com`)

### ⚠️ Important: Update CORS Settings

Once deployed, edit `backend/main.py` and update CORS:

```python
# Replace this:
allow_origins=["*"]

# With your actual frontend URL:
allow_origins=[
    "https://your-app.vercel.app",  # Add after frontend deployment
    "http://localhost:3000"  # Keep for local development
]
```

---

## 🤖 PART 2: Deploy Chatbot (Render)

### Step 1: Create Another Web Service

1. **Render Dashboard** → **"New +"** → **"Web Service"**
2. Select same repository

**Configuration:**
```
Name: fasttrack-chatbot
Environment: Python 3
Region: Same as backend
Branch: main
Root Directory: chat_bot_backend/fasttrack_agent
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Environment Variables:**
```
AZURE_OPENAI_API_KEY=<your-azure-openai-api-key>
AZURE_OPENAI_ENDPOINT=<your-azure-endpoint-url>
AZURE_OPENAI_API_VERSION=2025-01-01-preview
CHAT_MODEL_DEPLOYMENT=<your-chat-model-deployment-name>
EMBEDDING_MODEL_DEPLOYMENT=<your-embedding-model-deployment-name>
TAVILY_API_KEY=<your-tavily-api-key>
```

**Note**: Get these values from your `.env` file in `chat_bot_backend/fasttrack_agent/.env`

2. Click **"Create Web Service"**
3. **Copy the URL** (e.g., `https://fasttrack-chatbot.onrender.com`)

---

## 🌐 PART 3: Deploy Frontend (Vercel)

### Step 1: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com/new
2. **Import Git Repository** → Select **fasttrack**
3. **Configure Project**:

```
Framework Preset: Next.js
Root Directory: fasttrack-frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Step 2: Set Environment Variables

In Vercel project settings → **Environment Variables**:

```
NEXT_PUBLIC_API_URL=<your-backend-url-from-render>
NEXT_PUBLIC_CHATBOT_URL=<your-chatbot-url-from-render>
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

**Note**: Use the URLs you got from Render deployments in steps 1 & 2, and Supabase keys from `fasttrack-frontend/.env.local`

3. Click **"Deploy"**
4. **Copy your URL** (e.g., `https://your-app.vercel.app`)

### Step 3: Update Backend CORS

Now go back to Render and update your backend's CORS environment variable or redeploy with the updated code.

---

## ✅ VERIFICATION CHECKLIST

After deployment, test these:

- [ ] Backend health check: `https://fasttrack-backend.onrender.com/health`
- [ ] Chatbot health check: `https://fasttrack-chatbot.onrender.com/api/stats`
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] Login works from frontend
- [ ] Create parcel works
- [ ] Chatbot responds

---

## ⚠️ FREE TIER LIMITATIONS

### Render (Backend & Chatbot)
- **Spins down after 15 minutes** of inactivity
- First request after sleep takes **30-60 seconds** to wake up
- 750 hours/month free (enough for 1 service always on)

**Solution**: Use a free uptime monitor like [UptimeRobot](https://uptimerobot.com/) to ping your backend every 5 minutes

### Vercel (Frontend)
- Unlimited deployments ✅
- 100GB bandwidth/month
- No cold starts ✅

---

## 🔄 CI/CD - Automatic Deployments

Both Render and Vercel automatically deploy when you push to your main branch!

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Automatic deployment triggers:
# ✅ Render rebuilds backend & chatbot
# ✅ Vercel rebuilds frontend
```

---

## 🆘 TROUBLESHOOTING

### Backend won't start
- Check Render logs for Python errors
- Verify all environment variables are set
- Make sure `requirements.txt` includes all dependencies

### Frontend can't reach backend
- Check CORS settings in backend
- Verify NEXT_PUBLIC_API_URL in Vercel settings
- Check browser console for errors

### Chatbot timeout
- Render free tier has 30-second request timeout
- If Azure OpenAI is slow, consider upgrading Render plan

### Database connection issues
- Verify Supabase project is active
- Check Supabase API keys are correct
- Ensure RLS policies allow access

---

## 💰 COST BREAKDOWN

| Service | Platform | Cost |
|---------|----------|------|
| Backend | Render | **FREE** (with sleep) |
| Chatbot | Render | **FREE** (with sleep) |
| Frontend | Vercel | **FREE** |
| Database | Supabase | **FREE** (500MB) |
| Azure OpenAI | Azure | **Pay per use** |
| **TOTAL** | | **~$0/month** (+ OpenAI usage) |

---

## 🚀 UPGRADE OPTIONS (If You Need More)

### Remove "Sleep" from Backend ($7/month)
Render Starter Plan: Backend stays always on

### More Database Storage
Supabase Pro: $25/month for 8GB

### Faster AI Responses
Render Standard: $25/month for better performance

---

## 🔐 SECURITY CHECKLIST

Before going to production:

- [ ] Change SECRET_KEY to a strong random value
- [ ] Restrict CORS to your domain only
- [ ] Implement password hashing in login endpoint
- [ ] Enable HTTPS only (Render/Vercel do this automatically ✅)
- [ ] Review Supabase RLS policies
- [ ] Set up monitoring/alerts
- [ ] Add rate limiting to prevent abuse

---

## 📚 ALTERNATIVE FREE PLATFORMS

If Render doesn't work for you:

| Platform | Backend | Free Tier |
|----------|---------|-----------|
| **Railway** | ✅ | $5 credit/month |
| **Fly.io** | ✅ | 3 VMs, 3GB storage |
| **Koyeb** | ✅ | 1 web service, sleeps |
| **Replit** | ✅ | Always on with Replit Core ($25/month) |
| **PythonAnywhere** | ✅ | 1 web app, no HTTPS on free |
| **Heroku** | ❌ | No longer free |

---

## 🎯 NEXT STEPS

1. Push code to GitHub
2. Deploy backend to Render
3. Deploy chatbot to Render
4. Deploy frontend to Vercel
5. Test all endpoints
6. Set up UptimeRobot to keep services awake
7. Share your app! 🎉

---

**Need help?** Check the logs:
- Render: Dashboard → Your Service → Logs
- Vercel: Dashboard → Your Project → Deployments → View Logs

Good luck with your deployment! 🚀

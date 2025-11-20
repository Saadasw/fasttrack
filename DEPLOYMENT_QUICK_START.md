# 🚀 Quick Start Deployment Guide

## TL;DR - Deploy in 15 Minutes

### Prerequisites
- GitHub account
- Render account (free) - https://render.com
- Vercel account (free) - https://vercel.com

---

## 🎯 Quick Deploy Steps

### 1️⃣ Push to GitHub (2 min)
```bash
cd /home/user/fasttrack
git add .
git commit -m "Add deployment configurations"
git push origin main
```

### 2️⃣ Deploy Backend to Render (5 min)
1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub → Select your repo
4. **Settings**:
   - Name: `fasttrack-backend`
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Add Environment Variables** (get from `backend/.env` file):
   ```
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_ANON_KEY=<your-supabase-anon-key>
   SUPABASE_SERVICE_KEY=<your-supabase-service-key>
   SECRET_KEY=<generate-random-secret>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```
6. Click **"Create Web Service"**
7. **COPY THE URL** → Save it! (e.g., `https://fasttrack-backend-xyz.onrender.com`)

### 3️⃣ Deploy Chatbot to Render (5 min)
1. **"New +"** → **"Web Service"** again
2. Same repo, different settings:
   - Name: `fasttrack-chatbot`
   - Root Directory: `chat_bot_backend/fasttrack_agent`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. **Add Environment Variables** (get from `chat_bot_backend/fasttrack_agent/.env`):
   ```
   AZURE_OPENAI_API_KEY=<your-azure-key>
   AZURE_OPENAI_ENDPOINT=<your-azure-endpoint>
   AZURE_OPENAI_API_VERSION=2025-01-01-preview
   CHAT_MODEL_DEPLOYMENT=<your-chat-model>
   EMBEDDING_MODEL_DEPLOYMENT=<your-embedding-model>
   TAVILY_API_KEY=<your-tavily-key>
   ```
4. **COPY THE URL** → Save it!

### 4️⃣ Deploy Frontend to Vercel (3 min)
1. Go to https://vercel.com/new
2. **Import Git Repository** → Select your repo
3. **Configure**:
   - Root Directory: `fasttrack-frontend`
   - Framework: Next.js (auto-detected)
   - Build: `pnpm install && pnpm build` (auto-detected)
4. **Add Environment Variables** (use URLs from steps 2 & 3, keys from `.env.local`):
   ```
   NEXT_PUBLIC_API_URL=<your-backend-url-from-render>
   NEXT_PUBLIC_CHATBOT_URL=<your-chatbot-url-from-render>
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```
5. Click **"Deploy"**
6. **DONE!** 🎉 Your app is live at `https://your-app.vercel.app`

---

## ✅ Test Your Deployment

1. **Backend**: Visit `https://fasttrack-backend-xyz.onrender.com/health`
   - Should return: `{"status": "healthy"}`

2. **Chatbot**: Visit `https://fasttrack-chatbot-xyz.onrender.com/api/stats`
   - Should return chatbot stats

3. **Frontend**: Visit your Vercel URL
   - Should load the homepage
   - Try logging in and creating a parcel

---

## ⚠️ Important: Update CORS

After deploying, you need to allow your frontend domain in the backend:

1. Edit `backend/main.py` line ~50
2. Change:
   ```python
   allow_origins=["*"]
   ```
   To:
   ```python
   allow_origins=[
       "https://your-app.vercel.app",  # Your actual Vercel URL
       "http://localhost:3000"
   ]
   ```
3. Commit and push - Render will auto-redeploy!

---

## 🐌 Free Tier Gotcha: "Cold Starts"

**Render Free Tier** sleeps services after 15 minutes of inactivity.

**What this means**:
- First request after sleep = 30-60 second delay 😴
- Subsequent requests = fast ⚡

**Solution**: Use [UptimeRobot](https://uptimerobot.com/) (free) to ping your backend every 5 minutes to keep it awake.

---

## 💡 Pro Tips

1. **Monitor Logs**: Check Render/Vercel logs if something breaks
2. **Environment Variables**: Double-check spelling and values
3. **HTTPS Only**: Both platforms provide free SSL ✅
4. **Auto-Deploy**: Every git push triggers new deployment
5. **Rollback**: Vercel lets you rollback to previous deployments instantly

---

## 🆘 Common Issues

### "Application failed to respond"
- Check Render logs for Python errors
- Verify all environment variables are set
- Make sure PORT variable is used in start command

### "CORS error" in browser
- Update CORS origins in backend/main.py
- Include your Vercel domain (no trailing slash)
- Redeploy backend after changing CORS

### "Module not found" during build
- Check requirements.txt includes all dependencies
- Verify Python version matches (3.11)

### Frontend shows "Failed to fetch"
- Check API URLs in Vercel environment variables
- Test backend health endpoint directly
- Check browser console for actual error

---

## 💰 Pricing Summary

| Service | Free Tier | Cost |
|---------|-----------|------|
| Render (Backend) | 750 hrs/month | $0 |
| Render (Chatbot) | 750 hrs/month | $0 |
| Vercel (Frontend) | Unlimited | $0 |
| Supabase (Database) | 500MB storage | $0 |
| **Azure OpenAI** | Pay-per-use | ~$$ |

**Total**: $0/month + OpenAI usage costs

---

## 🚀 Alternative: One-Click Deploy

If you want even faster deployment, consider:

- **Railway**: One-click deploy with $5 free credit/month
- **Fly.io**: Supports Docker, 3 free VMs
- **Replit**: Deploy directly from browser (but requires paid plan for always-on)

See full `DEPLOYMENT.md` for details on these platforms.

---

## 📞 Need Help?

1. Check deployment logs first
2. Verify environment variables
3. Test each service independently
4. Check CORS configuration

Good luck! 🍀

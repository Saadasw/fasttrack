# 🐳 FastTrack - Docker Deployment (বাংলা + English)

## 📋 Overview | সংক্ষিপ্ত বিবরণ

**English**: Complete Docker setup for the FastTrack Courier Service application with 3 containerized services.

**বাংলা**: FastTrack কুরিয়ার সার্ভিস অ্যাপ্লিকেশনের জন্য সম্পূর্ণ Docker সেটআপ যেখানে 3টি containerized service রয়েছে।

---

## 🏗️ Architecture | স্থাপত্য

```
┌─────────────────────────────────────────────────────────┐
│              Docker Network (fasttrack_net)             │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Frontend    │  │   Backend    │  │   Chatbot    │ │
│  │  Next.js     │◄─┤   FastAPI    │  │  FastAPI AI  │ │
│  │  Port: 3000  │  │  Port: 8000  │  │  Port: 8010  │ │
│  │  512MB RAM   │  │  512MB RAM   │  │  512MB RAM   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
         ▼                    ▼                    ▼
    Supabase DB         Supabase API        Azure OpenAI
```

---

## ✅ Prerequisites | প্রয়োজনীয় জিনিস

### English:
- Docker Desktop installed (Mac/Windows) or Docker + Docker Compose (Linux)
- At least 2GB free RAM
- Ports 3000, 8000, and 8010 available

### বাংলা:
- Docker Desktop ইনস্টল করা থাকতে হবে (Mac/Windows) অথবা Docker + Docker Compose (Linux)
- কমপক্ষে 2GB ফ্রি RAM
- পোর্ট 3000, 8000, এবং 8010 খালি থাকতে হবে

---

## 🚀 Quick Start | দ্রুত শুরু

### Method 1: Automated Script (সহজ পদ্ধতি)

```bash
# Navigate to project
cd /Users/fahimarakil/Applications/fasttrack

# Run the quick start script
./docker-start.sh
```

### Method 2: Manual Commands (ম্যানুয়াল পদ্ধতি)

```bash
# 1. Validate setup (সেটআপ চেক করুন)
./docker-check.sh

# 2. Build and start (বিল্ড এবং স্টার্ট করুন)
docker-compose up --build -d

# 3. View logs (লগ দেখুন)
docker-compose logs -f
```

---

## 📁 Files Created | তৈরি করা ফাইলগুলো

### Dockerfiles:
- ✅ `backend/Dockerfile` - FastAPI backend
- ✅ `chat_bot_backend/fasttrack_agent/Dockerfile` - AI Chatbot
- ✅ `fasttrack-frontend/Dockerfile` - Next.js frontend

### Docker Ignore Files:
- ✅ `backend/.dockerignore`
- ✅ `chat_bot_backend/fasttrack_agent/.dockerignore`
- ✅ `fasttrack-frontend/.dockerignore`

### Configuration:
- ✅ `docker-compose.yml` - Main orchestration file
- ✅ `fasttrack-frontend/next.config.mjs` - Updated with `output: 'standalone'`

### Helper Scripts:
- ✅ `docker-check.sh` - Validation script
- ✅ `docker-start.sh` - Quick start script
- ✅ `docker-stop.sh` - Stop/cleanup script

---

## 🔧 Docker Commands | কমান্ড সমূহ

### Start Services | সার্ভিস শুরু করুন

```bash
# Start all (সব শুরু করুন)
docker-compose up -d

# Start with rebuild (rebuild করে শুরু করুন)
docker-compose up --build -d

# Start specific service (নির্দিষ্ট service শুরু করুন)
docker-compose up -d backend
```

### Stop Services | সার্ভিস বন্ধ করুন

```bash
# Stop all (সব বন্ধ করুন)
docker-compose stop

# Stop and remove (বন্ধ করে remove করুন)
docker-compose down

# Complete cleanup (সম্পূর্ণ cleanup)
docker-compose down -v --rmi all
```

### View Logs | লগ দেখুন

```bash
# All services (সব service)
docker-compose logs -f

# Specific service (নির্দিষ্ট service)
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f chatbot

# Last 100 lines (শেষ 100 লাইন)
docker-compose logs --tail=100
```

### Check Status | স্ট্যাটাস চেক করুন

```bash
# List containers (container list)
docker-compose ps

# Resource usage (resource ব্যবহার)
docker stats

# Health status (health status)
docker inspect fasttrack_backend | grep -A 10 Health
```

### Access Container Shell | Container-এ ঢুকুন

```bash
# Backend
docker-compose exec backend /bin/sh

# Frontend
docker-compose exec frontend /bin/sh

# Chatbot
docker-compose exec chatbot /bin/sh
```

### Restart Services | সার্ভিস রিস্টার্ট করুন

```bash
# Restart all (সব রিস্টার্ট)
docker-compose restart

# Restart specific (নির্দিষ্ট রিস্টার্ট)
docker-compose restart backend
```

---

## 🌐 Access URLs | অ্যাক্সেস করার লিংক

After starting containers, access:

- 🌐 **Frontend**: http://localhost:3000
- ⚙️ **Backend API Docs**: http://localhost:8000/docs
- 🤖 **Chatbot**: http://localhost:8010

---

## 🔧 Configuration | কনফিগারেশন

### Environment Files Required | প্রয়োজনীয় .env ফাইল:

#### 1. `backend/.env` ✅ (Already exists)
```env
SUPABASE_URL=https://yuomspmrlzwbgaoeeomc.supabase.co
SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_KEY=your_key
SUPABASE_JWT_SECRET=your_secret
SECRET_KEY=your-secret-key
FRONTEND_URL=http://localhost:3000
```

#### 2. `chat_bot_backend/fasttrack_agent/.env` (Optional)
```env
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_ENDPOINT=your_endpoint
CHAT_MODEL_DEPLOYMENT=chat-heavy
EMBEDDING_MODEL_DEPLOYMENT=embed-large
```

---

## 📊 Resource Limits | রিসোর্স সীমা

Each service has memory and CPU limits:

| Service | Memory | CPU |
|---------|--------|-----|
| Backend | 512MB | 0.8 cores |
| Chatbot | 512MB | 0.8 cores |
| Frontend | 512MB | 1.0 cores |

To adjust, edit `docker-compose.yml`:
```yaml
services:
  backend:
    mem_limit: 1g  # Increase to 1GB
    cpus: 1.5      # Increase CPU
```

---

## 🛠️ Troubleshooting | সমস্যা সমাধান

### Problem: Port already in use | পোর্ট ইতিমধ্যে ব্যবহৃত

**English**: Check what's using the port:
```bash
lsof -i :3000
lsof -i :8000
```

**বাংলা**: পোর্ট কে ব্যবহার করছে দেখুন এবং বন্ধ করুন।

### Problem: Container fails to start | Container শুরু হচ্ছে না

```bash
# Check logs (লগ দেখুন)
docker-compose logs backend

# Check status (স্ট্যাটাস চেক করুন)
docker-compose ps

# Restart (রিস্টার্ট করুন)
docker-compose restart backend
```

### Problem: Out of memory | মেমরি শেষ

```bash
# Clean up Docker (ক্লিন আপ করুন)
docker system prune -a

# Increase memory limits in docker-compose.yml
```

### Problem: Frontend can't reach backend | Frontend backend-এ যেতে পারছে না

**Solution**: Make sure you're using container names in `NEXT_PUBLIC_API_URL`:
```env
NEXT_PUBLIC_API_URL=http://backend:8000  # NOT localhost!
```

---

## 🧹 Cleanup | পরিষ্কার করা

### Light Cleanup (হালকা পরিষ্কার):
```bash
docker-compose down
```

### Full Cleanup (সম্পূর্ণ পরিষ্কার):
```bash
docker-compose down -v --rmi all
docker system prune -a --volumes
```

---

## 📈 Performance Optimization | পারফরম্যান্স অপ্টিমাইজেশন

### Multi-stage Builds:
- Frontend uses 3-stage build: deps → builder → runner
- Reduces image size from ~1GB to ~200MB

### Volume Caching:
- Chatbot vector store persisted using volumes
- Prevents re-indexing on restart

### Health Checks:
- All services have health checks
- Frontend waits for backend to be healthy

---

## 🔒 Security Best Practices | নিরাপত্তা

### For Production:

1. **Change all secrets**:
```bash
# Generate strong key
openssl rand -base64 32
```

2. **Use non-root user** (Frontend already does this)

3. **Enable HTTPS** (use reverse proxy)

4. **Limit capabilities**:
```yaml
security_opt:
  - no-new-privileges:true
```

---

## 🚀 Production Deployment | প্রোডাকশন ডিপ্লয়মেন্ট

### Docker Swarm:
```bash
docker stack deploy -c docker-compose.yml fasttrack
```

### Kubernetes:
```bash
kompose convert
kubectl apply -f .
```

### Cloud Platforms:
- **AWS**: ECS or EKS
- **GCP**: Cloud Run or GKE
- **Azure**: Container Instances or AKS
- **DigitalOcean**: App Platform
- **Railway**: Deploy from GitHub

---

## 📝 Summary | সারসংক্ষেপ

### What We Built | আমরা কি তৈরি করেছি:

✅ 3 Dockerfiles (Backend, Chatbot, Frontend)
✅ 3 .dockerignore files (optimized)
✅ 1 docker-compose.yml (orchestration)
✅ 3 helper scripts (check, start, stop)
✅ Multi-stage build for frontend
✅ Health checks for all services
✅ Shared Docker network
✅ Volume persistence for chatbot
✅ Memory and CPU limits
✅ Non-root user in frontend

### How to Use | কিভাবে ব্যবহার করবেন:

```bash
# 1. Check setup
./docker-check.sh

# 2. Start everything
./docker-start.sh

# 3. View logs
docker-compose logs -f

# 4. Stop everything
./docker-stop.sh
```

---

## 🎉 Success Indicators | সফলতার চিহ্ন

You know it's working when:

✓ All 3 containers are running: `docker-compose ps`
✓ Frontend loads at http://localhost:3000
✓ Backend API docs at http://localhost:8000/docs
✓ No errors in logs: `docker-compose logs`
✓ Health checks passing: `docker inspect fasttrack_backend`

---

## 📞 Support | সাপোর্ট

### Common Commands | সাধারণ কমান্ড:

```bash
# Status check
docker-compose ps

# Logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose stop

# Complete reset
docker-compose down -v && docker-compose up --build -d
```

### Debug Mode | ডিবাগ মোড:

```bash
# Run with verbose logging
docker-compose up --build

# Check specific service
docker-compose logs -f backend --tail=100
```

---

**🐳 Built with Docker | FastTrack Courier Service | 2025**

**Made with ❤️ by RedCoder**


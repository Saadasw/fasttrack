# 🐳 FastTrack Courier Service - Docker Setup Guide

Complete Docker setup for running the entire FastTrack application with a single command!

## 📋 Prerequisites

- Docker Desktop installed (Mac/Windows) or Docker Engine + Docker Compose (Linux)
- At least 2GB free RAM
- Ports 3000, 8000, and 8010 available

## 🏗️ Architecture

The application consists of 3 containerized services:

```
┌─────────────────────────────────────────────────────────┐
│                  Docker Network (bridge)                │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Frontend    │  │   Backend    │  │   Chatbot    │ │
│  │  (Next.js)   │◄─┤   (FastAPI)  │  │  (FastAPI)   │ │
│  │  Port: 3000  │  │  Port: 8000  │  │  Port: 8010  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                           │
└─────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
   External DB           Supabase            Azure OpenAI
   (Supabase)
```

## 🚀 Quick Start

### Step 1: Clone and Navigate

```bash
cd /Users/fahimarakil/Applications/fasttrack
```

### Step 2: Setup Environment Files

You need to create 3 environment files:

#### **Backend Environment** (`backend/.env`)

```bash
cat > backend/.env << 'EOF'
SUPABASE_URL=https://yuomspmrlzwbgaoeeomc.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1b21zcG1ybHp3Ymdhb2Vlb21jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMzQ5MzgsImV4cCI6MjA3MTgxMDkzOH0._OBPBbBVyvD_Oi3JRF_5Dgh4I62SXiJl_LOk5mGrZwc
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1b21zcG1ybHp3Ymdhb2Vlb21jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIzNDkzOCwiZXhwIjoyMDcxODEwOTM4fQ.eoF2CdLb6Zn_MvLmrM7CEfN8_BvjitaD5u4vu7rPhkg
SUPABASE_JWT_SECRET=F6sOzn7mvzDG8UgpsbOMffuL6Fn5iJtDtsbYCc3UGY3s69VTHW18unQ9usmtnJ1kQAqrE1clA5ewAe5K9/IJpA==
SECRET_KEY=your-super-secret-key-change-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
EOF
```

#### **Chatbot Environment** (`chat_bot_backend/fasttrack_agent/.env`)

```bash
cat > chat_bot_backend/fasttrack_agent/.env << 'EOF'
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_VERSION=2025-01-01-preview
CHAT_MODEL_DEPLOYMENT=chat-heavy
EMBEDDING_MODEL_DEPLOYMENT=embed-large
EOF
```

#### **Frontend Environment** (Root `.env` for docker-compose)

```bash
cat > .env << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://yuomspmrlzwbgaoeeomc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1b21zcG1ybHp3Ymdhb2Vlb21jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMzQ5MzgsImV4cCI6MjA3MTgxMDkzOH0._OBPBbBVyvD_Oi3JRF_5Dgh4I62SXiJl_LOk5mGrZwc
NEXT_PUBLIC_API_URL=http://backend:8000
EOF
```

### Step 3: Build and Run

```bash
# Build all images and start services
docker-compose up --build -d

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f chatbot
```

### Step 4: Access the Application

- 🌐 **Frontend**: http://localhost:3000
- ⚙️ **Backend API**: http://localhost:8000/docs
- 🤖 **Chatbot**: http://localhost:8010

## 🔧 Docker Commands

### Start Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific
docker-compose restart backend
```

### Rebuild Services

```bash
# Rebuild all
docker-compose up --build -d

# Rebuild specific
docker-compose up --build -d frontend
```

### Check Status

```bash
# List running containers
docker-compose ps

# Check resource usage
docker stats
```

### Access Container Shell

```bash
# Backend
docker-compose exec backend /bin/sh

# Frontend
docker-compose exec frontend /bin/sh

# Chatbot
docker-compose exec chatbot /bin/sh
```

## 🛠️ Troubleshooting

### Issue: Port Already in Use

```bash
# Check what's using the port
lsof -i :3000
lsof -i :8000
lsof -i :8010

# Kill the process or change port in docker-compose.yml
```

### Issue: Container Fails to Start

```bash
# Check logs
docker-compose logs backend

# Check health status
docker-compose ps
```

### Issue: Environment Variables Not Loading

```bash
# Verify .env files exist
ls -la backend/.env
ls -la chat_bot_backend/fasttrack_agent/.env

# Restart with fresh build
docker-compose down
docker-compose up --build -d
```

### Issue: Out of Memory

```bash
# Increase memory limits in docker-compose.yml
mem_limit: 1g  # Change from 512m

# Or clean up Docker
docker system prune -a
```

### Issue: Frontend Can't Connect to Backend

Check that `NEXT_PUBLIC_API_URL` uses the **container name** (`http://backend:8000`), not `localhost`.

## 📊 Performance Optimization

### Memory Limits

Default limits are conservative (512MB per service). Adjust based on your needs:

```yaml
services:
  backend:
    mem_limit: 1g  # Increase if needed
    cpus: 1.5
```

### Multi-stage Builds

Frontend uses multi-stage build to minimize image size:

- **deps**: Install dependencies
- **builder**: Build application
- **runner**: Run production server

This reduces the final image from ~1GB to ~200MB.

### Volume Caching

Chatbot vector store is persisted using volumes:

```yaml
volumes:
  - ./chat_bot_backend/fasttrack_agent/vector_store:/app/vector_store
```

This prevents re-indexing on container restart.

## 🔒 Security Best Practices

### Production Deployment

1. **Change all default secrets**:
   ```bash
   # Generate strong SECRET_KEY
   openssl rand -base64 32
   ```

2. **Use environment-specific .env files**:
   ```bash
   docker-compose --env-file .env.production up -d
   ```

3. **Enable HTTPS** (use reverse proxy like Nginx):
   ```yaml
   services:
     nginx:
       image: nginx:alpine
       ports:
         - "443:443"
   ```

4. **Limit container capabilities**:
   ```yaml
   security_opt:
     - no-new-privileges:true
   ```

## 📈 Monitoring

### Health Checks

All services have health checks:

```bash
# Check health status
docker inspect fasttrack_backend | grep -A 10 Health
```

### Resource Usage

```bash
# Real-time monitoring
docker stats

# Container metrics
docker-compose top
```

## 🧹 Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove all (including volumes)
docker-compose down -v

# Clean up Docker system
docker system prune -a --volumes
```

## 🚀 Production Deployment

### Using Docker Swarm

```bash
docker stack deploy -c docker-compose.yml fasttrack
```

### Using Kubernetes

Convert using Kompose:

```bash
kompose convert
kubectl apply -f .
```

### Cloud Platforms

- **AWS**: Use ECS or EKS
- **GCP**: Use Cloud Run or GKE
- **Azure**: Use Container Instances or AKS
- **DigitalOcean**: Use App Platform

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue 1: Frontend Build Fails with ERESOLVE Error

**Symptom**: `npm ci --frozen-lockfile` fails with dependency conflicts

**Solution**: The Dockerfile already includes `--legacy-peer-deps` flag. If you see this error, rebuild without cache:

```bash
docker-compose build --no-cache frontend
```

#### Issue 2: Invalid Environment Variable Error

**Symptom**: `Error response from daemon: invalid environment variable`

**Solution**: Check for malformed variables in `.env` files (lines starting with `=` or missing variable names)

```bash
# Check for malformed variables
grep -n "^=" chat_bot_backend/fasttrack_agent/.env
grep -n "^=" backend/.env

# Remove malformed lines if found
```

#### Issue 3: Chatbot Container Unhealthy

**Symptom**: Chatbot service starts but health check fails

**Solution**: Ensure HOST and PORT are set in `chat_bot_backend/fasttrack_agent/.env`:

```bash
echo -e "\n# Server Configuration\nHOST=0.0.0.0\nPORT=8010" >> chat_bot_backend/fasttrack_agent/.env
docker-compose up -d --force-recreate chatbot
```

#### Issue 4: Services Start but Hang

**Symptom**: Container runs but service doesn't respond

**Solutions**:
1. Check if models are downloading (chatbot downloads cross-encoder model on first run)
2. Wait 2-3 minutes for initial model download
3. Model is now pre-downloaded during build to avoid this delay

#### Issue 5: Health Checks Failing

**Symptom**: Containers marked as "unhealthy"

**Solution**: Health checks now use Python's built-in `http.client` instead of `requests` module. If you still see failures:

```bash
# Test health endpoints manually
docker exec fasttrack_backend python -c "import http.client; conn = http.client.HTTPConnection('localhost', 8000); conn.request('GET', '/health'); print(conn.getresponse().status)"
docker exec fasttrack_chatbot python -c "import http.client; conn = http.client.HTTPConnection('localhost', 8010); conn.request('GET', '/api/health'); print(conn.getresponse().status)"
```

### Quick Fixes

#### Complete Reset
```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker rmi fasttrack-frontend fasttrack-backend fasttrack-chatbot

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

#### View Real-time Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker logs -f fasttrack_backend
docker logs -f fasttrack_chatbot
docker logs -f fasttrack_frontend
```

#### Check Container Status
```bash
# List all containers with health status
docker ps -a | grep fasttrack

# Inspect specific container
docker inspect fasttrack_chatbot
```

## 📞 Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Verify .env files are correct
3. Ensure ports are available
4. Check Docker resources (memory, CPU)
5. See troubleshooting section above for common fixes

---

**Built with Docker 🐳 | FastTrack Courier Service | 2025**


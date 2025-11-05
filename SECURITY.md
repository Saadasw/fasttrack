# 🔐 Security Guidelines for FastTrack

## ⚠️ IMPORTANT: Environment Variables

**NEVER commit `.env` files containing actual secrets to Git!**

### Files That Should NEVER Be Committed

- `backend/.env`
- `chat_bot_backend/fasttrack_agent/.env`
- `fasttrack-frontend/.env.local`
- Any `.env.backup*` files
- Any file containing API keys, tokens, or passwords

### If You Accidentally Commit Secrets

1. **Immediately Rotate/Regenerate the Secret**
   - Azure OpenAI Keys: Regenerate in Azure Portal
   - Supabase Keys: Regenerate in Supabase Dashboard
   - Any other API keys: Rotate them immediately

2. **Remove from Git History**
   ```bash
   # Remove the file from git tracking
   git rm --cached path/to/.env
   
   # Clean git history (if already pushed)
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/.env" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (CAUTION: coordinate with team)
   git push origin main --force
   ```

3. **Update .gitignore**
   - The `.gitignore` file already includes patterns for all .env files
   - Verify no sensitive files are tracked: `git ls-files | grep -E "\.env"`

## ✅ How to Setup Environment Variables Safely

### 1. Copy Example Files
```bash
# Backend
cp backend/.env.example backend/.env

# Chatbot
cp chat_bot_backend/fasttrack_agent/.env.example chat_bot_backend/fasttrack_agent/.env

# Frontend
cp fasttrack-frontend/.env.example fasttrack-frontend/.env.local
```

### 2. Fill in Your Actual Values
Edit each `.env` file with your real credentials (these will NOT be committed).

### 3. Verify .env Files Are Ignored
```bash
# This should return nothing
git status | grep -E "\.env"
```

## 🔑 Key Rotation Checklist

If a secret is compromised:

- [ ] **Azure OpenAI Key**: Azure Portal → Your Resource → Keys and Endpoint → Regenerate Key
- [ ] **Supabase Keys**: Supabase Dashboard → Project Settings → API → Reset Keys
- [ ] **Update all .env files** with new keys
- [ ] **Update Docker/Production** environment variables
- [ ] **Test all services** with new keys
- [ ] **Revoke old keys** (if possible)

## 🐳 Docker Security

When using Docker:
- Environment variables are passed via `docker-compose.yml` and `.env` files
- `.env` files are mounted as volumes (not copied into images)
- Never build images with secrets baked in
- Use Docker secrets for production deployments

## 📝 Best Practices

1. ✅ Always use `.env.example` files to document required variables
2. ✅ Keep actual `.env` files in `.gitignore`
3. ✅ Use different keys for development/staging/production
4. ✅ Rotate keys periodically (every 90 days recommended)
5. ✅ Use environment variables, never hardcode secrets
6. ✅ Review git commits before pushing: `git diff --cached`

## 🚨 If GitHub Blocks Your Push

GitHub Secret Scanning detected a secret. **DO NOT bypass it!**

1. **Revoke/Rotate the detected secret immediately**
2. Remove the file from git: `git rm --cached <file>`
3. Clean history if needed (see above)
4. Commit and push the removal
5. Verify the secret is no longer in history

## 📞 Questions?

If you're unsure about security practices, ask the team lead before proceeding.

---

**Remember**: It's better to spend 10 minutes setting up security correctly than dealing with a compromised system later. 🛡️


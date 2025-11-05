# 🚨 Git History Cleanup Instructions

## Current Situation

✅ **Already Done:**
- Removed `.env` files from current commit
- Updated `.gitignore` to prevent future commits
- Created `.env.example` files
- Added `SECURITY.md` documentation

⚠️ **Still Need to Do:**
- Clean `.env` files from Git history (they exist in commits: e793898, d92c69a)
- Rotate/Regenerate all exposed secrets

---

## 🔴 CRITICAL: Rotate These Secrets IMMEDIATELY

The following secrets are exposed in Git history and **MUST be regenerated**:

### 1. Azure OpenAI Key
- Location: Azure Portal → Your Resource → Keys and Endpoint
- Action: Click "Regenerate Key 1" or "Regenerate Key 2"
- Update: `chat_bot_backend/fasttrack_agent/.env`

### 2. Supabase Keys
- Location: Supabase Dashboard → Project Settings → API
- Keys to check:
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY`
- Action: Regenerate if necessary
- Update: `backend/.env`

---

## 🧹 Option 1: Clean Git History (Recommended if repo is shared)

### Using git filter-branch (Built-in)

```bash
cd /Users/fahimarakil/Applications/fasttrack

# Backup current branch
git branch backup-before-cleanup

# Remove .env files from all history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env chat_bot_backend/fasttrack_agent/.env.backup chat_bot_backend/fasttrack_agent/.env.backup3" \
  --prune-empty --tag-name-filter cat -- --all

# Cleanup
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (WARNING: This will rewrite history)
git push origin main --force
```

### Using BFG Cleaner (Faster, Easier)

```bash
# Install BFG (macOS)
brew install bfg

# Backup
git branch backup-before-cleanup

# Clean all .env files from history
bfg --delete-files '.env*' --no-blob-protection

# Cleanup
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin main --force
```

---

## 🆕 Option 2: Start Fresh (Easiest if repo is new/personal)

If this repo is relatively new and you're the only contributor:

```bash
cd /Users/fahimarakil/Applications/fasttrack

# Step 1: Backup current work
cp -r . ../fasttrack-backup

# Step 2: Delete git history
rm -rf .git

# Step 3: Initialize fresh repo
git init
git add .
git commit -m "Initial commit - clean repository without secrets"

# Step 4: Force push to GitHub
git branch -M main
git remote add origin https://github.com/Saadasw/fasttrack.git
git push -u origin main --force
```

---

## ✅ After Cleanup Checklist

- [ ] Verify secrets are rotated in Azure/Supabase
- [ ] Update all `.env` files with new keys
- [ ] Test all services still work
- [ ] Verify no `.env` in history: `git log --all --full-history -- "**/.env*"`
- [ ] Update Docker containers with new keys: `docker-compose up -d`
- [ ] Inform team members to pull fresh (if applicable)

---

## 🔍 Verify Cleanup

After cleaning history, verify secrets are gone:

```bash
# Check if .env files still in history
git log --all --full-history --oneline -- backend/.env

# Should return nothing if successfully cleaned
```

---

## ⚠️ Important Notes

1. **Force pushing rewrites history** - coordinate with team members
2. **Always rotate secrets** - even if you clean history, assume they're compromised
3. **Test after cleanup** - make sure everything still works with new keys
4. **Never bypass GitHub secret scanning** - it's protecting you

---

## 📞 Need Help?

If you're unsure:
1. Backup everything first: `git branch backup-$(date +%Y%m%d)`
2. Try Option 2 (fresh start) if repo is new
3. Reach out to team lead if working in a team

---

**Remember**: Security first! Clean history AND rotate secrets. 🔐


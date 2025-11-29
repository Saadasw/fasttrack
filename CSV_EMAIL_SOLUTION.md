# CSV-Based Customer Email Solution

## ✅ No Database Changes Required!

Instead of modifying the database, customer emails are stored in a simple CSV file. This approach:
- ✅ No database migration needed
- ✅ Easy to backup and export
- ✅ Simple to manage
- ✅ Works immediately
- ✅ Can be edited manually if needed

---

## 📁 How It Works

### CSV File Structure

**File**: `backend/customer_emails.csv`

```csv
tracking_id,customer_email,recipient_name,created_at
FT12AB34CD,customer@example.com,John Doe,2025-11-28T10:00:00Z
FT34CD56EF,jane@example.com,Jane Smith,2025-11-28T11:30:00Z
```

### Flow

```
1. Merchant creates parcel with customer email
         ↓
2. Backend saves to database (without customer_email)
         ↓
3. Backend saves customer_email to CSV file
         ↓
4. Admin updates status
         ↓
5. Backend looks up customer email in CSV
         ↓
6. Sends email to both merchant and customer
```

---

## 🎯 Features

### CSV Management Module

**File**: `backend/customer_emails.py`

**Functions:**
- `save_customer_email()` - Save email to CSV
- `get_customer_email()` - Get email by tracking ID
- `delete_customer_email()` - Remove email
- `get_all_customer_emails()` - List all emails
- `export_customer_emails()` - Export to new CSV

### Thread-Safe

- ✅ Uses file locking
- ✅ Safe for concurrent access
- ✅ No race conditions

### Auto-Initialize

- ✅ Creates CSV file automatically
- ✅ No manual setup needed
- ✅ Headers added automatically

---

## 🚀 Installation

### Step 1: No Database Changes!

**Skip the migration!** No database changes needed.

### Step 2: Rebuild Backend

```bash
# Stop containers
docker-compose down

# Rebuild backend with new CSV module
docker-compose build backend

# Start everything
docker-compose up -d
```

### Step 3: Test

1. Create parcel with customer email
2. CSV file created automatically
3. Customer receives emails
4. Done!

---

## 📊 CSV File Location

**Inside Docker Container:**
```
/app/customer_emails.csv
```

**To Access from Host:**
```bash
# View CSV contents
docker exec fasttrack_backend cat customer_emails.csv

# Copy CSV to host
docker cp fasttrack_backend:/app/customer_emails.csv ./customer_emails_backup.csv

# Copy CSV to container (restore)
docker cp ./customer_emails_backup.csv fasttrack_backend:/app/customer_emails.csv
```

---

## 🔧 Management Commands

### View All Customer Emails

```bash
docker exec fasttrack_backend cat customer_emails.csv
```

### Backup CSV File

```bash
# Backup to host
docker cp fasttrack_backend:/app/customer_emails.csv ./backup_$(date +%Y%m%d).csv
```

### Restore CSV File

```bash
# Restore from backup
docker cp ./backup_20251128.csv fasttrack_backend:/app/customer_emails.csv
```

### Edit CSV Manually

```bash
# Copy to host
docker cp fasttrack_backend:/app/customer_emails.csv ./temp.csv

# Edit temp.csv with Excel or text editor

# Copy back
docker cp ./temp.csv fasttrack_backend:/app/customer_emails.csv
```

---

## 📝 CSV Format

### Required Columns

```csv
tracking_id,customer_email,recipient_name,created_at
```

### Example Entries

```csv
tracking_id,customer_email,recipient_name,created_at
FT12AB34CD,john@example.com,John Doe,2025-11-28T10:00:00Z
FT34CD56EF,jane@example.com,Jane Smith,2025-11-28T11:30:00Z
FT56EF78GH,bob@example.com,Bob Johnson,2025-11-28T12:00:00Z
```

### Manual Entry

You can manually add entries:

```csv
FT99XX11YY,newcustomer@example.com,New Customer,2025-11-28T15:00:00Z
```

---

## 🔄 Persistence

### Docker Volume (Optional)

To persist CSV across container restarts, add volume to docker-compose.yml:

```yaml
backend:
  volumes:
    - ./backend/customer_emails.csv:/app/customer_emails.csv
```

### Automatic Backup Script

Create `backup_emails.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker cp fasttrack_backend:/app/customer_emails.csv ./backups/customer_emails_$DATE.csv
echo "Backed up to backups/customer_emails_$DATE.csv"
```

Run daily with cron:
```bash
0 0 * * * /path/to/backup_emails.sh
```

---

## 🎯 Advantages

### vs Database Approach

| Feature | CSV | Database |
|---------|-----|----------|
| Setup | ✅ None | ❌ Migration required |
| Backup | ✅ Simple file copy | ❌ Database export |
| Edit | ✅ Excel/text editor | ❌ SQL queries |
| Export | ✅ Already CSV | ❌ Need export tool |
| Portability | ✅ Single file | ❌ Database dependent |
| Performance | ✅ Fast for small data | ✅ Fast for large data |

### Best For:
- ✅ Small to medium volume (< 10,000 parcels)
- ✅ Quick setup
- ✅ Easy management
- ✅ No database access
- ✅ Simple backup/restore

### Consider Database If:
- Large volume (> 10,000 parcels)
- Complex queries needed
- Multiple servers
- High concurrency

---

## 🔒 Security

### File Permissions

```bash
# Set proper permissions
docker exec fasttrack_backend chmod 600 customer_emails.csv
```

### Backup Encryption

```bash
# Encrypt backup
gpg -c customer_emails_backup.csv

# Decrypt
gpg customer_emails_backup.csv.gpg
```

### .gitignore

Add to `.gitignore`:
```
customer_emails.csv
customer_emails_*.csv
backups/
```

---

## 📊 Monitoring

### Check CSV Size

```bash
docker exec fasttrack_backend ls -lh customer_emails.csv
```

### Count Entries

```bash
docker exec fasttrack_backend wc -l customer_emails.csv
```

### Search for Email

```bash
docker exec fasttrack_backend grep "customer@example.com" customer_emails.csv
```

---

## 🐛 Troubleshooting

### CSV File Not Found

**Solution**: File is created automatically on first use. Create parcel with customer email.

### Permissions Error

```bash
# Fix permissions
docker exec fasttrack_backend chmod 666 customer_emails.csv
```

### Corrupted CSV

```bash
# Restore from backup
docker cp ./backup_latest.csv fasttrack_backend:/app/customer_emails.csv
```

### Duplicate Entries

The system automatically handles duplicates - latest entry wins.

---

## 📈 Scaling

### When to Migrate to Database

Consider moving to database when:
- CSV file > 10 MB
- > 10,000 entries
- Slow lookups
- Multiple backend instances
- Need complex queries

### Migration Path

When ready to migrate:

1. Export CSV
2. Apply database migration
3. Import CSV data to database
4. Switch to database queries
5. Keep CSV as backup

---

## ✅ Testing

### Test 1: Create Parcel with Email

```bash
# Create parcel via API
# Check CSV created
docker exec fasttrack_backend cat customer_emails.csv
```

### Test 2: Status Update

```bash
# Update parcel status
# Check both merchant and customer receive email
```

### Test 3: Manual Entry

```bash
# Add entry manually
docker exec fasttrack_backend sh -c 'echo "FT99XX11YY,test@example.com,Test User,2025-11-28T15:00:00Z" >> customer_emails.csv'

# Update that parcel
# Check customer receives email
```

---

## 📋 Summary

**What You Get:**
- ✅ No database changes
- ✅ Simple CSV file storage
- ✅ Easy backup/restore
- ✅ Manual editing possible
- ✅ Thread-safe operations
- ✅ Auto-initialization

**Files Created:**
- `backend/customer_emails.py` - CSV management module
- `backend/customer_emails.csv` - Data file (auto-created)

**How to Use:**
1. Rebuild backend
2. Create parcel with customer email
3. CSV file created automatically
4. Customer receives emails

**No database migration needed!** 🎉

# Minimal Database Setup Guide

## Quick Start (2 Commands)

```bash
cd backend

# 1. Run setup script
./setup-minimal-db.sh

# 2. Start MongoDB
./start-minimal-mongodb.sh
```

That's it! Your minimal local database is ready.

## What This Sets Up

- ✅ **MongoDB Community Edition** - Lightweight local database
- ✅ **Minimal Data Directory** - `~/.mongodb/aurapply-data`
- ✅ **256MB Cache** - Very small memory footprint
- ✅ **Localhost Only** - No external access needed
- ✅ **Database Name:** `aurapply`

## Resource Usage

- **Memory:** ~256MB cache + ~100MB overhead ≈ ~350MB total
- **Disk:** Data directory grows as you use it (starts at ~50MB)
- **CPU:** Minimal usage (only when accessed)

## Next Steps

After setup, verify everything works:

```bash
# 1. Test MongoDB connection
cd backend
node setupMongoDB.js

# 2. Create test users
node createTestUsers.js

# 3. Start backend server
node server.js
```

## Troubleshooting

### MongoDB won't start
```bash
# Check if already running
brew services list | grep mongodb

# Stop and restart
brew services stop mongodb-community
brew services start mongodb-community
```

### Connection failed
```bash
# Verify MongoDB is running
mongosh --eval 'db.adminCommand("ping")'

# Check .env file
cat .env | grep MONGO_URI
# Should show: MONGO_URI=mongodb://localhost:27017/aurapply
```

### Port already in use
```bash
# Find what's using port 27017
lsof -i :27017

# Kill the process or change MongoDB port
```

## Stopping MongoDB

```bash
# Stop the service
brew services stop mongodb-community

# Or kill manually if started differently
pkill mongod
```

## Data Location

Your database files are stored in:
- **Path:** `~/.mongodb/aurapply-data`
- **Size:** Grows with usage (typically < 100MB for small scale)
- **Backup:** Copy this directory to backup your data

## Configuration Files

- **MongoDB Config:** `mongod-minimal.conf`
- **Environment:** `.env` (should have `MONGO_URI=mongodb://localhost:27017/aurapply`)

---

**Perfect for:** Small-scale local development, personal projects, testing
**Not suitable for:** Production, large datasets, multiple concurrent users

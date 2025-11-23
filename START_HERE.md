# 🚀 AurApply - Setup Guide

## ⚠️  Current Issue: MongoDB Not Configured

MongoDB is required for the application to store user accounts and data.

## ✅ What's Working
- ✅ Frontend (React app)
- ✅ Backend server (running on port 5001)
- ✅ CORS configured
- ✅ All routes set up

## ❌ What Needs Setup
- ❌ MongoDB connection (required for user accounts)

---

## 🔧 Quick Fix Options

### Option 1: MongoDB Atlas (Cloud - FASTEST - 5 minutes)
1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create free cluster (M0 - Free tier)
3. Get connection string
4. Copy `backend/env.template` to `backend/.env` and update MONGO_URI
5. Restart backend: `cd backend && node server.js`
6. Create accounts: `cd backend && node createTestUsers.js`

**See `backend/SETUP_INSTRUCTIONS.md` for detailed steps.**

### Option 2: Install MongoDB Locally
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
cd backend
node createTestUsers.js
```

---

## 📋 Test Accounts (After MongoDB Setup)

Once MongoDB is configured, these accounts will be created:

1. **Email:** `test@aurapply.com` | **Password:** `test123`
2. **Email:** `demo@aurapply.com` | **Password:** `demo123`  
3. **Email:** `admin@aurapply.com` | **Password:** `admin123`

---

## 🎯 Next Steps

1. **Set up MongoDB** (choose Option 1 or 2 above)
2. **Start backend server:**
   ```bash
   cd backend
   node server.js
   ```
3. **Start frontend:**
   ```bash
   cd frontend
   npm start
   ```
4. **Access the app:** http://localhost:3000

---

## 📞 Need Help?

Check these files:
- **`CONFIGURATION.md`** - Complete configuration reference (ALL SETTINGS)
- **`QUICK_CONFIG_REFERENCE.md`** - Quick reference for essential settings
- `backend/SETUP_INSTRUCTIONS.md` - Detailed MongoDB setup
- `backend/env.template` - Environment variables template (copy to `.env`)
- `backend/listAccounts.js` - Check existing accounts
- `MONGODB_STATUS.md` - MongoDB setup status



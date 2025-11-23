# MongoDB Setup Status

## Current Status: ⚠️ MongoDB Not Running

The MongoDB connection test failed because MongoDB is not currently running on your system.

## ✅ What Has Been Completed

1. ✅ Backend server configuration updated (removed deprecated options)
2. ✅ MongoDB connection scripts created
3. ✅ Test user creation script ready
4. ✅ Environment file (.env) configured with default connection string

## 🎯 Next Steps to Complete Setup

### Option 1: Install & Start MongoDB Locally (Recommended for Development)

```bash
# Install MongoDB via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify it's running
brew services list | grep mongodb

# Test connection
cd /Users/papitto/Desktop/aurapply/backend
node setupMongoDB.js

# Create test users
node createTestUsers.js

# Start backend server
node server.js
```

### Option 2: Use MongoDB Atlas (Cloud - Free & Easiest)

1. **Sign up for MongoDB Atlas:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account (no credit card required)

2. **Create a free cluster:**
   - Choose "Free Shared" (M0) tier
   - Select any cloud provider and region
   - Click "Create Cluster" (takes ~3 minutes)

3. **Set up database access:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `aurapply`
   - Password: Create a strong password (save it!)
   - Click "Add User"

4. **Configure network access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address

5. **Get connection string:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://aurapply:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update .env file:**
   ```bash
   cd /Users/papitto/Desktop/aurapply/backend
   nano .env
   ```
   
   Replace the MONGO_URI with your Atlas connection string:
   ```
   MONGO_URI=mongodb+srv://aurapply:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/aurapply?retryWrites=true&w=majority
   ```
   
   **Important:** Replace `YOUR_PASSWORD` with the password you created, and add `/aurapply` before the `?` to specify the database name.

7. **Test connection:**
   ```bash
   node setupMongoDB.js
   ```

8. **Create test users:**
   ```bash
   node createTestUsers.js
   ```

9. **Start backend server:**
   ```bash
   node server.js
   ```

## 📋 Files Created

- `backend/setupMongoDB.js` - Test MongoDB connection
- `backend/completeMongoSetup.js` - Interactive setup script
- `backend/startMongoDB.sh` - Start MongoDB script
- `MONGODB_SETUP_COMPLETE.md` - Complete setup guide

## ✅ Once MongoDB is Running

After MongoDB is connected, you can:

1. **Start backend server:**
   ```bash
   cd /Users/papitto/Desktop/aurapply/backend
   node server.js
   ```

2. **Start frontend:**
   ```bash
   cd /Users/papitto/Desktop/aurapply/frontend
   npm start
   ```

3. **Test accounts (after running createTestUsers.js):**
   - Email: `test@aurapply.com` / Password: `test123`
   - Email: `demo@aurapply.com` / Password: `demo123`
   - Email: `admin@aurapply.com` / Password: `admin123`

## 🆘 Troubleshooting

If you have issues:

1. **Check MongoDB is running:**
   ```bash
   brew services list | grep mongodb
   ```

2. **Check connection:**
   ```bash
   cd /Users/papitto/Desktop/aurapply/backend
   node setupMongoDB.js
   ```

3. **For Atlas issues:**
   - Verify IP address is whitelisted
   - Check username and password are correct
   - Ensure connection string includes `/aurapply` database name

---

**Recommended:** Use MongoDB Atlas for the fastest setup (free tier available, no local installation needed)



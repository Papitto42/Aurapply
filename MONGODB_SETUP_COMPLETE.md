# MongoDB Setup Complete Guide

## ✅ Quick Setup

Since MongoDB has been installed, complete the setup with these steps:

### Option 1: Start Local MongoDB (if installed locally)

```bash
cd /Users/papitto/Desktop/aurapply/backend

# Start MongoDB
brew services start mongodb-community

# Verify it's running
brew services list | grep mongodb

# Test connection
node setupMongoDB.js

# Create test users
node createTestUsers.js

# Start backend server
node server.js
```

### Option 2: Use MongoDB Atlas (Cloud - Recommended)

1. **Get Connection String:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Create a free cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string

2. **Update .env file:**
   ```bash
   cd /Users/papitto/Desktop/aurapply/backend
   nano .env
   ```
   
   Replace with your Atlas connection string:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/aurapply?retryWrites=true&w=majority
   ```

3. **Test connection:**
   ```bash
   node setupMongoDB.js
   ```

4. **Create test users:**
   ```bash
   node createTestUsers.js
   ```

5. **Start server:**
   ```bash
   node server.js
   ```

## 🧪 Test Accounts

After running `createTestUsers.js`, you can login with:

- **Email:** test@aurapply.com / **Password:** test123
- **Email:** demo@aurapply.com / **Password:** demo123
- **Email:** admin@aurapply.com / **Password:** admin123

## 🔍 Verify Setup

Run these commands to verify everything is working:

```bash
# Test MongoDB connection
node setupMongoDB.js

# Check existing users
node checkUsers.js

# Start backend server (should connect successfully)
node server.js
```

## 📝 Next Steps

1. ✅ MongoDB connection verified
2. ✅ Test users created
3. ✅ Backend server running on port 5000
4. ✅ Frontend can connect to backend API

You're all set! 🎉











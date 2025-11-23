# MongoDB Setup - Quick Start

## Current Status
- ❌ MongoDB is NOT installed locally
- ✅ Backend server IS running
- ⚠️  Need to configure MongoDB connection

## FASTEST SOLUTION: MongoDB Atlas (Cloud - Free)

### Step 1: Get MongoDB Atlas Connection String (5 minutes)

1. **Sign up for free:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create account (free tier available, no credit card needed)

2. **Create a free cluster:**
   - Click "Create" → Choose "M0 FREE" tier
   - Select any cloud provider and region (choose closest to you)
   - Click "Create Cluster" (takes ~3 minutes)

3. **Set up database access:**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Authentication Method: Password
   - Username: `aurapply`
   - Password: Create a strong password (SAVE IT!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Configure network access:**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add your IP)
   - Click "Confirm"

5. **Get connection string:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Driver: Node.js
   - Copy the connection string
   - It looks like: `mongodb+srv://aurapply:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 2: Update Backend Configuration

Update `backend/.env` file:

```bash
cd backend
nano .env
```

Replace with your Atlas connection string (add `/aurapply` before `?` for database name):

```
MONGO_URI=mongodb+srv://aurapply:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/aurapply?retryWrites=true&w=majority
```

### Step 3: Restart Backend Server

```bash
# Stop the current server (Ctrl+C in terminal where it's running)
# Then restart:
cd backend
node server.js
```

### Step 4: Create Test Accounts

```bash
cd backend
node createTestUsers.js
```

### Step 5: Verify Connection

```bash
cd backend
node listAccounts.js
```

---

## ALTERNATIVE: Install MongoDB Locally (macOS)

If you prefer local MongoDB:

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
brew services list | grep mongodb

# Create test accounts
cd backend
node createTestUsers.js
```

---

## Troubleshooting

If backend server is not running:
```bash
cd backend
node server.js
```

If MongoDB connection fails:
1. Check `.env` file has correct MONGO_URI
2. Verify IP is whitelisted in MongoDB Atlas
3. Check username/password are correct

---

**Once MongoDB is configured, your app will work fully!**




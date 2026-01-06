# MongoDB Setup Guide

## Install MongoDB (macOS)

### Option 1: Using Homebrew (Recommended)
```bash
# Install MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
brew services list | grep mongodb
```

### Option 2: Using MongoDB Atlas (Cloud - Free)
If you don't want to install MongoDB locally, you can use MongoDB Atlas (free tier):

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Update your `.env` file in the backend folder:
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   ```

## After MongoDB is Running

Once MongoDB is installed and running, create test users:

```bash
cd /Users/papitto/Desktop/aurapply/backend
node createTestUsers.js
```

This will create:
- test@aurapply.com / test123
- demo@aurapply.com / demo123
- admin@aurapply.com / admin123

## Quick Test (No Setup Needed)

**Just register via the website!**
1. Go to http://localhost:3000/auth
2. Click "Create Account"
3. Use any email/password you want
4. Start testing immediately!

No MongoDB setup required - the registration will work once your backend server connects to MongoDB.











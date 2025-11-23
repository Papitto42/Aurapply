# Test Accounts for AurApply

## Quick Start

**Option 1: Register a new account** (Recommended)
- Go to http://localhost:3000/auth
- Click "Create Account" or use the toggle
- Register with any email and password (min 6 characters)

**Option 2: Use these pre-configured test accounts**

Once MongoDB is running, these accounts will be available:

### Test Account 1
- **Email:** `test@aurapply.com`
- **Password:** `test123`
- **Name:** Test User

### Test Account 2
- **Email:** `demo@aurapply.com`
- **Password:** `demo123`
- **Name:** Demo User

### Test Account 3
- **Email:** `admin@aurapply.com`
- **Password:** `admin123`
- **Name:** Admin User

## To Create These Test Users:

1. **Start MongoDB:**
   ```bash
   # On macOS with Homebrew:
   brew services start mongodb-community
   
   # Or if installed differently:
   mongod
   ```

2. **Create the test users:**
   ```bash
   cd backend
   node createTestUsers.js
   ```

3. **Or register via the website:**
   - Just go to http://localhost:3000/auth
   - Click to create an account
   - Use any email/password you want!

## Quick Test Account (No MongoDB needed)

You can also just register directly on the website:
- Email: `yourname@test.com`
- Password: `password123` (or any 6+ characters)
- Name: Your Name

The registration will work once MongoDB is running and the backend server is connected.




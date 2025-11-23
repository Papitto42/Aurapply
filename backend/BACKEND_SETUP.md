# Backend Setup Guide

This guide will help you configure the backend properly for authentication to work without issues.

## Quick Setup

1. **Create `.env` file** (if it doesn't exist):
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Update `.env` file** with your configuration:
   - `JWT_SECRET`: Change to a secure random string (important for production!)
   - `MONGO_URI`: Your MongoDB connection string
   - `PORT`: Backend server port (default: 5000)
   - `CORS_ORIGIN`: Frontend URL (default: http://localhost:3000)

3. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

4. **Start the server**:
   ```bash
   node server.js
   ```

## Environment Variables

The backend uses the following environment variables (with defaults):

- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT tokens (default: 'SECRET_KEY_CHANGE_IN_PRODUCTION')
- `MONGO_URI`: MongoDB connection string (default: 'mongodb://localhost:27017/aurapply')
- `CORS_ORIGIN`: Allowed CORS origin (default: 'http://localhost:3000')
- `JWT_EXPIRES_IN`: Token expiration time (default: '24h')

## Authentication Features

✅ **Fixed Issues:**
- JWT secret now uses environment variable (secure)
- Consistent token expiration (24h for both dev and production)
- Improved error handling and user feedback
- Better token validation
- Email format validation
- Port mismatch fixed (all frontend files now use port 5000)

## Development Mode

The backend automatically falls back to in-memory storage if MongoDB is not connected. This allows you to test authentication without setting up MongoDB first.

## Testing Login

1. Start the backend server
2. Navigate to http://localhost:3000/auth
3. Register a new account or login with existing credentials

## Troubleshooting

**Cannot connect to server:**
- Make sure the backend is running on port 5000
- Check that no other service is using port 5000
- Verify CORS_ORIGIN matches your frontend URL

**Invalid credentials:**
- Make sure you're using the correct email and password
- If in dev mode, register a new account first
- Check backend console for error messages

**Token errors:**
- Clear localStorage and try logging in again
- Make sure JWT_SECRET is set in .env file
- Check that token hasn't expired (default: 24 hours)




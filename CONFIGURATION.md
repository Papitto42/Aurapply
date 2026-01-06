# 🔧 AurApply - Complete Configuration Reference

**Last Updated:** $(date)
**Purpose:** Master configuration file to prevent configuration issues and ensure consistent setup

---

## 📋 Table of Contents

1. [Environment Variables](#environment-variables)
2. [Port Configuration](#port-configuration)
3. [API Endpoints](#api-endpoints)
4. [Database Configuration](#database-configuration)
5. [Frontend Configuration](#frontend-configuration)
6. [Backend Configuration](#backend-configuration)
7. [File Upload Settings](#file-upload-settings)
8. [Authentication & Security](#authentication--security)
9. [CORS Configuration](#cors-configuration)
10. [Color Theme](#color-theme)
11. [Dependencies](#dependencies)
12. [Quick Setup Commands](#quick-setup-commands)

---

## 🔐 Environment Variables

### Backend (.env file location: `/backend/.env`)

Create this file if it doesn't exist:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/aurapply
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/aurapply?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=SECRET_KEY_CHANGE_IN_PRODUCTION
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Frontend Environment Variables

Currently, the frontend uses hardcoded API URLs. To make it configurable, create `/frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5001
```

**Note:** Currently, all API calls use `http://localhost:5001` hardcoded in the frontend code.

---

## 🔌 Port Configuration

| Service | Port | Default | Notes |
|---------|------|---------|-------|
| Frontend (React) | 3000 | Yes | Development server |
| Backend (Express) | 5001 | Yes | Can be changed via PORT env var |

**Important:** All frontend API calls currently use port `5001`. If you change the backend port, you must update all API calls in:
- `frontend/src/pages/DashboardHome.js`
- `frontend/src/pages/Dashboard.js`
- `frontend/src/pages/AuthPage.js`
- `frontend/src/pages/Settings.js`
- `frontend/src/pages/Discover.js`
- `frontend/src/components/Sidebar.js`

---

## 🌐 API Endpoints

### Base URL
- **Development:** `http://localhost:5001`
- **Production:** Update to your production URL

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Endpoints
- `GET /api/user/profile` - Get user profile (requires auth)
- `PUT /api/user/profile` - Update user profile (requires auth)
- `POST /api/user/profile` - Update user profile (alternative, requires auth)

### File Upload Endpoints
- `POST /api/upload/resume` - Upload resume PDF (requires auth)
- `POST /api/upload/coverletter` - Upload cover letter PDF (requires auth)

### Application Endpoints
- `GET /api/jobs` - Get available jobs (no auth required in dev mode)
- `POST /api/apply` - Submit job application (requires auth)
- `GET /api/history` - Get application history (requires auth)

### Configuration Endpoints
- `GET /api/config` - Get email configuration (requires auth)
- `POST /api/config` - Update email configuration (requires auth)

### Admin Endpoints
- `GET /api/admin/users` - List all users (no auth required - development only)

---

## 🗄️ Database Configuration

### MongoDB Connection

**Default Connection String:**
```
mongodb://localhost:27017/aurapply
```

**MongoDB Atlas Connection String Format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/aurapply?retryWrites=true&w=majority
```

### Database Settings
- **Database Name:** `aurapply`
- **Connection Timeout:** 5 seconds (serverSelectionTimeoutMS: 5000)
- **Fallback Mode:** If MongoDB is not connected, backend uses in-memory storage for development

### User Schema
```javascript
{
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  name: String,
  jobTitle: String,
  documents: {
    resume: String (file path),
    coverLetter: String (file path)
  },
  emailConfig: {
    user: String (Gmail address),
    pass: String (Gmail App Password)
  },
  preferences: {
    keywords: [String],
    locations: [String],
    remote: Boolean
  },
  applications: [{
    jobTitle: String,
    company: String,
    status: String (default: 'Sent'),
    date: Date (default: Date.now)
  }]
}
```

---

## 🎨 Frontend Configuration

### React Configuration
- **Framework:** React 19.2.0
- **Build Tool:** react-scripts 5.0.1
- **Router:** react-router-dom 7.9.6

### Tailwind CSS Configuration
**File:** `/frontend/tailwind.config.js`

```javascript
content: ["./src/**/*.{js,jsx,ts,tsx}"]
theme: {
  extend: {
    animation: {
      'spin-slow': 'spin 20s linear infinite',
    },
    colors: {
      'trust-blue': '#0066FF',
      'trust-blue-dark': '#0052CC',
      'success-green': '#10B981',
      'success-green-dark': '#059669',
      'primary-orange': '#FF4D00',
      'primary-orange-light': '#FF6B35',
    },
  },
}
```

### PostCSS Configuration
**File:** `/frontend/postcss.config.js`

```javascript
plugins: {
  tailwindcss: {},
  autoprefixer: {},
}
```

### Custom CSS Variables
**File:** `/frontend/src/index.css`

```css
:root {
  --bg-depth: #050505;
  --glass-border: rgba(255, 255, 255, 0.08);
  --primary-accent: #FF4D00;
  --trust-blue: #0066FF;
  --success-green: #10B981;
}
```

### HTML Meta Configuration
**File:** `/frontend/public/index.html`

- **Title:** "AurApply - Automated Job Applications"
- **Theme Color:** #030014
- **Font:** Inter (Google Fonts)
- **Viewport:** width=device-width, initial-scale=1

### Development Mode
**File:** `/frontend/src/App.js`

```javascript
const DEV_MODE = true; // Currently set to true
```

When `DEV_MODE` is true:
- All routes are accessible without authentication
- Navbar visibility is controlled by route paths

---

## ⚙️ Backend Configuration

### Express Server Settings
- **Framework:** Express 5.1.0
- **Body Parser:** JSON enabled
- **Static Files:** `/uploads` directory served at `/uploads` route

### File Upload Configuration
- **Storage:** Local disk storage (`backend/uploads/`)
- **Max File Size:** 10MB (10 * 1024 * 1024 bytes)
- **Allowed Types:** PDF only (`application/pdf`)
- **File Naming:** `${Date.now()}-${file.originalname}`

### Development Mode Features
- **In-Memory User Storage:** When MongoDB is not connected, users are stored in memory
- **Mock Data:** Returns mock data for various endpoints when DB is unavailable
- **Console Logging:** Detailed logs for development debugging

---

## 🔒 Authentication & Security

### JWT Configuration
- **Secret Key:** From `JWT_SECRET` env var (default: 'SECRET_KEY_CHANGE_IN_PRODUCTION')
- **Expiration:** From `JWT_EXPIRES_IN` env var (default: '24h')
- **Token Format:** `Bearer <token>` or just `<token>`
- **Storage:** Frontend stores token in `localStorage` as `'token'`

### Password Hashing
- **Algorithm:** bcryptjs
- **Salt Rounds:** 10

### Token Verification Middleware
- **Location:** `backend/server.js` - `verifyToken` function
- **Error Responses:**
  - 403: Token required
  - 401: Invalid token or token expired

---

## 🌍 CORS Configuration

**File:** `/backend/server.js`

### Allowed Origins
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- Value from `CORS_ORIGIN` env var
- Any origin if `NODE_ENV === 'development'`

### CORS Settings
```javascript
{
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}
```

---

## 🎨 Color Theme

### Primary Colors
- **Primary Orange:** `#FF4D00` / `--primary-accent`
- **Primary Orange Light:** `#FF6B35`
- **Trust Blue:** `#0066FF` / `--trust-blue`
- **Trust Blue Dark:** `#0052CC`
- **Success Green:** `#10B981` / `--success-green`
- **Success Green Dark:** `#059669`

### Background Colors
- **Main Background:** `#050505` / `--bg-depth`
- **HTML Background:** `#030014`
- **Glass Panel:** `rgba(10, 10, 10, 0.8)` with backdrop blur

### Text Colors
- **Primary Text:** `#E0E0E0`
- **Secondary Text:** `rgba(255, 255, 255, 0.5)`
- **Glass Border:** `rgba(255, 255, 255, 0.08)`

---

## 📦 Dependencies

### Backend Dependencies
```json
{
  "bcryptjs": "^3.0.3",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.1.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.20.0",
  "multer": "^2.0.2",
  "nodemailer": "^7.0.10"
}
```

### Frontend Dependencies
```json
{
  "@iconify/react": "^6.0.2",
  "@react-spring/web": "^10.0.3",
  "axios": "^1.13.2",
  "clsx": "^2.1.1",
  "date-fns": "^4.1.0",
  "framer-motion": "^12.23.24",
  "lucide-react": "^0.554.0",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.6",
  "react-scripts": "5.0.1",
  "react-tinder-card": "^1.6.4",
  "recharts": "^3.4.1",
  "tailwind-merge": "^3.4.0",
  "web-vitals": "^2.1.4"
}
```

### Frontend Dev Dependencies
```json
{
  "autoprefixer": "^10.4.22",
  "postcss": "^8.5.6",
  "tailwindcss": "^3.4.18"
}
```

---

## 🚀 Quick Setup Commands

### Initial Setup
```bash
# Backend setup
cd backend
npm install
cp .env.example .env  # Create .env file and configure
node server.js

# Frontend setup
cd frontend
npm install
npm start
```

### MongoDB Setup (Local)
```bash
# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Test connection
cd backend
node setupMongoDB.js

# Create test users
node createTestUsers.js
```

### MongoDB Setup (Atlas)
1. Sign up at https://www.mongodb.com/cloud/atlas/register
2. Create free cluster (M0)
3. Create database user
4. Whitelist IP address (or allow from anywhere for dev)
5. Get connection string
6. Update `backend/.env` with `MONGO_URI`
7. Test: `cd backend && node setupMongoDB.js`

### Test Accounts (after running createTestUsers.js)
- Email: `test@aurapply.com` / Password: `test123`
- Email: `demo@aurapply.com` / Password: `demo123`
- Email: `admin@aurapply.com` / Password: `admin123`

---

## 📝 Important Notes

### Port Consistency
- **CRITICAL:** Backend runs on port `5001` (not 5000)
- All frontend API calls use `http://localhost:5001`
- If you change the backend port, update all frontend API calls

### File Uploads
- Files are stored in `backend/uploads/` directory
- Only PDF files are accepted
- Maximum file size: 10MB
- Files are accessible at `http://localhost:5001/uploads/filename.pdf`

### Development Mode
- Backend falls back to in-memory storage if MongoDB is not connected
- Frontend has `DEV_MODE = true` which bypasses authentication checks
- Mock data is returned when database is unavailable

### Email Configuration
- Users must configure Gmail App Password in Settings
- Email config is stored per user in MongoDB
- Nodemailer is configured for Gmail service

### Security Warnings
- **JWT_SECRET:** Must be changed in production
- **CORS:** Currently allows all origins in development mode
- **Admin Endpoint:** `/api/admin/users` has no authentication (dev only)

---

## 🔄 Migration Checklist

When setting up on a new machine or environment:

1. ✅ Install Node.js (v18+ recommended)
2. ✅ Install MongoDB (local or Atlas)
3. ✅ Create `backend/.env` file with all required variables
4. ✅ Run `npm install` in both `backend/` and `frontend/` directories
5. ✅ Configure MongoDB connection string
6. ✅ Start MongoDB (if local) or verify Atlas connection
7. ✅ Test backend: `cd backend && node server.js`
8. ✅ Test frontend: `cd frontend && npm start`
9. ✅ Create test users: `cd backend && node createTestUsers.js`
10. ✅ Verify API connectivity from frontend

---

## 📞 Troubleshooting

### Backend won't start
- Check if port 5001 is available: `lsof -i :5001`
- Verify `.env` file exists in `backend/` directory
- Check Node.js version: `node --version` (should be 18+)

### MongoDB connection fails
- Verify MongoDB is running: `brew services list | grep mongodb` (macOS)
- Check connection string in `.env` file
- For Atlas: Verify IP is whitelisted and credentials are correct

### Frontend can't connect to backend
- Verify backend is running on port 5001
- Check CORS configuration in `backend/server.js`
- Verify `CORS_ORIGIN` in `.env` matches frontend URL

### File uploads fail
- Check `backend/uploads/` directory exists and is writable
- Verify file is PDF format
- Check file size is under 10MB

---

**This configuration file should be updated whenever any configuration changes are made to the project.**










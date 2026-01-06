# 🔥 Firebase Quick Start - Deploy in 5 Minutes

## Prerequisites
- Node.js installed
- Backend already deployed (Render/Railway recommended)
- Backend URL ready (e.g., `https://your-backend.onrender.com`)

## Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

## Step 2: Login to Firebase
```bash
firebase login
```

## Step 3: Initialize Firebase (First Time Only)
```bash
firebase init hosting
```

**When prompted:**
- Select/create a Firebase project
- Public directory: `frontend/build`
- Single-page app: **Yes**
- Set up automatic builds: **No**
- Overwrite index.html: **No**

## Step 4: Set Backend URL
Create `frontend/.env.production`:
```bash
cd frontend
echo "REACT_APP_API_URL=https://your-backend-url.onrender.com" > .env.production
cd ..
```

**Replace `your-backend-url.onrender.com` with your actual backend URL!**

## Step 5: Deploy!
```bash
./deploy-firebase.sh
```

Or manually:
```bash
cd frontend && npm run build && cd ..
firebase deploy --only hosting
```

## ✅ Done!

Your app will be live at:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

## 🔧 Update Backend CORS

Don't forget to update your backend CORS to allow your Firebase URL:
- Go to Render/Railway dashboard
- Add your Firebase URL to `CORS_ORIGIN` environment variable
- Backend will auto-restart

## 📚 Full Guide

See `FIREBASE_DEPLOYMENT.md` for detailed instructions, troubleshooting, and advanced options.


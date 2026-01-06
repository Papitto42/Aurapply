# 🔥 Firebase Deployment Guide

This guide will help you deploy your AurApply app to Firebase. You have two options:

## 🎯 Deployment Options

### Option 1: Firebase Hosting (Frontend) + Render/Railway (Backend) ⭐ Recommended
- **Frontend**: Firebase Hosting (free, fast CDN)
- **Backend**: Keep on Render/Railway (easier, no code changes needed)
- **Best for**: Quick deployment with minimal changes

### Option 2: Full Firebase (Frontend + Backend)
- **Frontend**: Firebase Hosting
- **Backend**: Firebase Functions (requires code restructuring)
- **Best for**: Everything on one platform

---

## 🚀 Option 1: Firebase Hosting for Frontend (Recommended)

### Prerequisites
1. Node.js installed
2. Firebase CLI installed: `npm install -g firebase-tools`
3. Google account

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```
This will open your browser to authenticate.

### Step 3: Initialize Firebase in Your Project
```bash
cd /Users/papitto/Desktop/aurapply
firebase init hosting
```

**Configuration options:**
- **Select**: Use an existing project (or create a new one)
- **Public directory**: `frontend/build`
- **Single-page app**: Yes (for React Router)
- **Set up automatic builds**: No (we'll build manually)
- **Overwrite index.html**: No

### Step 4: Create Firebase Configuration File

Firebase will create `firebase.json`. Let's make sure it's configured correctly:

```json
{
  "hosting": {
    "public": "frontend/build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Step 5: Build Your Frontend
```bash
cd frontend
npm run build
cd ..
```

### Step 6: Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

### Step 7: Set Environment Variable in Firebase

After deploying, you need to set the API URL. Since Firebase Hosting serves static files, you'll need to:

1. **Option A**: Build with environment variable (recommended)
   - Create `frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```
   - Rebuild: `cd frontend && npm run build`
   - Redeploy: `firebase deploy --only hosting`

2. **Option B**: Use Firebase Hosting environment config (requires Firebase CLI 11.0+)
   ```bash
   firebase hosting:channel:deploy preview --only hosting
   ```

### Step 8: Get Your Firebase URL

After deployment, Firebase will give you a URL like:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

### Step 9: Update Backend CORS

Update your backend (on Render/Railway) to allow your Firebase URL:
- Add to `CORS_ORIGIN`: `https://your-project-id.web.app`

---

## 🔥 Option 2: Full Firebase Deployment (Frontend + Backend)

This requires converting your Express backend to Firebase Functions. This is more complex but keeps everything on Firebase.

### Step 1-4: Same as Option 1 (Firebase Hosting setup)

### Step 5: Initialize Firebase Functions
```bash
firebase init functions
```

**Configuration:**
- **Language**: JavaScript
- **ESLint**: Yes (optional)
- **Install dependencies**: Yes

### Step 6: Restructure Backend for Firebase Functions

Firebase Functions requires restructuring your Express app. Here's a basic setup:

**`functions/index.js`** (create this file):
```javascript
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();

// Import your routes from backend/server.js
// You'll need to refactor server.js to export routes instead of starting a server

app.use(cors({ origin: true }));
app.use(express.json());

// Copy all your routes from backend/server.js here
// Or refactor backend/server.js to export a router

exports.api = functions.https.onRequest(app);
```

### Step 7: Copy Backend Dependencies

Copy `backend/package.json` dependencies to `functions/package.json`:
```bash
cp backend/package.json functions/package.json.backup
# Then manually merge dependencies
```

### Step 8: Deploy Functions
```bash
firebase deploy --only functions
```

### Step 9: Update Frontend API URL

Update `frontend/.env.production`:
```
REACT_APP_API_URL=https://us-central1-your-project-id.cloudfunctions.net/api
```

### Step 10: Deploy Everything
```bash
cd frontend && npm run build && cd ..
firebase deploy
```

---

## 📋 Quick Start (Option 1 - Recommended)

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize (select hosting only)
firebase init hosting

# 4. Build frontend
cd frontend
npm run build
cd ..

# 5. Deploy
firebase deploy --only hosting
```

---

## 🔧 Configuration Files

### `firebase.json` (auto-generated, verify it looks like this):
```json
{
  "hosting": {
    "public": "frontend/build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### `.firebaserc` (auto-generated):
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### `frontend/.env.production` (create this):
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

---

## 🌐 Custom Domain (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the DNS setup instructions
4. Firebase will provide SSL automatically

---

## 🔄 Continuous Deployment

### Option A: GitHub Actions
Create `.github/workflows/firebase-deploy.yml`:
```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd frontend && npm install && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

### Option B: Manual Deployment
```bash
cd frontend && npm run build && cd .. && firebase deploy --only hosting
```

---

## ✅ After Deployment Checklist

- [ ] Frontend deployed to Firebase Hosting
- [ ] Backend deployed to Render/Railway (or Firebase Functions)
- [ ] Environment variables set correctly
- [ ] CORS configured to allow Firebase URL
- [ ] MongoDB Atlas connection string configured
- [ ] Test login/register functionality
- [ ] Test API endpoints
- [ ] Custom domain configured (optional)

---

## 🆘 Troubleshooting

**Build fails?**
- Make sure you're in the project root when running `firebase init`
- Check that `frontend/build` exists after running `npm run build`
- Verify `firebase.json` has correct `public` directory

**Frontend can't reach backend?**
- Check `REACT_APP_API_URL` in `frontend/.env.production`
- Verify backend CORS allows your Firebase URL
- Check browser console for CORS errors

**404 errors on routes?**
- Make sure `rewrites` in `firebase.json` redirects all routes to `index.html`
- This is needed for React Router to work

**Functions timeout?**
- Firebase Functions have a 60-second timeout on free tier
- Consider upgrading or using Render/Railway for backend

---

## 💡 Recommendation

**For your project, I recommend Option 1:**
- ✅ Firebase Hosting for frontend (fast, free, easy)
- ✅ Render/Railway for backend (no code changes needed)
- ✅ Best of both worlds
- ✅ Easier to maintain

Firebase Functions are great, but converting your Express app requires significant refactoring. Keeping the backend on Render/Railway is much simpler and works perfectly with Firebase Hosting.

---

## 📚 Resources

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)


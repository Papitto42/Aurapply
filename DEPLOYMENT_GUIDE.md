# Deployment Guide - Make Your Website Public

This guide will help you deploy your AurApply website so people can access it publicly, while keeping your source code private on GitHub.

## 🎯 Overview

- **Frontend (React)**: Deploy to Vercel (recommended) or Netlify
- **Backend (Node.js)**: Deploy to Render, Railway, or Vercel
- **Database**: Use MongoDB Atlas (free tier available)

---

## Option 1: Vercel (Recommended - Easiest)

### Frontend Deployment

1. **Push your code to GitHub first** (if you haven't already)
   ```bash
   git push -u origin main
   ```

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account

3. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Select your `aurapply` repository
   - Choose the **frontend** folder as the root directory

4. **Configure Build Settings**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)
   - **Install Command**: `npm install`

5. **Environment Variables** (if needed)
   - Add any frontend environment variables here
   - Usually not needed for React apps

6. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get a URL like: `aurapply.vercel.app`

### Backend Deployment (Vercel Serverless Functions)

Vercel can also host your backend using serverless functions, but for a full Express app, **Render or Railway is better**.

---

## Option 2: Render (Best for Full-Stack)

### Backend Deployment on Render

1. **Go to Render**
   - Visit [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `aurapply` repository

3. **Configure Backend**
   - **Name**: `aurapply-backend`
   - **Environment**: Node
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

4. **Environment Variables**
   Add all your `.env` variables:
   - `PORT=5001`
   - `MONGO_URI=your_mongodb_atlas_uri`
   - `JWT_SECRET=your_secret_key`
   - `CORS_ORIGIN=https://your-frontend-url.vercel.app`
   - `GEMINI_API_KEY=your_key`
   - etc.

5. **Deploy!**
   - Click "Create Web Service"
   - You'll get a URL like: `aurapply-backend.onrender.com`

6. **Update Frontend CORS**
   - Update your frontend API calls to use the Render backend URL
   - Or set `CORS_ORIGIN` in backend to allow your Vercel frontend URL

---

## Option 3: Railway (Alternative)

Railway is another great option that's easy to use:

1. Visit [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project from GitHub repo
4. Add backend service (auto-detects Node.js)
5. Add environment variables
6. Deploy!

---

## 🔧 Quick Setup Commands

### Test Build Locally First

```bash
# Frontend
cd frontend
npm run build
# This creates a 'build' folder with optimized production files

# Backend (just make sure it starts)
cd ../backend
npm start
```

### Update Frontend API URL

After deploying backend, update your frontend to use the production API:

Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

Then in your frontend code, use:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
```

---

## 📝 MongoDB Atlas Setup (Free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a free cluster
4. Get your connection string
5. Add it to your backend environment variables as `MONGO_URI`

---

## ✅ After Deployment

1. **Frontend URL**: `https://aurapply.vercel.app` (or similar)
2. **Backend URL**: `https://aurapply-backend.onrender.com` (or similar)
3. **Update CORS** in backend to allow your frontend URL
4. **Test everything** works end-to-end

---

## 🔒 Security Reminders

- ✅ Source code stays private on GitHub
- ✅ Only compiled/minified code is deployed
- ✅ Environment variables are secure on hosting platform
- ✅ Never commit `.env` files

---

## 🆘 Troubleshooting

**Build fails?**
- Check build logs in Vercel/Render dashboard
- Make sure all dependencies are in `package.json`

**Backend not connecting?**
- Check MongoDB Atlas connection string
- Verify environment variables are set
- Check CORS settings

**Frontend can't reach backend?**
- Update CORS_ORIGIN in backend
- Check API URLs in frontend code
- Verify backend is running









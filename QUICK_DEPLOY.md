# Quick Deployment Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Push to GitHub (if not done)
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `aurapply` repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Create React App (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add Environment Variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` (you'll get this in step 3)
6. Click "Deploy"
7. **Copy your frontend URL** (e.g., `aurapply.vercel.app`)

### Step 3: Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click "New +" → "Web Service"
3. Connect your `aurapply` repository
4. Configure:
   - **Name**: `aurapply-backend`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add Environment Variables:
   ```
   PORT=5001
   NODE_ENV=production
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_random_string
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   GEMINI_API_KEY=your_gemini_api_key
   ```
6. Click "Create Web Service"
7. **Copy your backend URL** (e.g., `aurapply-backend.onrender.com`)

### Step 4: Update Frontend with Backend URL

1. Go back to Vercel dashboard
2. Go to your project → Settings → Environment Variables
3. Update `REACT_APP_API_URL` to: `https://your-backend-url.onrender.com`
4. Redeploy (or it will auto-redeploy)

### Step 5: Update Backend CORS

1. Go to Render dashboard
2. Go to your backend service → Environment
3. Update `CORS_ORIGIN` to your Vercel frontend URL: `https://your-frontend-url.vercel.app`
4. Render will auto-restart

### Step 6: Set Up MongoDB Atlas (Free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a free cluster
4. Get connection string
5. Add to Render environment variables as `MONGO_URI`

## ✅ Done!

- **Frontend**: `https://your-app.vercel.app` (public, anyone can visit)
- **Backend**: `https://your-backend.onrender.com` (private API)
- **Source Code**: Private on GitHub (only you can see it)

## 🔒 Security Checklist

- ✅ Source code is private on GitHub
- ✅ `.env` files are gitignored
- ✅ Environment variables set in hosting platforms
- ✅ CORS configured to only allow your frontend
- ✅ MongoDB connection string secured

## 🆘 Troubleshooting

**Frontend can't reach backend?**
- Check CORS_ORIGIN in backend matches frontend URL exactly
- Check REACT_APP_API_URL in frontend matches backend URL
- Make sure both are using `https://`

**Build fails?**
- Check build logs in Vercel/Render
- Make sure all dependencies are in package.json
- Check for any hardcoded localhost URLs

**Backend not starting?**
- Check MongoDB connection string
- Verify all environment variables are set
- Check Render logs for errors









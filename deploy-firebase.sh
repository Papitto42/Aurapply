#!/bin/bash

# Firebase Deployment Script for AurApply
# This script helps you deploy your frontend to Firebase Hosting

set -e  # Exit on error

echo "🔥 Firebase Deployment Script"
echo "=============================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found!"
    echo "   Install it with: npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "⚠️  Not logged in to Firebase"
    echo "   Running: firebase login"
    firebase login
fi

# Check if firebase.json exists
if [ ! -f "firebase.json" ]; then
    echo "⚠️  firebase.json not found. Initializing Firebase..."
    firebase init hosting --project default
fi

# Build frontend
echo ""
echo "📦 Building frontend..."
cd frontend

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "⚠️  .env.production not found!"
    echo "   Creating template..."
    echo "REACT_APP_API_URL=https://your-backend-url.onrender.com" > .env.production
    echo ""
    echo "⚠️  Please edit frontend/.env.production and set your backend URL"
    echo "   Then run this script again."
    exit 1
fi

npm run build

if [ ! -d "build" ]; then
    echo "❌ Build failed! build/ directory not found."
    exit 1
fi

cd ..

# Deploy to Firebase
echo ""
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Update your backend CORS to allow your Firebase URL"
echo "   2. Test your deployed app"
echo "   3. Set up custom domain (optional)"
echo ""


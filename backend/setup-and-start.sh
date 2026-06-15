#!/bin/bash

# All-in-one setup and start script for minimal MongoDB database
# This script does everything: setup, start MongoDB, test, create users, and start server

set -e  # Exit on any error

echo "🚀 Starting complete setup and start process..."
echo ""

# Navigate to backend directory
cd "$(dirname "$0")"
echo "📁 Working directory: $(pwd)"
echo ""

# Step 1: Run setup script (installs MongoDB if needed, creates directories)
echo "Step 1/5: Setting up MongoDB..."
if [ -f "./setup-minimal-db.sh" ]; then
    chmod +x ./setup-minimal-db.sh
    ./setup-minimal-db.sh
else
    echo "⚠️  setup-minimal-db.sh not found, running minimal setup..."
    # Create minimal data directory
    mkdir -p ~/.mongodb/aurapply-data
    # Create .env if it doesn't exist
    if [ ! -f .env ]; then
        cp env.template .env 2>/dev/null || echo "MONGO_URI=mongodb://localhost:27017/aurapply" > .env
        echo "✅ Created .env file"
    fi
fi
echo ""

# Step 2: Start MongoDB
echo "Step 2/5: Starting MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is already running"
else
    if command -v brew &> /dev/null && brew services list | grep -q "mongodb-community"; then
        brew services start mongodb-community
        echo "✅ MongoDB started via brew services"
    elif [ -f "./start-minimal-mongodb.sh" ]; then
        chmod +x ./start-minimal-mongodb.sh
        ./start-minimal-mongodb.sh
    else
        echo "⚠️  Attempting to start MongoDB manually..."
        mkdir -p ~/.mongodb
        mongod --dbpath ~/.mongodb/aurapply-data --logpath ~/.mongodb/mongod.log --bind_ip 127.0.0.1 --fork 2>/dev/null || {
            echo "❌ Could not start MongoDB automatically"
            echo "   Please install MongoDB: brew tap mongodb/brew && brew install mongodb-community"
            echo "   Then run: brew services start mongodb-community"
            exit 1
        }
        echo "✅ MongoDB started manually"
    fi
    # Wait a moment for MongoDB to start
    sleep 2
fi
echo ""

# Step 3: Test connection
echo "Step 3/5: Testing MongoDB connection..."
if node setupMongoDB.js 2>/dev/null; then
    echo "✅ MongoDB connection successful"
else
    echo "⚠️  Connection test failed, but continuing..."
fi
echo ""

# Step 4: Create test users (optional - don't fail if this fails)
echo "Step 4/5: Creating test users (optional)..."
if [ -f "createTestUsers.js" ]; then
    node createTestUsers.js 2>/dev/null || echo "⚠️  Test user creation skipped (already exists or error)"
else
    echo "⚠️  createTestUsers.js not found, skipping..."
fi
echo ""

# Step 5: Start server
echo "Step 5/5: Starting backend server..."
echo ""
echo "✅ Setup complete! Starting server..."
echo "📝 Server will run on http://localhost:5001"
echo "🛑 Press Ctrl+C to stop the server"
echo ""
echo "────────────────────────────────────────"
echo ""

node server.js

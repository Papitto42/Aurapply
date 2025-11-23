#!/bin/bash

# MongoDB Setup and Start Script

echo "🔍 Checking MongoDB installation..."

# Check if MongoDB is installed via Homebrew
if brew list mongodb-community &>/dev/null; then
    echo "✅ MongoDB is installed via Homebrew"
    
    # Check if MongoDB is running
    if brew services list | grep -q "mongodb-community.*started"; then
        echo "✅ MongoDB is already running!"
        echo ""
        echo "You can now:"
        echo "  1. Run: node server.js"
        echo "  2. Create test users: node createTestUsers.js"
    else
        echo "⏳ Starting MongoDB..."
        brew services start mongodb-community
        sleep 3
        
        if brew services list | grep -q "mongodb-community.*started"; then
            echo "✅ MongoDB started successfully!"
            echo ""
            echo "You can now:"
            echo "  1. Run: node server.js"
            echo "  2. Create test users: node createTestUsers.js"
        else
            echo "❌ Failed to start MongoDB"
            echo "   Try: brew services restart mongodb-community"
        fi
    fi
else
    echo "❌ MongoDB not found"
    echo ""
    echo "Would you like to install MongoDB? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo ""
        echo "Installing MongoDB..."
        brew tap mongodb/brew
        brew install mongodb-community
        
        echo ""
        echo "Starting MongoDB..."
        brew services start mongodb-community
        
        echo ""
        echo "✅ MongoDB installed and started!"
        echo ""
        echo "You can now:"
        echo "  1. Run: node server.js"
        echo "  2. Create test users: node createTestUsers.js"
    else
        echo ""
        echo "💡 Alternative: Use MongoDB Atlas (Cloud - Free)"
        echo "  1. Go to: https://www.mongodb.com/cloud/atlas/register"
        echo "  2. Create a free cluster"
        echo "  3. Update .env file with your connection string"
    fi
fi




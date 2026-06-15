#!/bin/bash

# Minimal MongoDB Setup for Local Development
# This script sets up a very small local MongoDB database

echo "🔧 Setting up minimal local MongoDB database..."
echo ""

# Check if MongoDB is already installed
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is already installed"
else
    echo "📦 Installing MongoDB Community Edition..."
    brew tap mongodb/brew
    brew install mongodb-community
    
    if [ $? -eq 0 ]; then
        echo "✅ MongoDB installed successfully"
    else
        echo "❌ Failed to install MongoDB"
        exit 1
    fi
fi

# Create minimal data directory
DATA_DIR="$HOME/.mongodb/aurapply-data"
mkdir -p "$DATA_DIR"

echo ""
echo "📁 Database directory: $DATA_DIR"
echo ""

# Check if MongoDB is running
if pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is already running"
    echo "   You may want to stop it first: brew services stop mongodb-community"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    # Start MongoDB with minimal configuration
    echo "🚀 Starting MongoDB with minimal settings..."
    
    # Create minimal MongoDB config
    CONFIG_FILE="$HOME/.mongodb/mongod.conf"
    cat > "$CONFIG_FILE" << EOF
storage:
  dbPath: $DATA_DIR
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
      cacheSizeGB: 0.25  # Very small cache (256MB)

net:
  port: 27017
  bindIp: 127.0.0.1

systemLog:
  destination: file
  path: $HOME/.mongodb/mongod.log
  logAppend: true

processManagement:
  fork: false
EOF

    echo "✅ MongoDB configuration created at: $CONFIG_FILE"
    echo ""
    echo "🎯 To start MongoDB, run one of these:"
    echo ""
    echo "Option 1: Start as service (recommended)"
    echo "  brew services start mongodb-community"
    echo ""
    echo "Option 2: Start manually (for this session only)"
    echo "  mongod --config $CONFIG_FILE"
    echo ""
    echo "Then verify it's running:"
    echo "  mongosh --eval 'db.adminCommand(\"ping\")'"
    echo ""
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.template .env
    echo "✅ .env file created with default local MongoDB settings"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start MongoDB: brew services start mongodb-community"
echo "2. Test connection: cd backend && node setupMongoDB.js"
echo "3. Create test users: cd backend && node createTestUsers.js"
echo "4. Start server: cd backend && node server.js"
echo ""

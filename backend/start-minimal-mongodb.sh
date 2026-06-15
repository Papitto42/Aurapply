#!/bin/bash

# Start MongoDB with minimal configuration for local development

echo "🚀 Starting MongoDB with minimal settings..."

# Create data directory if it doesn't exist
DATA_DIR="$HOME/.mongodb/aurapply-data"
mkdir -p "$DATA_DIR"

# Create log directory if it doesn't exist
LOG_DIR="$HOME/.mongodb"
mkdir -p "$LOG_DIR"

# Check if MongoDB is already running
if pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is already running"
    echo "   To stop it: brew services stop mongodb-community"
    exit 1
fi

# Start MongoDB with minimal config
echo "📁 Data directory: $DATA_DIR"
echo "📝 Log file: $LOG_DIR/mongod.log"
echo ""

# Try to start with service first
if command -v brew &> /dev/null && brew services list | grep -q "mongodb-community"; then
    echo "Starting via brew services..."
    brew services start mongodb-community
    
    if [ $? -eq 0 ]; then
        echo "✅ MongoDB started successfully!"
        echo ""
        echo "To stop: brew services stop mongodb-community"
        echo "To check status: brew services list | grep mongodb"
    else
        echo "❌ Failed to start MongoDB via brew services"
        exit 1
    fi
else
    # Fallback: start manually
    echo "Starting MongoDB manually..."
    mongod --dbpath "$DATA_DIR" --logpath "$LOG_DIR/mongod.log" --bind_ip 127.0.0.1 --fork
    
    if [ $? -eq 0 ]; then
        echo "✅ MongoDB started successfully!"
        echo ""
        echo "To stop: pkill mongod"
    else
        echo "❌ Failed to start MongoDB"
        exit 1
    fi
fi

echo ""
echo "Test connection: mongosh --eval 'db.adminCommand(\"ping\")'"
echo ""

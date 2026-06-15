#!/bin/bash

# AurApply — one double-click: MongoDB (if installed), backend, frontend. No manual steps.

set -e

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

# Load nvm if present
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  . "$HOME/.nvm/nvm.sh" 2>/dev/null || true
  command -v nvm >/dev/null 2>&1 && nvm use default >/dev/null 2>&1 || true
fi

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "❌ Node.js not found. Install from https://nodejs.org or run: brew install node"
  exit 1
fi

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_LOG="$PROJECT_ROOT/backend.log"

# Ensure backend .env exists so PORT and MONGO_URI are set
if [ ! -f "$BACKEND_DIR/.env" ]; then
  [ -f "$BACKEND_DIR/env.template" ] && cp "$BACKEND_DIR/env.template" "$BACKEND_DIR/.env"
fi

# Install deps if needed
[ ! -d "$BACKEND_DIR/node_modules" ]  && (cd "$BACKEND_DIR" && npm install --silent)
[ ! -d "$FRONTEND_DIR/node_modules" ] && (cd "$FRONTEND_DIR" && npm install --silent)

echo ""
echo "🚀 AurApply — starting everything..."
echo ""

# --- MongoDB: start if installed, then wait until reachable ---
if command -v mongod >/dev/null 2>&1 || brew services list 2>/dev/null | grep -q mongodb; then
  echo "🟢 MongoDB: starting..."
  brew services start mongodb-community 2>/dev/null || true
  # Wait for MongoDB to accept connections (up to 15s)
  for i in $(seq 1 15); do
    if mongosh --quiet --eval 'db.adminCommand("ping")' 1>/dev/null 2>&1; then
      echo "🟢 MongoDB: connected"
      break
    fi
    sleep 1
  done
else
  echo "🟡 MongoDB: not installed locally (using .env MONGO_URI or in-memory fallback)"
fi

# --- Backend: kill any existing backend, then start fresh ---
if curl -s -o /dev/null --connect-timeout 1 http://localhost:5001 2>/dev/null; then
  echo "🟡 Backend: stopping old instance on port 5001..."
  lsof -ti:5001 | xargs kill -9 2>/dev/null || true
  sleep 1
fi

echo "🟢 Backend: starting on port 5001..."
cd "$BACKEND_DIR"
export NODE_ENV=development
PORT=5001 nohup node server.js >> "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
cd "$PROJECT_ROOT"

# Create test user automatically if backend is up
sleep 3
if curl -s -o /dev/null --connect-timeout 1 http://localhost:5001 2>/dev/null; then
  echo "🟢 Creating auto-login account..."
  (cd "$BACKEND_DIR" && node createTestUsers.js >> "$BACKEND_LOG" 2>&1 || true)
fi

  cleanup() {
    echo ""
    echo "🛑 Stopping backend..."
    kill $BACKEND_PID 2>/dev/null || true
    exit 0
  }
  trap cleanup INT TERM

  for i in $(seq 1 15); do
    if curl -s -o /dev/null --connect-timeout 1 http://localhost:5001 2>/dev/null; then
      echo "🟢 Backend: running on http://localhost:5001"
      break
    fi
    sleep 1
  done

  if ! curl -s -o /dev/null --connect-timeout 1 http://localhost:5001 2>/dev/null; then
    echo "⚠️  Backend slow to start. Check: $BACKEND_LOG"
  fi

echo "🟢 Frontend: starting (browser will open at http://localhost:3000)..."
echo ""
cd "$FRONTEND_DIR"
unset PORT
ulimit -n 65536 2>/dev/null || true
CHOKIDAR_USEPOLLING=true WATCHPACK_POLLING=true npm start

# If we started backend in this run, cleanup on exit (Ctrl+C)
[ -n "$BACKEND_PID" ] && kill $BACKEND_PID 2>/dev/null || true

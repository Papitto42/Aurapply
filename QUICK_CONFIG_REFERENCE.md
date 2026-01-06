# ⚡ Quick Configuration Reference

**For full details, see [CONFIGURATION.md](./CONFIGURATION.md)**

## 🔑 Essential Environment Variables

Create `backend/.env` file:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/aurapply
JWT_SECRET=SECRET_KEY_CHANGE_IN_PRODUCTION
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
```

## 🔌 Ports

- **Frontend:** `3000`
- **Backend:** `5001` ⚠️ **IMPORTANT:** All API calls use port 5001

## 📍 API Base URL

All frontend API calls use: `http://localhost:5001`

## 🗄️ MongoDB

**Local:**
```bash
brew services start mongodb-community
```

**Atlas:**
- Get connection string from MongoDB Atlas
- Update `MONGO_URI` in `.env`

## 🚀 Quick Start

```bash
# Backend
cd backend
npm install
cp .env.example .env  # Edit .env with your values
node server.js

# Frontend (new terminal)
cd frontend
npm install
npm start
```

## 🎨 Key Colors

- Primary: `#FF4D00` (Orange)
- Trust Blue: `#0066FF`
- Success Green: `#10B981`
- Background: `#050505`

## 📝 Important Files

- `backend/.env` - Environment variables (create from `.env.example`)
- `backend/server.js` - Server configuration
- `frontend/tailwind.config.js` - Tailwind CSS config
- `frontend/src/index.css` - Global styles and CSS variables

---

**Full documentation:** [CONFIGURATION.md](./CONFIGURATION.md)










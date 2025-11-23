# AurApply

The operating system for your career growth. Automate your job search and land your dream role faster.

## 🚀 Features

- AI-Powered Job Matching
- Auto-Fill Applications across 50+ job boards
- Real-Time Analytics
- Privacy First - Encrypted data storage
- Lightning Fast application submission
- Fully Customizable

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS
- Framer Motion
- React Router

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Google Gemini AI

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.template .env
```

4. Edit `.env` with your configuration (MongoDB URI, API keys, etc.)

5. Start MongoDB (if using local):
```bash
./startMongoDB.sh
```

6. Run the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## 📝 Environment Variables

See `backend/env.template` for required environment variables.

**Important:** Never commit `.env` files to version control!

## 🔐 Security

- All sensitive data is stored in `.env` files (gitignored)
- JWT tokens for authentication
- Encrypted data storage
- CORS protection

## 📄 License

Copyright © 2025 AurApply Inc. All rights reserved.

## 👥 Contributing

This is a private repository. For access, please contact the repository owner.


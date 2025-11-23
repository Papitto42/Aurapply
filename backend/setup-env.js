#!/usr/bin/env node

/**
 * Setup script to create .env file from .env.example
 * Run: node setup-env.js
 */

const fs = require('fs');
const path = require('path');

const envExamplePath = path.join(__dirname, '.env.example');
const envPath = path.join(__dirname, '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping setup.');
  console.log('   If you want to recreate it, delete .env and run this script again.');
  process.exit(0);
}

// Check if .env.example exists
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ .env.example file not found!');
  console.log('   Creating a default .env file...');
  
  // Create default .env content
  const defaultEnv = `# Backend Environment Configuration
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-${Date.now()}
MONGO_URI=mongodb://localhost:27017/aurapply
CORS_ORIGIN=http://localhost:3000
JWT_EXPIRES_IN=24h
`;
  
  fs.writeFileSync(envPath, defaultEnv);
  console.log('✅ Created default .env file');
  console.log('⚠️  Please update JWT_SECRET with a secure random string!');
  process.exit(0);
}

// Copy .env.example to .env
try {
  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
  fs.writeFileSync(envPath, envExampleContent);
  console.log('✅ Created .env file from .env.example');
  console.log('⚠️  Please update JWT_SECRET with a secure random string!');
  console.log('   You can generate one using: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
}




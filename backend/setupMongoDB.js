require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aurapply';

console.log('🔍 Checking MongoDB connection...\n');
console.log(`Connection URI: ${MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}\n`);

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000
})
.then(async () => {
  console.log('✅ MongoDB connection successful!\n');
  
  // Test database access
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log(`📊 Found ${collections.length} collections in database\n`);
  
  if (collections.length > 0) {
    console.log('Collections:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
  }
  
  // Check if User model works
  const User = require('./models/User');
  const userCount = await User.countDocuments();
  console.log(`\n👥 Total users in database: ${userCount}\n`);
  
  console.log('✨ MongoDB setup is complete!\n');
  console.log('You can now:');
  console.log('  1. Start your backend server: node server.js');
  console.log('  2. Create test users: node createTestUsers.js');
  console.log('  3. Check users: node checkUsers.js\n');
  
  mongoose.connection.close();
  process.exit(0);
})
.catch((err) => {
  console.error('❌ MongoDB connection failed!\n');
  console.error(`Error: ${err.message}\n`);
  
  if (err.message.includes('ECONNREFUSED')) {
    console.log('💡 Solutions:\n');
    console.log('OPTION 1: Install and start MongoDB locally (macOS):');
    console.log('  1. Install MongoDB:');
    console.log('     brew tap mongodb/brew');
    console.log('     brew install mongodb-community\n');
    console.log('  2. Start MongoDB:');
    console.log('     brew services start mongodb-community\n');
    console.log('  3. Verify it\'s running:');
    console.log('     brew services list | grep mongodb\n');
    
    console.log('OPTION 2: Use MongoDB Atlas (Cloud - Free):');
    console.log('  1. Go to: https://www.mongodb.com/cloud/atlas/register');
    console.log('  2. Create a free cluster');
    console.log('  3. Get your connection string');
    console.log('  4. Update .env file with:');
    console.log('     MONGO_URI=your_mongodb_atlas_connection_string\n');
  } else if (err.message.includes('authentication failed')) {
    console.log('💡 Authentication error:');
    console.log('  - Check your username and password in MONGO_URI');
    console.log('  - Make sure your IP is whitelisted in MongoDB Atlas\n');
  } else {
    console.log('💡 Check your MONGO_URI in .env file\n');
  }
  
  process.exit(1);
});




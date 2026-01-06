require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aurapply';

console.log('\n🔍 Checking database for accounts...\n');
console.log('='.repeat(70));

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000
})
.then(async () => {
  console.log('✅ MongoDB Connected Successfully\n');
  
  try {
    // Get all users (excluding password hashes)
    const users = await User.find({}).select('email name applications createdAt').lean();
    
    if (users.length === 0) {
      console.log('❌ No accounts found in the database.\n');
      console.log('💡 To create test accounts, run:');
      console.log('   node createTestUsers.js\n');
      console.log('📋 Test Account Credentials (will be created):\n');
      console.log('   1. Email: test@aurapply.com | Password: test123');
      console.log('   2. Email: demo@aurapply.com | Password: demo123');
      console.log('   3. Email: admin@aurapply.com | Password: admin123\n');
      console.log('   Or register a new account at: http://localhost:3000/auth\n');
    } else {
      console.log(`✅ Found ${users.length} account(s) in the database:\n`);
      console.log('📋 Account Credentials:\n');
      console.log('='.repeat(70));
      
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. Email: ${user.email}`);
        console.log(`   Name: ${user.name || 'Not set'}`);
        console.log(`   Created: ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}`);
        console.log(`   Applications: ${user.applications?.length || 0}`);
        
        if (user.applications && user.applications.length > 0) {
          console.log(`   Recent applications:`);
          user.applications.slice(-3).forEach(app => {
            console.log(`      - ${app.jobTitle || app.title} at ${app.company} (${app.status})`);
          });
        }
      });
      
      console.log('\n' + '='.repeat(70));
      console.log('\n⚠️  Note: Passwords are encrypted and cannot be retrieved.');
      console.log('   If you forgot a password, you can register a new account or reset it.\n');
      
      // Show test account passwords if they exist
      const testEmails = ['test@aurapply.com', 'demo@aurapply.com', 'admin@aurapply.com'];
      const testPasswords = { 
        'test@aurapply.com': 'test123',
        'demo@aurapply.com': 'demo123',
        'admin@aurapply.com': 'admin123'
      };
      
      const testAccounts = users.filter(u => testEmails.includes(u.email));
      if (testAccounts.length > 0) {
        console.log('🔑 Test Account Passwords (pre-configured):\n');
        testAccounts.forEach(user => {
          if (testPasswords[user.email]) {
            console.log(`   ${user.email} → Password: ${testPasswords[user.email]}`);
          }
        });
        console.log('');
      }
    }
    
    mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error fetching users:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
})
.catch((err) => {
  console.log('❌ MongoDB connection failed!\n');
  console.log(`Error: ${err.message}\n`);
  console.log('='.repeat(70));
  console.log('\n💡 MongoDB is not running. Options:\n');
  console.log('OPTION 1: Start MongoDB locally');
  console.log('  brew services start mongodb-community\n');
  console.log('OPTION 2: Use MongoDB Atlas (Cloud)');
  console.log('  Update MONGO_URI in backend/.env with your Atlas connection string\n');
  console.log('OPTION 3: Create accounts anyway (will be saved when MongoDB is running)');
  console.log('  Go to: http://localhost:3000/auth\n');
  console.log('='.repeat(70));
  console.log('\n📋 Pre-configured Test Accounts (run createTestUsers.js once MongoDB is running):\n');
  console.log('   1. Email: test@aurapply.com | Password: test123');
  console.log('   2. Email: demo@aurapply.com | Password: demo123');
  console.log('   3. Email: admin@aurapply.com | Password: admin123\n');
  console.log('   To create these: node createTestUsers.js\n');
  process.exit(1);
});











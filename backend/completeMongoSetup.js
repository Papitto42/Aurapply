require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupMongoDB() {
  console.log('\n🔧 MongoDB Setup Completion\n');
  console.log('='.repeat(60));
  
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aurapply';
  console.log(`Current MONGO_URI: ${MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}\n`);
  
  // Test current connection
  console.log('🔍 Testing connection...\n');
  
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    
    console.log('✅ MongoDB connection successful!\n');
    
    // Check database
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    console.log(`👥 Current users in database: ${userCount}\n`);
    
    // Ask if they want to create test users
    if (userCount === 0) {
      const createUsers = await question('Create test users? (y/n): ');
      if (createUsers.toLowerCase() === 'y') {
        console.log('\n📝 Creating test users...\n');
        
        const bcrypt = require('bcryptjs');
        const testUsers = [
          {
            email: 'test@aurapply.com',
            password: await bcrypt.hash('test123', 10),
            name: 'Test User',
            applications: [
              {
                jobTitle: 'Frontend Developer',
                company: 'TechCorp',
                status: 'Sent',
                date: new Date()
              },
              {
                jobTitle: 'Product Designer',
                company: 'DesignStudio',
                status: 'Viewed',
                date: new Date(Date.now() - 86400000)
              }
            ]
          },
          {
            email: 'demo@aurapply.com',
            password: await bcrypt.hash('demo123', 10),
            name: 'Demo User'
          },
          {
            email: 'admin@aurapply.com',
            password: await bcrypt.hash('admin123', 10),
            name: 'Admin User'
          }
        ];
        
        for (const userData of testUsers) {
          const existing = await User.findOne({ email: userData.email });
          if (existing) {
            console.log(`⚠️  ${userData.email} already exists`);
          } else {
            await User.create(userData);
            console.log(`✅ Created: ${userData.email}`);
          }
        }
        
        console.log('\n✨ Test users created!\n');
        console.log('Test Accounts:');
        console.log('  - test@aurapply.com / test123');
        console.log('  - demo@aurapply.com / demo123');
        console.log('  - admin@aurapply.com / admin123\n');
      }
    }
    
    console.log('='.repeat(60));
    console.log('\n✅ MongoDB setup complete!\n');
    console.log('Next steps:');
    console.log('  1. Start backend: node server.js');
    console.log('  2. Start frontend: cd ../frontend && npm start');
    console.log('  3. Open http://localhost:3000\n');
    
    mongoose.connection.close();
    rl.close();
    process.exit(0);
    
  } catch (err) {
    console.log('❌ Connection failed!\n');
    console.log(`Error: ${err.message}\n`);
    console.log('='.repeat(60));
    console.log('\n💡 Options to fix:\n');
    
    console.log('OPTION 1: Install MongoDB locally (macOS)\n');
    console.log('  Run these commands:');
    console.log('    brew tap mongodb/brew');
    console.log('    brew install mongodb-community');
    console.log('    brew services start mongodb-community\n');
    
    console.log('OPTION 2: Use MongoDB Atlas (Cloud - Free & Recommended)\n');
    console.log('  1. Go to: https://www.mongodb.com/cloud/atlas/register');
    console.log('  2. Sign up (free tier available)');
    console.log('  3. Create a free cluster (M0)');
    console.log('  4. Click "Connect" → "Connect your application"');
    console.log('  5. Copy the connection string');
    console.log('  6. Update .env file:\n');
    console.log('     MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/aurapply?retryWrites=true&w=majority\n');
    
    const useAtlas = await question('Do you have a MongoDB Atlas connection string? (y/n): ');
    
    if (useAtlas.toLowerCase() === 'y') {
      const atlasUri = await question('\nPaste your MongoDB Atlas connection string: ');
      
      if (atlasUri.trim()) {
        // Update .env file
        const fs = require('fs');
        const path = require('path');
        const envPath = path.join(__dirname, '.env');
        
        let envContent = fs.readFileSync(envPath, 'utf8');
        envContent = envContent.replace(/MONGO_URI=.*/, `MONGO_URI=${atlasUri.trim()}`);
        fs.writeFileSync(envPath, envContent);
        
        console.log('\n✅ Updated .env file! Testing connection...\n');
        
        // Test new connection
        try {
          await mongoose.disconnect();
          await mongoose.connect(atlasUri.trim(), {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000
          });
          
          console.log('✅ MongoDB Atlas connection successful!\n');
          console.log('Now run this script again to complete setup:\n');
          console.log('  node completeMongoSetup.js\n');
          
        } catch (atlasErr) {
          console.log('❌ Atlas connection failed:', atlasErr.message);
          console.log('\n💡 Make sure:');
          console.log('  - Your IP address is whitelisted in Atlas');
          console.log('  - Your username and password are correct');
          console.log('  - Network access is enabled\n');
        }
      }
    }
    
    rl.close();
    process.exit(1);
  }
}

setupMongoDB();











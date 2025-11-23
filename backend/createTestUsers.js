require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aurapply')
.then(async () => {
  console.log('MongoDB Connected\n');
  
  try {
    // Test users to create
    const testUsers = [
      {
        email: 'test@aurapply.com',
        password: 'test123',
        name: 'Test User'
      },
      {
        email: 'demo@aurapply.com',
        password: 'demo123',
        name: 'Demo User'
      },
      {
        email: 'admin@aurapply.com',
        password: 'admin123',
        name: 'Admin User'
      }
    ];

    console.log('Creating test users...\n');
    
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
      } else {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await User.create({
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
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
        });
        console.log(`✅ Created user: ${userData.email}`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n📧 Test Accounts Created:\n');
    testUsers.forEach(user => {
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Name: ${user.name}\n`);
    });
    console.log('='.repeat(60));
    console.log('\n✨ You can now sign in with any of these accounts!\n');
    
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    mongoose.connection.close();
  }
}).catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('\n💡 Make sure MongoDB is running on your system.');
  console.log('   On macOS: brew services start mongodb-community');
  console.log('   Or check if your MONGO_URI in .env is correct.\n');
});


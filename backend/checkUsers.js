require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aurapply')
.then(async () => {
  console.log('MongoDB Connected');
  
  try {
    const users = await User.find({}).select('email name applications').lean();
    
    if (users.length === 0) {
      console.log('\n❌ No users found in the database.');
      console.log('You can create an account by registering through the frontend at http://localhost:3000\n');
    } else {
      console.log(`\n✅ Found ${users.length} user(s) in the database:\n`);
      console.log('='.repeat(60));
      
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. Email: ${user.email}`);
        console.log(`   Name: ${user.name || 'Not set'}`);
        console.log(`   Applications: ${user.applications?.length || 0}`);
        if (user.applications && user.applications.length > 0) {
          console.log(`   Recent applications:`);
          user.applications.slice(-3).forEach(app => {
            console.log(`      - ${app.jobTitle} at ${app.company} (${app.status})`);
          });
        }
      });
      
      console.log('\n' + '='.repeat(60));
      console.log('\n📧 You can sign in with any of these email addresses.\n');
    }
    
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    mongoose.connection.close();
  }
}).catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('\n💡 Make sure MongoDB is running on your system.');
  console.log('   On macOS: brew services start mongodb-community');
  console.log('   Or check if your MONGO_URI in .env is correct.\n');
});





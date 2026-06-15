// Quick test to check if backend is responding
const axios = require('axios');

const PORT = process.env.PORT || 5001; // Backend runs on port 5001 by default
const API_URL = `http://localhost:${PORT}`;

async function testConnection() {
  try {
    console.log(`Testing backend connection on port ${PORT}...\n`);
    
    // Test 1: Try to register a test account
    console.log('Test 1: Attempting to register test account...');
    try {
      const registerResponse = await axios.post(`${API_URL}/api/auth/register`, {
        email: 'test@test.com',
        password: 'test123',
        name: 'Test User'
      }, {
        timeout: 5000
      });
      
      console.log('✅ Registration successful!');
      console.log('Response:', registerResponse.data);
    } catch (registerError) {
      if (registerError.response?.status === 400 && registerError.response?.data?.error?.includes('already registered')) {
        console.log('ℹ️  Account already exists, trying to login instead...');
      } else {
        throw registerError;
      }
    }
    
    // Test 2: Try to login
    console.log('\nTest 2: Attempting to login...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'test@test.com',
      password: 'test123'
    }, {
      timeout: 5000
    });
    
    console.log('✅ Login successful!');
    console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
    console.log('User:', loginResponse.data.user);
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log(`❌ Backend server is not running on port ${PORT}`);
      console.log(`   Start it with: cd backend && node server.js`);
    } else if (error.response) {
      console.log(`✅ Backend is running on port ${PORT}!`);
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
      
      if (error.response.status === 400) {
        console.log('\n💡 Tip: The account might already exist. Try logging in directly:');
        console.log(`   Email: test@test.com`);
        console.log(`   Password: test123`);
      }
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testConnection();











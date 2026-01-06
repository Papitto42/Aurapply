// Quick test to check if backend is responding
const axios = require('axios');

async function testConnection() {
  try {
    console.log('Testing backend connection...\n');
    
    // Test 1: Check if server is running
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      email: 'test@test.com',
      password: 'test123',
      name: 'Test User'
    }, {
      timeout: 5000
    });
    
    console.log('✅ Backend is responding!');
    console.log('Response:', response.data);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is not running on port 5000');
      console.log('   Start it with: cd backend && node server.js');
    } else if (error.response) {
      console.log('✅ Backend is running!');
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testConnection();











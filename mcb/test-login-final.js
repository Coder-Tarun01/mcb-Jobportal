// Final login test
const API_BASE_URL = 'http://localhost:4000/api';

async function testLoginFinal() {
  try {
    console.log('=== Final Login Test ===');
    
    // Test with existing user from seed data
    console.log('Testing login with seed user...');
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'debug@example.com',
        password: 'password123'
      })
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (response.status === 200) {
      console.log('✅ LOGIN WORKING! Token:', data.token ? 'Present' : 'Missing');
      console.log('✅ User data:', data.user ? 'Present' : 'Missing');
    } else {
      console.log('❌ LOGIN FAILED:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

testLoginFinal();

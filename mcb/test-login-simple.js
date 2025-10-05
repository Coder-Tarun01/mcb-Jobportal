// Test login with existing user from seed data
const API_BASE_URL = 'http://localhost:4000/api';

async function testLoginSimple() {
  try {
    console.log('Testing login with existing user from seed data...');
    
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
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testLoginSimple();

// Debug login endpoint
const API_BASE_URL = 'http://localhost:4000/api';

async function testLoginDebug() {
  try {
    console.log('=== Debug Login Test ===');
    
    // Test 1: Try with existing user from seed data
    console.log('\n1. Testing with seed user (debug@example.com)...');
    const response1 = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'debug@example.com',
        password: 'password123'
      })
    });

    console.log('Response status:', response1.status);
    const data1 = await response1.json();
    console.log('Response data:', data1);

    // Test 2: Try with newly created user
    console.log('\n2. Testing with newly created user (testlogin6@example.com)...');
    const response2 = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testlogin6@example.com',
        password: 'password123'
      })
    });

    console.log('Response status:', response2.status);
    const data2 = await response2.json();
    console.log('Response data:', data2);

    // Test 3: Try with invalid credentials
    console.log('\n3. Testing with invalid credentials...');
    const response3 = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      })
    });

    console.log('Response status:', response3.status);
    const data3 = await response3.json();
    console.log('Response data:', data3);
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testLoginDebug();

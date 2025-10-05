// Test full auth flow
const API_BASE_URL = 'http://localhost:4000/api';

async function testFullAuth() {
  try {
    console.log('=== Testing Full Auth Flow ===');
    
    // Step 1: Register a new user
    console.log('\n1. Registering new user...');
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Login User',
        email: 'testlogin6@example.com',
        password: 'password123',
        role: 'employee',
        phone: '1234567890'
      })
    });

    console.log('Register status:', registerResponse.status);
    const registerData = await registerResponse.json();
    console.log('Register response:', registerData);

    if (registerData.token) {
      console.log('\n2. Testing login with newly created user...');
      
      // Step 2: Try to login with the same credentials
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'testlogin6@example.com',
          password: 'password123'
        })
      });

      console.log('Login status:', loginResponse.status);
      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);

      if (loginData.token) {
        console.log('\n3. Testing /me endpoint...');
        
        // Step 3: Test the /me endpoint
        const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginData.token}`,
            'Content-Type': 'application/json',
          }
        });

        console.log('Me status:', meResponse.status);
        const meData = await meResponse.json();
        console.log('Me response:', meData);
      }
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

testFullAuth();

// Complete authentication test
const API_BASE_URL = 'http://localhost:4000/api';

async function testAuthComplete() {
  try {
    console.log('=== Complete Authentication Test ===');
    
    // Test 1: Register a new user
    console.log('\n1. Testing user registration...');
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'employee',
        phone: '1234567890'
      })
    });

    console.log('Register status:', registerResponse.status);
    const registerData = await registerResponse.json();
    console.log('Register response:', registerData);

    if (registerResponse.status === 201) {
      console.log('✅ Registration successful!');
      
      // Test 2: Login with the registered user
      console.log('\n2. Testing user login...');
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'testuser@example.com',
          password: 'password123'
        })
      });

      console.log('Login status:', loginResponse.status);
      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);

      if (loginResponse.status === 200) {
        console.log('✅ Login successful!');
        console.log('Token present:', !!loginData.token);
        console.log('User data present:', !!loginData.user);
        
        // Test 3: Test /me endpoint
        console.log('\n3. Testing /me endpoint...');
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

        if (meResponse.status === 200) {
          console.log('✅ /me endpoint successful!');
          console.log('\n🎉 ALL AUTHENTICATION TESTS PASSED!');
        } else {
          console.log('❌ /me endpoint failed');
        }
      } else {
        console.log('❌ Login failed:', loginData.message);
      }
    } else {
      console.log('❌ Registration failed:', registerData.message);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testAuthComplete();

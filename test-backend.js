// Simple script to test if the backend is running
const API_BASE_URL = 'http://localhost:4000/api';

async function testBackend() {
  try {
    console.log('Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData);
    } else {
      console.log('❌ Health check failed');
      return;
    }
    
    // Test jobs endpoint
    const jobsResponse = await fetch(`${API_BASE_URL}/jobs`);
    if (jobsResponse.ok) {
      const jobsData = await jobsResponse.json();
      console.log('✅ Jobs endpoint working, found', jobsData.length, 'jobs');
      console.log('Sample job:', jobsData[0]);
    } else {
      console.log('❌ Jobs endpoint failed:', jobsResponse.status);
    }
    
  } catch (error) {
    console.log('❌ Backend connection failed:', error.message);
    console.log('\nTo fix this:');
    console.log('1. Make sure you are in the api directory');
    console.log('2. Run: npm install');
    console.log('3. Run: npm run dev');
    console.log('4. Wait for "API listening on :4000" message');
  }
}

testBackend();

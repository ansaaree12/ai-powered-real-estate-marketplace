import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // ✅ Ensure the correct API URL

(async () => {
  try {
    console.log('🔍 Testing AI Ranking System...');

    // ✅ Make a request to fetch AI-ranked residencies
    const response = await axios.get(`${BASE_URL}/api/residency/ranked`);

    // ✅ Check if response is valid
    if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
      const topProperty = response.data[0]; // ✅ Get only 1 property
      console.log('✅ AI Ranking Test Passed: 1 Ranked Property Fetched.');
      console.log('🏠 Top Ranked Property:', topProperty);
    } else {
      console.error('❌ AI Ranking Test Failed: No valid property found.');
    }
  } catch (error) {
    console.error('❌ Error in AI Ranking Test:', error.message);
  }
})();

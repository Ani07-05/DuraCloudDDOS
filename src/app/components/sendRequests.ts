import axios from 'axios'

const DEMO_WEBSITE_URL = 'http://localhost:3000/api/real-time-stats'

export async function sendRequest() {
  try {
    // Send a POST request to the demo website (or GET depending on the API)
    const response = await axios.get(DEMO_WEBSITE_URL)
    return response.data
  } catch (error) {
    console.error('Error sending request to demo website:', error)
    return null
  }
}

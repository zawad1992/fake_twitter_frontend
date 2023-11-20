import axios from 'axios';

// Set the base URL for all Axios requests
axios.defaults.baseURL = 'http://127.0.0.1:8888/LARAVEL/fake_twitter_backend/api/';

export async function checkAuthentication() {
  try {
    // Replace '/auth/check' with your actual API endpoint for authentication checking
    const response = await axios.get('/authcheck');
    return response.data; // Assuming the API returns some user data if authenticated
  } catch (error) {
    // Handle different types of errors appropriately
    if (error.response && error.response.status === 401) {
      // Throw a custom error or a flag to indicate unauthenticated error
      throw { isUnauthenticated: true, message: 'User is not authenticated' };
    } else {
      // Throw other types of errors as they are
      throw error;
    }
  }
}

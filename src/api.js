import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8888/LARAVEL/fake_twitter_backend/api/';

function getAuthToken() {
  const auth = JSON.parse(sessionStorage.getItem('authorisation'));
  return auth ? auth.token : '';
}

export async function checkAuthentication() {
  try {
    const token = getAuthToken();
    const response = await axios.post('/refresh', {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    saveToSessionStorage(response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw { isUnauthenticated: true, message: 'User is not authenticated' };
    } else {
      throw error;
    }
  }
}

export function saveToSessionStorage(data) {
  if(data.user) {
    sessionStorage.setItem('user', JSON.stringify(data.user));
  }

  sessionStorage.setItem('authorisation', JSON.stringify(data.authorisation));
}

export async function apiGet(url) {
  try {
    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function apiPost(url, data) {
  try {
    const response = await axios.post(url, data, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

function handleApiError(error) {
  if (error.response && error.response.status === 401) {
    throw { isUnauthenticated: true, message: 'User is not authenticated' };
  } else {
    throw error;
  }
}

export async function apiLogout() {
  try {
    // Call backend logout API using apiPost
    await apiPost('/logout', {});

    // Clear user information from sessionStorage
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authorisation');
  } catch (error) {
    console.error("Logout failed:", error);
    throw error; // Optionally, rethrow the error to be handled by the caller
  }
}

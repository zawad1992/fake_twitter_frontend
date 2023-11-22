import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8888/LARAVEL/fake_twitter_backend/api/';


function getAuthToken() {
  try {
    const authString = sessionStorage.getItem('authorisation');
    if (authString) {
      const auth = JSON.parse(authString);
      return auth.token || '';
    }
  } catch (error) {
    // console.error("Error parsing authorisation from sessionStorage:", error);
  }
  return '';
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

export async function apiGet(url, includeAuth = true) {
  try {
    const headers = includeAuth ? { 'Authorization': `Bearer ${getAuthToken()}` } : {};
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}


export async function apiPost(url, data, includeAuth = true) {
  try {
    const headers = includeAuth ? { 'Authorization': `Bearer ${getAuthToken()}` } : {};
    const response = await axios.post(url, data, { headers });
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

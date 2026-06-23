import api from './api.js';

async function registerUser(formData) {
  const response = await api.post('/api/auth/register', formData);
  return response.data;
}

async function loginUser(formData) {
  const response = await api.post('/api/auth/login', formData);
  return response.data;
}

async function googleLogin(credential) {
  const response = await api.post('/api/auth/google', { credential });
  return response.data;
}

async function getCurrentUser() {
  const response = await api.get('/api/auth/me');
  return response.data;
}

export { getCurrentUser, googleLogin, loginUser, registerUser };


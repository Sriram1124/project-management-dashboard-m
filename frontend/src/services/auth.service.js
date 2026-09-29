import api from './api';

export const authService = {
  async login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    return data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore errors on logout
    }
    localStorage.removeItem('accessToken');
  },

  async getCurrentUser() {
    try {
      return await api.get('/auth/me');
    } catch (error) {
      return null;
    }
  }
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = {
  async fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'API Request Failed');
    }

    return response.json();
  },

  get(endpoint) {
    return this.fetchWithAuth(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.fetchWithAuth(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};

export default api;

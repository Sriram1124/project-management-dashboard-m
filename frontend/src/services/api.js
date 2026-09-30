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

  patch(endpoint, body) {
    return this.fetchWithAuth(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return this.fetchWithAuth(endpoint, {
      method: 'DELETE',
    });
  },

  async upload(endpoint, formData) {
    const token = localStorage.getItem('accessToken');
    const headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Upload failed');
    }

    return response.json();
  },

  async getBlob(endpoint) {
    const token = localStorage.getItem('accessToken');
    const headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch file');
    }

    return response.blob();
  },

  async downloadFile(endpoint, defaultFilename = 'download') {
    const blob = await this.getBlob(endpoint);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = defaultFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  },
};

export default api;

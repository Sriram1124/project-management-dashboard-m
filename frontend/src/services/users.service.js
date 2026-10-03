import api from './api';

export const usersService = {
  /**
   * Get organization users with optional type filter (INTERN | EMPLOYEE)
   */
  async getUsers(type) {
    const url = type && type !== 'ALL' ? `/users?type=${encodeURIComponent(type)}` : '/users';
    return await api.get(url);
  },

  /**
   * Manager provisions individual user
   */
  async createUser({ name, email, type }) {
    return await api.post('/users', { name, email, type });
  },

  /**
   * Validate CSV text for bulk import preview
   */
  async validateBulkCsv(csvContent) {
    return await api.post('/users/bulk/validate', { csv: csvContent });
  },

  /**
   * Confirm bulk creation with validated rows
   */
  async confirmBulkImport(rows) {
    return await api.post('/users/bulk', { rows });
  },

  /**
   * Manager resets user password, generating new temporary password
   */
  async resetPassword(userId) {
    return await api.post(`/users/${encodeURIComponent(userId)}/reset-password`);
  },

  /**
   * Manager deactivates organization user
   */
  async deactivateUser(userId) {
    return await api.post(`/users/${encodeURIComponent(userId)}/deactivate`);
  },
};

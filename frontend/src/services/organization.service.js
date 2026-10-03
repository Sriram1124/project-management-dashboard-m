import api from './api';

export const organizationService = {
  /**
   * List all platform organizations (Super Admin only)
   */
  async getOrganizations() {
    const res = await api.get('/organizations');
    return res.organizations || [];
  },

  /**
   * Get single organization details (Super Admin only)
   */
  async getOrganizationById(id) {
    const res = await api.get(`/organizations/${id}`);
    return res.organization || null;
  },

  /**
   * Create Organization and Initial Manager atomically (Super Admin only)
   */
  async createOrganization(data) {
    return await api.post('/organizations', data);
  },
};

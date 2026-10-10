import api from './api';

export const adminService = {
  async getStats() {
    const [statsResponse, statusesResponse] = await Promise.all([
      api.get('/admin/statistics'),
      api.get('/admin/applications/status')
    ]);
    const distribution = statusesResponse.data;
    return {
      ...statsResponse.data,
      totalRejected: distribution.find((item) => item.name === 'REJECTED')?.value || 0,
      statusDistribution: distribution.map((item) => ({
        ...item,
        name: item.name.charAt(0) + item.name.slice(1).toLowerCase()
      }))
    };
  },

  async getUsers() {
    const { data } = await api.get('/admin/users');
    return data;
  },

  async getUserTrends() {
    const { data } = await api.get('/admin/users/trends');
    return data;
  },

  async getPopularRoles() {
    const { data } = await api.get('/admin/popular-roles');
    return data;
  },

  async deleteUser(id) {
    await api.delete(`/admin/users/${id}`);
  }
};

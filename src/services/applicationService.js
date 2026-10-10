import api from './api';

export const applicationService = {
  async getAll(filters = {}) {
    const items = [];
    let page = 0;
    let totalPages = 1;
    do {
      const { data } = await api.get('/applications', {
        params: { page, size: 100, ...filters }
      });
      items.push(...data.items);
      totalPages = data.totalPages;
      page += 1;
    } while (page < totalPages);
    return items;
  },

  async getById(id) {
    const { data } = await api.get(`/applications/${id}`);
    return data;
  },

  async save(payload) {
    const { id, ...body } = payload;
    const { data } = id
      ? await api.put(`/applications/${id}`, body)
      : await api.post('/applications', body);
    return data;
  },

  async remove(id) {
    await api.delete(`/applications/${id}`);
  }
};

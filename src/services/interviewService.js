import api from './api';

export const interviewService = {
  async getAll() {
    const { data } = await api.get('/interviews');
    return data;
  },

  async getUpcoming() {
    const { data } = await api.get('/interviews/upcoming');
    return data;
  },

  async getCompleted() {
    const { data } = await api.get('/interviews/completed');
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/interviews/${id}`);
    return data;
  },

  async save(payload) {
    const { id, ...body } = payload;
    const { data } = id
      ? await api.put(`/interviews/${id}`, body)
      : await api.post('/interviews', body);
    return data;
  },

  async remove(id) {
    await api.delete(`/interviews/${id}`);
  }
};

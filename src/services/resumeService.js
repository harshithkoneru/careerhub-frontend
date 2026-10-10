import api from './api';

export const resumeService = {
  async getAll() {
    const { data } = await api.get('/resumes');
    return data;
  },

  async upload(file) {
    const body = new FormData();
    body.append('file', file);
    const { data } = await api.post('/resumes', body);
    return data;
  },

  async remove(id) {
    await api.delete(`/resumes/${id}`);
  },

  async setDefault(id) {
    const { data } = await api.put(`/resumes/${id}/default`);
    return data;
  },

  async download(id) {
    const { data } = await api.get(`/resumes/${id}/download`, { responseType: 'blob' });
    return data;
  }
};

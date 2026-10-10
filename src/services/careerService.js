import api from './api';

export const careerService = {
  async getCareerAnalysis() {
    const { data } = await api.get('/career/analysis');
    return data;
  }
};

import api from './api';

export const profileService = {
  async getProfile() {
    const { data } = await api.get('/users/profile');
    return data;
  },

  async updateProfile(payload) {
    const profile = {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      college: payload.college,
      degree: payload.degree,
      graduationYear: payload.graduationYear,
      skills: payload.skills,
      linkedIn: payload.linkedIn,
      github: payload.github,
      portfolio: payload.portfolio
    };
    const { data } = await api.put('/users/profile', profile);
    return data;
  }
};

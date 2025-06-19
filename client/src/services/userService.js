import ApiService from './apiService';
import apiClient from '../config/api';

class UserService extends ApiService {
  constructor() {
    super('/users');
  }

  async login(email, password) {
    const response = await apiClient.post(`${this.resourcePath}/auth`, { email, password });
    this.setToken(response.data.token);
    return response.data;
  }

  async register(userData) {
    const response = await apiClient.post(this.resourcePath, userData);
    this.setToken(response.data.token);
    return response.data;
  }

  async logout() {
    await apiClient.post(`${this.resourcePath}/logout`);
    this.removeToken();
  }

  async getProfile() {
    const response = await apiClient.get(`${this.resourcePath}/profile`);
    return response.data;
  }

  async updateProfile(userData) {
    const response = await apiClient.put(`${this.resourcePath}/profile`, userData);
    return response.data;
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

export default new UserService();
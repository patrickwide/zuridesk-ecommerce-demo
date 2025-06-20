import ApiService from './apiService';
import apiClient from '../config/api';

class UserService extends ApiService {
  constructor() {
    super('/api/users');
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
    // Clear token first
    this.removeToken();
    try {
      await apiClient.post(`${this.resourcePath}/logout`);
    } catch (error) {
      // Even if the server request fails, we want to ensure the token is removed
      this.removeToken();
      throw error;
    }
  }

  async getProfile() {
    // Get token before making request
    const token = this.getToken();
    if (!token) {
      throw new Error('No auth token found');
    }
    const response = await apiClient.get(`${this.resourcePath}/profile`);
    return response.data;
  }

  async updateProfile(userData) {
    const response = await apiClient.put(`${this.resourcePath}/profile`, userData);
    return response.data;
  }

  async getAllUsers() {
    const response = await apiClient.get(this.resourcePath);
    return response.data;
  }

  async getUserById(userId) {
    const response = await apiClient.get(`${this.resourcePath}/${userId}`);
    return response.data;
  }

  async updateUser(userId, userData) {
    const response = await apiClient.put(`${this.resourcePath}/${userId}`, userData);
    return response.data;
  }

  async deleteUser(userId) {
    await apiClient.delete(`${this.resourcePath}/${userId}`);
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
      // Update apiClient headers
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  removeToken() {
    localStorage.removeItem('token');
    // Remove auth header
    delete apiClient.defaults.headers.common['Authorization'];
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

export default new UserService();
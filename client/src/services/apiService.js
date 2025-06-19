import apiClient from '../config/api';

class ApiService {
  constructor(resourcePath) {
    this.resourcePath = resourcePath;
  }

  async getAll(params = {}) {
    const response = await apiClient.get(this.resourcePath, { params });
    return response.data;
  }

  async getById(id) {
    const response = await apiClient.get(`${this.resourcePath}/${id}`);
    return response.data;
  }

  async create(data) {
    const response = await apiClient.post(this.resourcePath, data);
    return response.data;
  }

  async update(id, data) {
    const response = await apiClient.put(`${this.resourcePath}/${id}`, data);
    return response.data;
  }

  async delete(id) {
    const response = await apiClient.delete(`${this.resourcePath}/${id}`);
    return response.data;
  }
}

export default ApiService;
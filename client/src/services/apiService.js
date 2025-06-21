import apiClient from '../config/api';

class ApiService {
  constructor(resourcePath) {
    this.resourcePath = resourcePath;
    this.api = apiClient;
  }

  async getAll(params = {}) {
    const response = await this.api.get(this.resourcePath, { params });
    return response.data;
  }

  async getById(id) {
    const response = await this.api.get(`${this.resourcePath}/${id}`);
    return response.data;
  }

  async create(data) {
    const response = await this.api.post(this.resourcePath, data);
    return response.data;
  }

  async update(id, data) {
    const response = await this.api.put(`${this.resourcePath}/${id}`, data);
    return response.data;
  }

  async delete(id) {
    const response = await this.api.delete(`${this.resourcePath}/${id}`);
    return response.data;
  }
}

export default ApiService;
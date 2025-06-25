import ApiService from './apiService';
import apiClient from '../config/api';

class CategoryService extends ApiService {
  constructor() {
    super('/categories');
  }

  async getBySlug(slug) {
    const response = await apiClient.get(`${this.resourcePath}/slug/${slug}`);
    return response.data;
  }
}

export default new CategoryService();
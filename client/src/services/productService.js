import ApiService from './apiService';
import apiClient from '../config/api';

class ProductService extends ApiService {
  constructor() {
    super('/products');
  }

  async getByCategory(categoryId) {
    const response = await apiClient.get(`${this.resourcePath}/category/${categoryId}`);
    return response.data;
  }

  async search(query) {
    const response = await apiClient.get(`${this.resourcePath}/search`, {
      params: { query }
    });
    return response.data;
  }
}

export default new ProductService();
import ApiService from './apiService';

class DashboardService extends ApiService {
  constructor() {
    super('/orders'); // prefix since it's not in apiClient baseURL
  }

  async getStats() {
    try {
      console.log('Fetching dashboard stats from:', `${this.resourcePath}/stats`);
      const response = await this.api.get(`${this.resourcePath}/stats`);
      console.log('Dashboard stats response:', response);
      return response.data;
    } catch (error) {
      console.error('Dashboard service error:', {
        url: `${this.resourcePath}/stats`,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }
}

export default new DashboardService();
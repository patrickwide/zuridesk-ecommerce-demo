import ApiService from './apiService';
import apiClient from '../config/api';

class OrderService extends ApiService {
  constructor() {
    super('/api/orders');
  }

  async getMyOrders(params = {}) {
    const { search, status, period } = params;
    const queryParams = new URLSearchParams();
    
    if (search) queryParams.append('search', search);
    if (status && status !== 'all') queryParams.append('status', status);
    if (period) queryParams.append('period', period);
    
    const queryString = queryParams.toString();
    const url = `${this.resourcePath}/myorders${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get(url);
    return response.data;
  }

  async updateToPaid(orderId, paymentResult) {
    const response = await apiClient.put(`${this.resourcePath}/${orderId}/pay`, paymentResult);
    return response.data;
  }

  async updateToDelivered(orderId) {
    const response = await apiClient.put(`${this.resourcePath}/${orderId}/deliver`);
    return response.data;
  }
}

export default new OrderService();
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

  async getById(id) {
    try {
      const response = await apiClient.get(`${this.resourcePath}/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to access this order');
      }
      throw error;
    }
  }

  async updateToPaid(orderId, paymentResult) {
    try {
      const response = await apiClient.put(`${this.resourcePath}/${orderId}/pay`, paymentResult);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to update this order');
      }
      throw error;
    }
  }

  async updateToDelivered(orderId) {
    const response = await apiClient.put(`${this.resourcePath}/${orderId}/deliver`);
    return response.data;
  }

  async updatePaymentMethod(orderId, paymentMethod) {
    try {
      const response = await apiClient.put(`${this.resourcePath}/${orderId}/payment-method`, { paymentMethod });
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to modify this order');
      }
      throw error;
    }
  }

  async cancelOrder(orderId) {
    try {
      const response = await apiClient.put(`${this.resourcePath}/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to cancel this order');
      }
      throw error;
    }
  }
}

export default new OrderService();
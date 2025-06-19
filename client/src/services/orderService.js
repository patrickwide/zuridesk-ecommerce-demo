import ApiService from './apiService';
import apiClient from '../config/api';

class OrderService extends ApiService {
  constructor() {
    super('/orders');
  }

  async getMyOrders() {
    const response = await apiClient.get(`${this.resourcePath}/myorders`);
    return response.data;
  }

  async updateToPaid(orderId) {
    const response = await apiClient.put(`${this.resourcePath}/${orderId}/pay`);
    return response.data;
  }

  async updateToDelivered(orderId) {
    const response = await apiClient.put(`${this.resourcePath}/${orderId}/deliver`);
    return response.data;
  }
}

export default new OrderService();
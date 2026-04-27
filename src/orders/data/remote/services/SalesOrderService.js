import httpClient from '@/shared/infrastructure/axios.js';


/**
 * Service SalesOrderService
 */
export const SalesOrderService = {
  
  /**
   * getAllOrders
   * @public
   */
  getAllOrders() {
    return httpClient.get('/orders');
  },

  
  /**
   * createSalesOrderFromProcurement
   * @param {any} purchaseOrderId
   * @public
   */
  createSalesOrderFromProcurement(purchaseOrderId) {
    return httpClient.post(`/orders/from-procurement/${purchaseOrderId}`);
  },

  
  /**
   * generatePurchaseOrder
   * @param {any} data
   * @public
   */
  generatePurchaseOrder(data) {
    return httpClient.post('/orders/generate-purchase-order', data);
  },

  
  /**
   * createFromCompletedProcurement
   * @param {any} data
   * @public
   */
  createFromCompletedProcurement(data) {
    return httpClient.post('/orders/from-procurement/completed', data);
  },

  
  /**
   * getOrderById
   * @param {any} orderId
   * @public
   */
  getOrderById(orderId) {
    return httpClient.get(`/orders/${orderId}`);
  },

  
  /**
   * getOrdersBySupplier
   * @param {any} supplierId
   * @public
   */
  getOrdersBySupplier(supplierId) {
    return httpClient.get(`/orders/supplier/${supplierId}`);
  },

  
  /**
   * getOrdersByLiquorStoreOwner
   * @param {any} liquorStoreOwnerId
   * @public
   */
  getOrdersByLiquorStoreOwner(liquorStoreOwnerId) {
    return httpClient.get(`/orders/liquor-store-owner/${liquorStoreOwnerId}`);
  },

  
  /**
   * confirmOrder
   * @param {any} orderId
   * @public
   */
  confirmOrder(orderId) {
    return httpClient.put(`/orders/${orderId}/confirm`);
  },

  
  /**
   * receiveOrder
   * @param {any} orderId
   * @public
   */
  receiveOrder(orderId) {
    return httpClient.put(`/orders/${orderId}/receive`);
  },

  
  /**
   * shipOrder
   * @param {any} orderId
   * @public
   */
  shipOrder(orderId) {
    return httpClient.put(`/orders/${orderId}/ship`);
  },

  
  /**
   * cancelOrder
   * @param {any} orderId
   * @public
   */
  cancelOrder(orderId) {
    return httpClient.put(`/orders/${orderId}/cancel`);
  },
};

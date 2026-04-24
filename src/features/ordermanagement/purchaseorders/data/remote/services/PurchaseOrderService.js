import httpClient from '@/api/axios';


/**
 * Service PurchaseOrderService
 */
export const PurchaseOrderService = {
  
  /**
   * getAllPurchaseOrdersByAccount
   * @param {any} accountId
   * @public
   */
  getAllPurchaseOrdersByAccount(accountId) {
    return httpClient.get(`/accounts/${accountId}/purchase-orders`);
  },

  
  /**
   * getPurchaseOrderById
   * @param {any} purchaseOrderId
   * @public
   */
  getPurchaseOrderById(purchaseOrderId) {
    return httpClient.get(`/purchase-orders/${purchaseOrderId}`);
  },

  
  /**
   * createPurchaseOrderForAccount
   * @param {any} accountId
   * @param {any} data
   * @public
   */
  createPurchaseOrderForAccount(accountId, data) {
    return httpClient.post(`/accounts/${accountId}/purchase-orders`, data);
  },

  
  /**
   * addItemToPurchaseOrder
   * @param {any} purchaseOrderId
   * @param {any} data
   * @public
   */
  addItemToPurchaseOrder(purchaseOrderId, data) {
    return httpClient.post(`/purchase-orders/${purchaseOrderId}/items`, data);
  },

  
  /**
   * removeItemFromPurchaseOrder
   * @param {any} purchaseOrderId
   * @param {any} productId
   * @public
   */
  removeItemFromPurchaseOrder(purchaseOrderId, productId) {
    return httpClient.delete(`/purchase-orders/${purchaseOrderId}/items/${productId}`);
  },

  
  /**
   * confirmPurchaseOrder
   * @param {any} purchaseOrderId
   * @public
   */
  confirmPurchaseOrder(purchaseOrderId) {
    return httpClient.put(`/purchase-orders/${purchaseOrderId}/confirmations`);
  },

  
  /**
   * getAllPurchaseOrders
   * @public
   */
  getAllPurchaseOrders() {
    return httpClient.get(`/purchase-orders`);
  },

  
  /**
   * shipPurchaseOrder
   * @param {any} purchaseOrderId
   * @public
   */
  shipPurchaseOrder(purchaseOrderId) {
    return httpClient.put(`/purchase-orders/${purchaseOrderId}/shipments`);
  },

  
  /**
   * receivePurchaseOrder
   * @param {any} purchaseOrderId
   * @public
   */
  receivePurchaseOrder(purchaseOrderId) {
    return httpClient.put(`/purchase-orders/${purchaseOrderId}/receptions`);
  },

  
  /**
   * cancelPurchaseOrder
   * @param {any} purchaseOrderId
   * @public
   */
  cancelPurchaseOrder(purchaseOrderId) {
    return httpClient.put(`/purchase-orders/${purchaseOrderId}/cancellations`);
  },
};

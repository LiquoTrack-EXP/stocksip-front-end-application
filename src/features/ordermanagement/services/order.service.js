import httpClient from '@/api/axios';

/**
 * Service OrderService
 */
export const OrderService = {
  /**
   * generatePurchaseOrder
   * @param {any} data
   * @public
   */
  generatePurchaseOrder(data) {

    return httpClient.post(import.meta.env.VITE_API_ORDERS_GENERATE_PURCHASE, data);
  },
  /**
   * createSalesOrderFromCompletedProcurement
   * @param {any} data
   * @public
   */
  createSalesOrderFromCompletedProcurement(data) {

    return httpClient.post(import.meta.env.VITE_API_ORDERS_FROM_PROCUREMENT_COMPLETED, data);
  },
  /**
   * createSalesOrderFromPurchaseOrder
   * @param {any} purchaseOrderId
   * @public
   */
  createSalesOrderFromPurchaseOrder(purchaseOrderId) {
    return httpClient.post(import.meta.env.VITE_API_ORDERS_FROM_PROCUREMENT.replace('{purchaseOrderId}', purchaseOrderId));
  },
  /**
   * getOrderById
   * @param {any} id
   * @public
   */
  getOrderById(id) {
    return httpClient.get(import.meta.env.VITE_API_ORDER_DETAILS.replace('{id}', id));
  },
  /**
   * getAllOrders
   * @public
   */
  getAllOrders() {
    return httpClient.get(import.meta.env.VITE_API_ORDERS);
  },
  /**
   * getOrdersBySupplier
   * @param {any} supplierId
   * @public
   */
  getOrdersBySupplier(supplierId) {
    return httpClient.get(import.meta.env.VITE_API_ORDERS_BY_SUPPLIER.replace('{supplierId}', supplierId));
  },
  /**
   * getOrdersByLiquorStoreOwner
   * @param {any} liquorStoreOwnerId
   * @public
   */
  getOrdersByLiquorStoreOwner(liquorStoreOwnerId) {
    return httpClient.get(import.meta.env.VITE_API_ORDERS_BY_OWNER.replace('{liquorStoreOwnerId}', liquorStoreOwnerId));
  },
  /**
   * confirmOrder
   * @param {any} orderId
   * @public
   */
  confirmOrder(orderId) {
    return httpClient.put(import.meta.env.VITE_API_ORDER_CONFIRM.replace('{orderId}', orderId));
  },
  /**
   * receiveOrder
   * @param {any} orderId
   * @public
   */
  receiveOrder(orderId) {
    return httpClient.put(import.meta.env.VITE_API_ORDER_RECEIVE.replace('{orderId}', orderId));
  },
  /**
   * shipOrder
   * @param {any} orderId
   * @public
   */
  shipOrder(orderId) {
    return httpClient.put(import.meta.env.VITE_API_ORDER_SHIP.replace('{orderId}', orderId));
  },
  /**
   * cancelOrder
   * @param {any} orderId
   * @public
   */
  cancelOrder(orderId) {
    return httpClient.put(import.meta.env.VITE_API_ORDER_CANCEL.replace('{orderId}', orderId));
  },

  
  /**
   * getAccountSalesOrders
   * @param {any} supplierId
   * @public
   */
  getAccountSalesOrders(supplierId) {
    return httpClient.get(import.meta.env.VITE_API_ORDERS_BY_SUPPLIER.replace('{supplierId}', supplierId));
  },

  
  /**
   * confirmShipment
   * @param {any} orderId
   * @public
   */
  confirmShipment(orderId) {
    return httpClient.put(import.meta.env.VITE_API_ORDER_SHIP.replace('{orderId}', orderId));
  }
};

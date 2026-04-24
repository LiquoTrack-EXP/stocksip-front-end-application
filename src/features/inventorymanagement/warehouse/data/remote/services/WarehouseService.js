import httpClient from '@/api/axios';


/**
 * Service WarehouseService
 */
export const WarehouseService = {
  
  /**
   * getAccountWarehouses
   * @param {any} accountId
   * @public
   */
  getAccountWarehouses(accountId) {
    return httpClient.get(`/accounts/${accountId}/warehouses`);
  },

  
  /**
   * getWarehouse
   * @param {any} warehouseId
   * @public
   */
  getWarehouse(warehouseId) {
    return httpClient.get(`/warehouses/${warehouseId}`);
  },

  
  /**
   * registerWarehouse
   * @param {any} accountId
   * @param {any} formData
   * @public
   */
  registerWarehouse(accountId, formData) {
    return httpClient.post(`/accounts/${accountId}/warehouses`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  
  /**
   * updateWarehouse
   * @param {any} warehouseId
   * @param {any} formData
   * @public
   */
  updateWarehouse(warehouseId, formData) {
    return httpClient.put(`/warehouses/${warehouseId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  
  /**
   * deleteWarehouse
   * @param {any} warehouseId
   * @public
   */
  deleteWarehouse(warehouseId) {
    return httpClient.delete(`/warehouses/${warehouseId}`);
  },

  
  /**
   * getWarehouseProducts
   * @param {any} warehouseId
   * @public
   */
  getWarehouseProducts(warehouseId) {
    return httpClient.get(`/warehouses/${warehouseId}/products`);
  },

  
  /**
   * getWarehouseProductExits
   * @param {any} warehouseId
   * @public
   */
  getWarehouseProductExits(warehouseId) {
    return httpClient.get(`/warehouses/${warehouseId}/product-exits`);
  },

  
  /**
   * getWarehouseExitsByProduct
   * @param {any} warehouseId
   * @param {any} productId
   * @public
   */
  getWarehouseExitsByProduct(warehouseId, productId) {
    return httpClient.get(`/warehouses/${warehouseId}/products/${productId}/exits`);
  },

  
  /**
   * getWarehouseProductTransfers
   * @param {any} warehouseId
   * @public
   */
  getWarehouseProductTransfers(warehouseId) {
    return httpClient.get(`/warehouses/${warehouseId}/product-transfers`);
  },
};

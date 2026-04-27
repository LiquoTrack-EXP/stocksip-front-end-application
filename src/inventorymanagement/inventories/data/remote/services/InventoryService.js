import httpClient from '@/shared/infrastructure/axios.js';


/**
 * Service InventoryService
 */
export const InventoryService = {
  
  /**
   * getWarehouseProducts
   * @param {any} warehouseId
   * @public
   */
  getWarehouseProducts(warehouseId) {
    return httpClient.get(`/warehouses/${warehouseId}/products`);
  },

  
  /**
   * getWarehouseProductInventory
   * @param {any} warehouseId
   * @param {any} productId
   * @param {any} expirationDate
   * @public
   */
  getWarehouseProductInventory(warehouseId, productId, expirationDate) {
    let url = `/warehouses/${warehouseId}/products/${productId}`;
    if (expirationDate) url += `?expirationDate=${expirationDate}`;
    return httpClient.get(url);
  },

  
  /**
   * addProducts
   * @param {any} warehouseId
   * @param {any} productId
   * @param {any} data
   * @public
   */
  addProducts(warehouseId, productId, data) {
    return httpClient.post(`/warehouses/${warehouseId}/products/${productId}/additions`, data);
  },

  
  /**
   * subtractProducts
   * @param {any} warehouseId
   * @param {any} productId
   * @param {any} data
   * @public
   */
  subtractProducts(warehouseId, productId, data) {
    return httpClient.post(`/warehouses/${warehouseId}/products/${productId}/subtractions`, data);
  },

  
  /**
   * transferProducts
   * @param {any} warehouseId
   * @param {any} productId
   * @param {any} data
   * @public
   */
  transferProducts(warehouseId, productId, data) {
    return httpClient.post(`/warehouses/${warehouseId}/products/${productId}/transfers`, data);
  },

  
  /**
   * getInventoryById
   * @param {any} inventoryId
   * @public
   */
  getInventoryById(inventoryId) {
    return httpClient.get(`/inventories/${inventoryId}`);
  },

  
  /**
   * deleteInventory
   * @param {any} inventoryId
   * @public
   */
  deleteInventory(inventoryId) {
    return httpClient.delete(`/inventories/${inventoryId}`);
  },
};

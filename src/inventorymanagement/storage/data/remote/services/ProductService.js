import httpClient from '@/shared/infrastructure/axios.js';


/**
 * Service ProductService
 */
export const ProductService = {
  
  /**
   * getAccountProducts
   * @param {any} accountId
   * @public
   */
  getAccountProducts(accountId) {
    return httpClient.get(`/accounts/${accountId}/products`);
  },

  
  /**
   * getProductById
   * @param {any} productId
   * @public
   */
  getProductById(productId) {
    return httpClient.get(`/products/${productId}`);
  },

  
  /**
   * registerProduct
   * @param {any} accountId
   * @param {any} formData
   * @public
   */
  registerProduct(accountId, formData) {
    return httpClient.post(`/accounts/${accountId}/products`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    });
  },

  
  /**
   * updateProduct
   * @param {any} productId
   * @param {any} formData
   * @public
   */
  updateProduct(productId, formData) {
    return httpClient.put(`/products/${productId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  
  /**
   * updateMinimumStock
   * @param {any} productId
   * @param {any} newMinimumStock
   * @public
   */
  updateMinimumStock(productId, newMinimumStock) {
    return httpClient.patch(`/products/${productId}/minimum-stock`, { newMinimumStock });
  },

  
  /**
   * deleteProduct
   * @param {any} productId
   * @public
   */
  deleteProduct(productId) {
    return httpClient.delete(`/products/${productId}`);
  },

  
  /**
   * getProductExits
   * @param {any} productId
   * @public
   */
  getProductExits(productId) {
    return httpClient.get(`/products/${productId}/exits`);
  },

  
  /**
   * getProductCareGuides
   * @param {any} productId
   * @public
   */
  getProductCareGuides(productId) {
    return httpClient.get(`/products/${productId}/care-guides`);
  },

  
  /**
   * getProducts
   * @param {any} params
   * @public
   */
  getProducts(params) {
    return httpClient.get('/products', { params });
  },

  
  /**
   * getProductTransfers
   * @param {any} productId
   * @public
   */
  getProductTransfers(productId) {
    return httpClient.get(`/products/${productId}/transfers`);
  },
};

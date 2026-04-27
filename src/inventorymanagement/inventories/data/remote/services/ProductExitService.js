import httpClient from '@/shared/infrastructure/axios.js';


/**
 * Service ProductExitService
 */
export const ProductExitService = {
  
  /**
   * getProductExitById
   * @param {any} id
   * @public
   */
  getProductExitById(id) {
    return httpClient.get(`/product-exits/${id}`);
  },
};

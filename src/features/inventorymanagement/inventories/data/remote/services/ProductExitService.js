import httpClient from '@/api/axios';


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

import httpClient from '@/api/axios';


/**
 * Service ProductTransferService
 */
export const ProductTransferService = {
  
  /**
   * getProductTransferById
   * @param {any} id
   * @public
   */
  getProductTransferById(id) {
    return httpClient.get(`/product-transfers/${id}`);
  },
};

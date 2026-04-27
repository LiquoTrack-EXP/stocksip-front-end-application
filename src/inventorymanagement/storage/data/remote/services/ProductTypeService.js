import httpClient from '@/shared/infrastructure/axios.js';


/**
 * Service ProductTypeService
 */
export const ProductTypeService = {
  
  /**
   * getAllProductTypes
   * @public
   */
  getAllProductTypes() {
    return httpClient.get('/product-types');
  },
};

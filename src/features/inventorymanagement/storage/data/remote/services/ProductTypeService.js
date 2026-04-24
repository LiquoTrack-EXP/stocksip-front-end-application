import httpClient from '@/api/axios';


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

import httpClient from '@/shared/infrastructure/axios.js';


/**
 * Service BrandService
 */
export const BrandService = {
  
  /**
   * getAllBrands
   * @public
   */
  getAllBrands() {
    return httpClient.get('/brands');
  },
};

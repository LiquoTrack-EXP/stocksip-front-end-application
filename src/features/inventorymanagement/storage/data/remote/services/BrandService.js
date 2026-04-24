import httpClient from '@/api/axios';


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

import httpClient from '@/shared/infrastructure/axios.js';


/**
 * Service CareGuideService
 */
export const CareGuideService = {
  
  /**
   * getAccountCareGuides
   * @param {any} accountId
   * @public
   */
  getAccountCareGuides(accountId) {
    return httpClient.get(`/accounts/${accountId}/care-guides`);
  },

  
  /**
   * getCareGuideById
   * @param {any} careGuideId
   * @public
   */
  getCareGuideById(careGuideId) {
    return httpClient.get(`/care-guides/${careGuideId}`);
  },

  
  /**
   * getCareGuideByProductType
   * @param {any} accountId
   * @param {any} productType
   * @public
   */
  getCareGuideByProductType(accountId, productType) {
    return httpClient.get(`/care-guides/${accountId}/${productType}`);
  },

  
  /**
   * createCareGuide
   * @param {any} accountId
   * @param {any} data
   * @public
   */
  createCareGuide(accountId, data) {
    return httpClient.post(`/care-guides/${accountId}`, data);
  },

  
  /**
   * updateCareGuide
   * @param {any} careGuideId
   * @param {any} data
   * @public
   */
  updateCareGuide(careGuideId, data) {
    return httpClient.put(`/care-guides/${careGuideId}`, data);
  },

  
  /**
   * deleteCareGuide
   * @param {any} careGuideId
   * @public
   */
  deleteCareGuide(careGuideId) {
    return httpClient.delete(`/care-guides/${careGuideId}`);
  },

  
  /**
   * unassignCareGuide
   * @param {any} careGuideId
   * @public
   */
  unassignCareGuide(careGuideId) {
    return httpClient.put(`/care-guides/${careGuideId}/deallocations`);
  },

  
  /**
   * assignCareGuide
   * @param {any} careGuideId
   * @param {any} productId
   * @public
   */
  assignCareGuide(careGuideId, productId) {
    return httpClient.put(`/care-guides/${careGuideId}/allocations/${productId}`);
  },
};

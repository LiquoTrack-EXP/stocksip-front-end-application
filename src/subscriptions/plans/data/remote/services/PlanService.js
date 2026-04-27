import httpClient from '@/shared/infrastructure/axios.js';


/**
 * Service PlanService
 */
export const PlanService = {
  
  /**
   * getAllPlans
   * @public
   */
  getAllPlans() {
    return httpClient.get('/plans');
  },
};

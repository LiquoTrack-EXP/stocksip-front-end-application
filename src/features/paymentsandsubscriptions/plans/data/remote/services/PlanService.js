import httpClient from '@/api/axios';


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

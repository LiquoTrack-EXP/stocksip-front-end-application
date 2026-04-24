import httpClient from '@/api/axios';


/**
 * Service SubscriptionService
 */
export const SubscriptionService = {
  
  /**
   * getSubscriptionByAccountId
   * @param {any} accountId
   * @public
   */
  getSubscriptionByAccountId(accountId) {
    return httpClient.get(`/accounts/${accountId}/subscriptions`);
  },

  
  /**
   * createSubscriptionForAccount
   * @param {any} accountId
   * @param {any} data
   * @public
   */
  createSubscriptionForAccount(accountId, data) {
    return httpClient.post(`/accounts/${accountId}/subscriptions`, data);
  },

  
  /**
   * createSubscriptionFromNotification
   * @param {any} data
   * @public
   */
  createSubscriptionFromNotification(data) {
    return httpClient.post('/subscriptions', data);
  },

  
  /**
   * upgradeSubscription
   * @param {any} accountId
   * @param {any} subscriptionId
   * @param {any} data
   * @public
   */
  upgradeSubscription(accountId, subscriptionId, data) {
    return httpClient.put(`/accounts/${accountId}/subscriptions/${subscriptionId}`, data);
  },
};

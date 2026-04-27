import httpClient from '@/shared/infrastructure/axios.js';

/**
 * Service SubscriptionService
 */
export const SubscriptionService = {
  /**
   * createSubscriptionForAccount
   * @param {any} accountId
   * @param {any} data
   * @public
   */
  createSubscriptionForAccount(accountId, data) {

    return httpClient.post(import.meta.env.VITE_API_ACCOUNT_SUBSCRIPTIONS.replace('{accountId}', accountId), data);
  },
  /**
   * getSubscriptionByAccountId
   * @param {any} accountId
   * @public
   */
  getSubscriptionByAccountId(accountId) {
    return httpClient.get(import.meta.env.VITE_API_ACCOUNT_SUBSCRIPTIONS.replace('{accountId}', accountId));
  },
  /**
   * upgradeSubscription
   * @param {any} accountId
   * @param {any} subscriptionId
   * @param {any} data
   * @public
   */
  upgradeSubscription(accountId, subscriptionId, data) {

    let url = import.meta.env.VITE_API_ACCOUNT_SUBSCRIPTION_UPGRADE.replace('{accountId}', accountId).replace('{subscriptionId}', subscriptionId);
    return httpClient.put(url, data);
  },
  /**
   * createSubscriptionFromNotification
   * @param {any} data
   * @public
   */
  createSubscriptionFromNotification(data) {
    return httpClient.post(import.meta.env.VITE_API_SUBSCRIPTIONS, data);
  }
};

export const PlanService = {
  /**
   * getAllPlans
   * @public
   */
  getAllPlans() {
    return httpClient.get(import.meta.env.VITE_API_PLANS);
  }
};

export const AddressService = {
  /**
   * addAddressToAccount
   * @param {any} accountId
   * @param {any} data
   * @public
   */
  addAddressToAccount(accountId, data) {

    return httpClient.post(import.meta.env.VITE_API_ACCOUNT_ADDRESSES.replace('{accountId}', accountId), data);
  },
  /**
   * getAccountAddresses
   * @param {any} accountId
   * @public
   */
  getAccountAddresses(accountId) {
    return httpClient.get(import.meta.env.VITE_API_ACCOUNT_ADDRESSES.replace('{accountId}', accountId));
  }
};

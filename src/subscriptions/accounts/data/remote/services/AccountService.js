import httpClient from '@/shared/infrastructure/axios.js';


/**
 * Service AccountService
 */
export const AccountService = {
  
  /**
   * getAccountById
   * @param {any} accountId
   * @public
   */
  getAccountById(accountId) {
    return httpClient.get(`/accounts/${accountId}`);
  },

  
  /**
   * getAccountStatus
   * @param {any} accountId
   * @public
   */
  getAccountStatus(accountId) {
    return httpClient.get(`/accounts/${accountId}/status`);
  },

  
  /**
   * getAccountsByRole
   * @param {any} params
   * @public
   */
  getAccountsByRole(params) {
    return httpClient.get('/accounts/roles', { params });
  },

  
  /**
   * getAccountBusiness
   * @param {any} accountId
   * @public
   */
  getAccountBusiness(accountId) {
    return httpClient.get(`/accounts/${accountId}/businesses`);
  },

  
  /**
   * updateAccountBusiness
   * @param {any} accountId
   * @param {any} data
   * @public
   */
  updateAccountBusiness(accountId, data) {
    return httpClient.put(`/accounts/${accountId}/businesses`, data);
  },

  
  /**
   * getAccountAlerts
   * @param {any} accountId
   * @public
   */
  getAccountAlerts(accountId) {
    return httpClient.get(`/accounts/${accountId}/alerts`);
  },
};

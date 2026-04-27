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
    return httpClient.get(import.meta.env.VITE_API_ACCOUNT_DETAILS.replace('{accountId}', accountId));
  },
  /**
   * getAccountBusiness
   * @param {any} accountId
   * @public
   */
  getAccountBusiness(accountId) {
    return httpClient.get(import.meta.env.VITE_API_ACCOUNT_BUSINESS.replace('{accountId}', accountId));
  },
  /**
   * getAccountStatus
   * @param {any} accountId
   * @public
   */
  getAccountStatus(accountId) {
    return httpClient.get(import.meta.env.VITE_API_ACCOUNT_STATUS.replace('{accountId}', accountId));
  },
  /**
   * getAccountAddresses
   * @param {any} accountId
   * @public
   */
  getAccountAddresses(accountId) {
    return httpClient.get(import.meta.env.VITE_API_ACCOUNT_ADDRESSES.replace('{accountId}', accountId));
  },
  /**
   * getAccountUsers
   * @param {any} accountId
   * @public
   */
  getAccountUsers(accountId) {
    return httpClient.get(import.meta.env.VITE_API_ACCOUNT_USERS.replace('{accountId}', accountId));
  },
  /**
   * getAccountRoles
   * @public
   */
  getAccountRoles() {
    return httpClient.get(import.meta.env.VITE_API_ACCOUNT_ROLES);
  },

};

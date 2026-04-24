import httpClient from '@/api/axios';


/**
 * Service AddressService
 */
export const AddressService = {
  
  /**
   * getAccountAddresses
   * @param {any} accountId
   * @public
   */
  getAccountAddresses(accountId) {
    return httpClient.get(`/accounts/${accountId}/addresses`);
  },

  
  /**
   * addAddressToAccount
   * @param {any} accountId
   * @param {any} data
   * @public
   */
  addAddressToAccount(accountId, data) {
    return httpClient.post(`/accounts/${accountId}/addresses`, data);
  },
};

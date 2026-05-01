import httpClient from '@/api/axios';

/**
 * Service AccountService
 */
export const AccountService = {
  /**
   * getAccountStatus
   * @param {any} accountId
   * @public
   */
  getAccountStatus(accountId) {
    return httpClient.get(import.meta.env.VITE_API_ACCOUNT_STATUS.replace('{accountId}', accountId));
  },
  /**
   * getAccountDetails
   * @param {any} accountId
   * @public
   */
  getAccountDetails(accountId) {
    return httpClient.get(import.meta.env.VITE_API_ACCOUNT_DETAILS.replace('{accountId}', accountId));
  },
  /**
   * getBusinessByAccountId
   * @param {any} accountId
   * @public
   */
  getBusinessByAccountId(accountId) {
    return httpClient.get(import.meta.env.VITE_API_ACCOUNT_BUSINESS.replace('{accountId}', accountId));
  },
  /**
   * updateBusinessByAccountId
   * @param {any} accountId
   * @param {any} data
   * @public
   */
  updateBusinessByAccountId(accountId, data) {

    return httpClient.put(import.meta.env.VITE_API_ACCOUNT_BUSINESS.replace('{accountId}', accountId), data);
  },
  /**
   * getAccountsByRole
   * @param {any} role
   * @public
   */
  getAccountsByRole(role) {
    return httpClient.get(`${import.meta.env.VITE_API_ACCOUNT_ROLES}?role=${role}`);
  },
  /**
   * getAccountAlerts
   * @param {any} accountId
   * @public
   */
  getAccountAlerts(accountId) {
    return httpClient.get(import.meta.env.VITE_API_ALERTS_BY_ACCOUNT.replace('{accountId}', accountId));
  }
};

export const ProfileService = {
  /**
   * getMyProfile
   * @public
   */
  getMyProfile() {
    return httpClient.get(import.meta.env.VITE_API_PROFILES_ME);
  },
  createProfile(formData) {
    return httpClient.post(import.meta.env.VITE_API_PROFILES, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  /**
   * getAllProfiles
   * @param {any} userId
   * @public
   */
  getAllProfiles(userId) {
    let url = import.meta.env.VITE_API_PROFILES;
    if (userId) url += `?userId=${userId}`;
    return httpClient.get(url);
  },
  /**
   * getProfileById
   * @param {any} id
   * @public
   */
  getProfileById(id) {
    return httpClient.get(import.meta.env.VITE_API_PROFILE_DETAILS.replace('{id}', id));
  },
  updateProfile(id, formData) {
    return httpClient.put(import.meta.env.VITE_API_PROFILE_DETAILS.replace('{id}', id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  /**
   * deleteProfile
   * @param {any} id
   * @public
   */
  deleteProfile(id) {
    return httpClient.delete(import.meta.env.VITE_API_PROFILE_DETAILS.replace('{id}', id));
  }
};

export const RecordService = {
  /**
   * getProductExitDetails
   * @param {any} id
   * @public
   */
  getProductExitDetails(id) {
    return httpClient.get(import.meta.env.VITE_API_PRODUCT_EXIT_DETAILS.replace('{id}', id));
  },
  /**
   * getProductTransferDetails
   * @param {any} id
   * @public
   */
  getProductTransferDetails(id) {
    return httpClient.get(import.meta.env.VITE_API_PRODUCT_TRANSFER_DETAILS.replace('{id}', id));
  }
};

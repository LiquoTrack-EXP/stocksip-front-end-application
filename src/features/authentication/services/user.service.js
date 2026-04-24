import httpClient from '@/api/axios';



/**
 * Service UserService
 */
export const UserService = {
  /**
   * getUserById
   * @param {any} userId
   * @public
   */
  getUserById(userId) {
    return httpClient.get(import.meta.env.VITE_API_USER_DETAILS.replace('{userId}', userId));
  },
  /**
   * getAccountUsers
   * @param {any} accountId
   * @param {any} role
   * @public
   */
  getAccountUsers(accountId, role) {
    let url = import.meta.env.VITE_API_ACCOUNT_USERS.replace('{accountId}', accountId);
    /**
     * if
     * @param {any} role && role !== 'All'
     * @public
     */
    if (role && role !== 'All') {
      url += `?role=${role}`;
    }
    return httpClient.get(url);
  },
  /**
   * registerSubUser
   * @param {any} accountId
   * @param {any} data
   * @public
   */
  registerSubUser(accountId, data) {
    const url = import.meta.env.VITE_API_ACCOUNT_USERS.replace('{accountId}', accountId);

    return httpClient.post(url, data);
  },
  /**
   * deleteUser
   * @param {any} userId
   * @param {any} profileId
   * @public
   */
  deleteUser(userId, profileId) {
    const url = import.meta.env.VITE_API_USER_DELETE.replace('{userId}', userId);
    return httpClient.delete(url, { data: { profileId } });
  }
};

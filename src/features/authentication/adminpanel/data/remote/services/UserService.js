import httpClient from '@/api/axios';


/**
 * Service UserService
 */
export const UserService = {

  /**
   * getAccountUsers
   * @param {any} accountId
   * @param {any} role
   * @public
   */
  getAccountUsers(accountId, role) {
    let url = `/accounts/${accountId}/users`;
    if (role && role !== 'All') url += `?role=${role}`;
    return httpClient.get(url);
  },


  /**
   * registerSubUser
   * @param {any} accountId
   * @param {any} data
   * @public
   */
  registerSubUser(accountId, data) {
    return httpClient.post(`/accounts/${accountId}/users`, data);
  },


  /**
   * deleteUser
   * @param {any} userId
   * @param {any} profileId
   * @public
   */
  deleteUser(userId, profileId) {
    return httpClient.delete(`/users/${userId}`, { data: { profileId } });
  },


  /**
   * getUserById
   * @param {any} userId
   * @public
   */
  getUserById(userId) {
    return httpClient.get(`/users/${userId}`);
  },
};

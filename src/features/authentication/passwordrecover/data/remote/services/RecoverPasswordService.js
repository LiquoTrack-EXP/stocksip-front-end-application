import httpClient from '@/api/axios';


/**
 * Service RecoverPasswordService
 */
export const RecoverPasswordService = {
  
  /**
   * sendRecoveryCode
   * @param {any} data
   * @public
   */
  sendRecoveryCode(data) {
    return httpClient.post('/users/recovery-code', data);
  },

  
  /**
   * verifyRecoveryCode
   * @param {any} data
   * @public
   */
  verifyRecoveryCode(data) {
    return httpClient.post('/users/verify-recovery-code', data);
  },

  
  /**
   * resetPassword
   * @param {any} data
   * @public
   */
  resetPassword(data) {
    return httpClient.put('/users/reset-password', data);
  },
};

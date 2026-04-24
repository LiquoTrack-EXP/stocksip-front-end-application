import httpClient from '@/api/axios';





/**
 * Service AuthService
 */
export const AuthService = {
  /**
   * signIn
   * @param {any} data
   * @public
   */
  signIn(data) {
    return httpClient.post(import.meta.env.VITE_API_AUTH_SIGN_IN, data);
  },
  /**
   * signUp
   * @param {any} signUpData
   * @public
   */
  signUp(signUpData) {

    return httpClient.post(import.meta.env.VITE_API_AUTH_SIGN_UP, signUpData);
  },
  /**
   * googleAuth
   * @param {any} data
   * @public
   */
  googleAuth(data) {
    return httpClient.post(import.meta.env.VITE_API_AUTH_GOOGLE, data);
  },
  /**
   * recoveryCode
   * @param {any} data
   * @public
   */
  recoveryCode(data) {
    return httpClient.post(import.meta.env.VITE_API_USERS_RECOVERY_CODE, data);
  },
  /**
   * verifyRecoveryCode
   * @param {any} data
   * @public
   */
  verifyRecoveryCode(data) {
    return httpClient.post(import.meta.env.VITE_API_USERS_VERIFY_CODE, data);
  },
  /**
   * resetPassword
   * @param {any} data
   * @public
   */
  resetPassword(data) {
    return httpClient.put(import.meta.env.VITE_API_USERS_RESET_PASSWORD, data);
  }
};

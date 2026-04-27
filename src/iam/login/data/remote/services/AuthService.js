import httpClient from '@/shared/infrastructure/axios.js';


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
    return httpClient.post('/sign-in', data);
  },

  
  /**
   * signUp
   * @param {any} data
   * @public
   */
  signUp(data) {
    return httpClient.post('/sign-up', data);
  },

  
  /**
   * googleAuth
   * @param {any} data
   * @public
   */
  googleAuth(data) {
    return httpClient.post('/authentication/google', data);
  },
};

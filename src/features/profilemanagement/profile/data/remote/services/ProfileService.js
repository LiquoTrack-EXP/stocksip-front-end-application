import httpClient from '@/api/axios';


/**
 * Service ProfileService
 */
export const ProfileService = {
  
  /**
   * getMyProfile
   * @public
   */
  getMyProfile() {
    return httpClient.get('/profiles/me');
  },

  
  /**
   * updateProfile
   * @param {any} profileId
   * @param {any} formData
   * @public
   */
  updateProfile(profileId, formData) {
    return httpClient.put(`/profiles/${profileId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

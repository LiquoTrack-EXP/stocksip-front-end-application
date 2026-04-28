import {BaseApi} from "@/shared/infrastructure/base-api.js";
import {BaseEndpoint} from "@/shared/infrastructure/base-endpoint.js";

const profilesEndpoint = import.meta.env.VITE_PROFILES_ENDPOINT_PATH;
const userProfileEndpoint = import.meta.env.VITE_USER_PROFILE_ENDPOINT_PATH;

/**
 * @class ProfilesApi
 * @extends BaseApi
 * @summary Represents the API for managing profiles. It provides methods for updating a profile and retrieving the authenticated user's profile.
 */
export class ProfilesApi extends BaseApi {
    #profilesEndpoint;
    #userProfileEndpoint;

    /**
     * @constructor
     */
    constructor() {
        super();
        this.#profilesEndpoint = new BaseEndpoint(this.http, profilesEndpoint);
        this.#userProfileEndpoint = new BaseEndpoint(this.http, userProfileEndpoint);
    }

    /**
     * Updates the profile of the authenticated user
     *
     * @param {string} id - the id of the profile to be updated
     * @param {Object} updateProfileRequest - the request body containing the updated profile data
     * @returns {Promise} A promise that resolves to the updated profile
     */
    updateProfile(id, updateProfileRequest) {
        return this.#profilesEndpoint.update(id, updateProfileRequest);
    }

    /**
     * Gets the authenticated user's profile
     *
     * @returns {Promise} A promise that resolves to the user's profile'
     */
    getMyProfile() {
        return this.#userProfileEndpoint.getAll();
    }
}
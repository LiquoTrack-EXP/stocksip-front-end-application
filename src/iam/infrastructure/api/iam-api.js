import {BaseApi} from "@/shared/infrastructure/base-api.js";
import {BaseEndpoint} from "@/shared/infrastructure/base-endpoint.js";

const usersEndpoint = import.meta.env.VITE_USERS_ENDPOINT_PATH;
const signInEndpoint = import.meta.env.VITE_SIGN_IN_ENDPOINT_PATH;
const signUpEndpoint = import.meta.env.VITE_SIGN_UP_ENDPOINT_PATH;
const registerWorkerEndpoint = import.meta.env.VITE_REGISTER_WORKER_ENDPOINT_PATH;

/**
 * @class IamApi
 * @extends BaseApi
 * @summary Represents the API for managing IAM operations. It provides methods for signing in, signing up, registering workers, and retrieving user information.
 */
export class IamApi extends BaseApi {
    #signInEndpoint;
    #signUpEndpoint;
    #registerWorkerEndpoint;
    #usersEndpoint;

    /**
     * @constructor
     */
    constructor() {
        super();
        this.#signInEndpoint = new BaseEndpoint(this, signInEndpoint);
        this.#signUpEndpoint = new BaseEndpoint(this, signUpEndpoint);
        this.#registerWorkerEndpoint = new BaseEndpoint(this, registerWorkerEndpoint);
        this.#usersEndpoint = new BaseEndpoint(this, usersEndpoint);
    }

    /**
     * Sign in a user in the system
     *
     * @param {Object} signInRequest - the request body
     * @returns {Promise} - the response
     */
    signIn(signInRequest) {
        return this.#signUpEndpoint.create(signInRequest);
    }

    /**
     * Sign up a new user in the system
     *
     * @param {Object} signUpRequest - the request body
     * @returns {Promise} - the response
     */
    signUp(signUpRequest) {
        return this.#signUpEndpoint.create(signUpRequest);
    }

    /**
     * Register a worker in the system
     *
     * @param {Object} registerWorkerRequest - the request body
     * @returns {Promise} - the response
     */
    registerWorker(registerWorkerRequest) {
        return this.#registerWorkerEndpoint.create(registerWorkerRequest);
    }

    /**
     * Get user by id
     *
     * @param {string} userId - the user id
     * @returns {Promise} - the user, if found
     */
    getUserById(userId) {
        return this.#usersEndpoint.getById(userId);
    }
}
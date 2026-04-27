import axios from 'axios';

const platformApi = import.meta.env.VITE_STOCKSIP_PLATFORM_API;

/**
 * Base API class for making HTTP requests.
 */
export class baseApi {
    #http;

    /**
     * @constructor
     */
    constructor() {
        this.#http = axios.create({
            baseUrl: platformApi,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        this.#http.interceptors.request.use();
    }

    /**
     * Gets the HTTP client instance.
     * @returns {Object} The Axios HTTP client.
     */
    get http() {
        return this.#http;
    }
}
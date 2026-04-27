/**
 * BaseEndpoint class provides common CRUD operations for API endpoints.
 * It serves as a base class for specific endpoint classes, allowing them to inherit
 * these operations and avoid code duplication.
 */
export class BaseEndpoint {

    /**
     * @constructor
     */
    constructor(baseApi, endpointPath) {
        this.http = baseApi.http;
        this.endpointPath = endpointPath;
    }

    /**
     * Retrieves all resources.
     *
     * @returns {Promise} A promise that resolves to an array of resources.
     */
    getAll() {
        return this.http.get(this.endpointPath);
    }

    /**
     * Retrieves a resource by its identifier.
     *
     * @param {string} id - the unique identifier of the resource to be retrieved.
     * @returns {Promise} A promise that resolves to the retrieved resource.
     */
    getById(id) {
        return this.http.get(`${this.endpointPath}/${id}`);
    }

    /**
     * Creates a new resource.
     *
     * @param {Object} resource - the resource data to be sent in the request body.
     * @returns {Promise} A promise that resolves when a response is received from the server.
     */
    create(resource) {
        return this.http.post(this.endpointPath, resource);
    }

    /**
     * Updates a resource by its identifier.
     *
     * @param {string} id - the unique identifier of the resource to be updated.
     * @param {Object} resource - the updated resource data to be sent in the request body.
     * @returns {Promise} A promise that resolves when a response is received from the server.
     */
    update(id, resource) {
        return this.http.put(`${this.endpointPath}/${id}`, resource);
    }

    /**
     * Deletes a resource by its identifier.
     *
     * @param {string} id - the unique identifier of the resource to be deleted.
     * @returns {Promise} A promise that resolves when a response is received from the server.
     */
    delete(id) {
        return this.http.delete(`${this.endpointPath}/${id}`);
    }
}
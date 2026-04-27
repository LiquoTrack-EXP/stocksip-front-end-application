/**
 * @class RegisterWorkerResource
 * @summary Represents a resource for registering a worker.
 */
export class RegisterWorkerResource {

    /**
     * @param {string} message - the message of the registration response.
     */
    constructor({message}) {
        this.message = message;
    }
}
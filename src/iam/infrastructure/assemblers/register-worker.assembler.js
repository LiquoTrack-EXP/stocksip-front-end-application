import {RegisterWorkerResource} from "@/iam/infrastructure/resources/register-worker.resource.js";

/**
 * @class RegisterWorkerAssembler
 * @summary Represents an assembler for registering a worker.
 */
export class RegisterWorkerAssembler {

    /**
     * @static
     * @param {Object} response - the API response object.
     * @param {number} response.status - the HTTP status code.
     * @param {string} response.statusText - the status text.
     * @param {Object} response.data - the response data.
     * @returns {RegisterWorkerResource|null} the assembled RegisterWorkerResource or null if error.
     */
    static toResourceFromResponse(response) {
        console.log(response);
        if (response.status !== 200) {
            console.error(`Error registering worker: ${response.status}, ${response.statusText}`);
            return null;
        }

        return new RegisterWorkerResource(response.data);
    }
}
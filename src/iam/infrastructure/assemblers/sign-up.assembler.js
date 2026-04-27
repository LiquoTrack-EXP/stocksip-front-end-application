import {SignUpResource} from "@/iam/infrastructure/resources/sign-up.resource.js";

/**
 * @class SignUpAssembler
 * @summary Represents an assembler for signing-up.
 */
export class SignUpAssembler {

    /**
     * @static
     * @param {Object} response - the API response object.
     * @param {number} response.status - the HTTP status code.
     * @param {string} response.statusText - the status text.
     * @param {Object} response.data - the response data.
     * @returns {SignUpResource|null} the assembled SignUpResource or null if error.
     */
    static toResourceFromResponse(response) {
        if (response.status !== 200) {
            console.error(`Error signing-up: ${response.status}, ${response.statusText}`);
            return null;
        }
        return new SignUpResource(response.data);
    }
}
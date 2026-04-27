import {SignInResource} from "@/iam/infrastructure/resources/sign-in.resource.js";

/**
 * @class SignInAssembler
 * @summary Represents an assembler for signing-in.
 */
export class SignInAssembler {

    /**
     * @static
     * @param {Object} response - the API response object.
     * @param {number} response.status - the HTTP status code.
     * @param {string} response.statusText - the status text.
     * @param {Object} response.data - the response data.
     * @returns {SignInResource|null} the assembled SignInResource or null if error.
     */
    static toResourceFromResponse(response) {
        console.log(response);
        if (response.status !== 200) {
            console.error(`Error signing-in: ${response.status}, ${response.statusText}`);
            return null;
        }

        return new SignInResource(response.data);
    }
}
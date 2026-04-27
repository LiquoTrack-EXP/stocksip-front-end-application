/**
 * @class SignInResource
 * @summary Represents a resource for sign-in.
 */
export class SignInResource {

    /**
     * @param {Object} params - the parameters for the sign-in resource.
     * @param {string} params.id - the user id.
     * @param {string} params.username - the username.
     * @param {string} params.token - the authentication token.
     */
    constructor({id, username, token}) {
        this.id = id;
        this.username = username;
        this.token = token;
    }
}
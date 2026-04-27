/**
 * @class SignInResource
 * @summary Represents a resource for sign-in.
 */
export class SignInResource {

    /**
     * @param {Object} params - the parameters for the sign-in resource.
     * @param {string} params.id - the user id.
     * @param {string} params.email - the user email.
     * @param {string} params.token - the authentication token.
     */
    constructor({id, email, token}) {
        this.id = id;
        this.email = email;
        this.token = token;

    }
}
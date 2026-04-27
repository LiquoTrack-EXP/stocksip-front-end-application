/**
 * @class SignInResource
 * @summary Represents a resource for sign-in.
 */
export class SignInResource {

    /**
     * @param {Object} params - the parameters for the sign-in resource.
     * @param {string} params.id - the user id.
     * @param {string} params.username - the username.
     * @param {string} params.email - the email.
     * @param {string} params.token - the authentication token.
     */
    constructor({token, id, email, username}) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.username = username;
    }
}
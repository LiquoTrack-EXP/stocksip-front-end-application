/**
 * @class SignInCommand
 * @summary Represents a command for signing-in a user.
 */
export class SignInCommand {

    /**
     * @param {Object} params - the params needed for signing-in.
     * @param {string} params.email - the username of the user.
     * @param {string} params.password - the password of the user.
     */
    constructor({email, password}) {
        this.email = email;
        this.password = password;
    }
}
/**
 * @class SignInCommand
 * @summary Represents a command for signing-in a user.
 */
export class SignInCommand {
    #email;
    #password;

    /**
     * @param {Object} params - the params needed for signing-in.
     * @param {string} params.email - the username of the user.
     * @param {string} params.password - the password of the user.
     */
    constructor({email, password}) {
        this.#email = email;
        this.#password = password;
    }

    /**
     * Gets the username of the user.
     * @returns {string} The username of the user.
     */
    get email() {
        return this.#email;
    }

    /**
     * Gets the password of the user.
     * @returns {string} The password of the user.
     */
    get password() {
        return this.#password;
    }

    /**
     * Sets the username of the user.
     * @param {string} value - the new username of the user.
     */
    set email(value) {
        this.email = value;
    }

    /**
     * Sets the password of the user.
     * @param {string} value - the new password of the user.
     */
    set password(value) {
        this.#password = value;
    }
}
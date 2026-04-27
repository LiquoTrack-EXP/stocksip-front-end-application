/**
 * @class SignInCommand
 * @summary Represents a command for signing-in a user.
 */
export class SignInCommand {
    #username;
    #password;

    /**
     * @param {Object} params - the params needed for signing-in.
     * @param {string} params.username - the username of the user.
     * @param {string} params.password - the password of the user.
     */
    constructor({username, password}) {
        this.#username = username;
        this.#password = password;
    }

    /**
     * Gets the username of the user.
     * @returns {string} The username of the user.
     */
    get username() {
        return this.#username;
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
    set username(value) {
        this.#username = value;
    }

    /**
     * Sets the password of the user.
     * @param {string} value - the new password of the user.
     */
    set password(value) {
        this.#password = value;
    }
}
/**
 * @class SignUpCommand
 * @summary Represents a command for signing up a user.
 */
export class SignUpCommand {
    #username;
    #password;
    #name;
    #businessName;
    #role;

    /**
     * @param {Object} params - The parameters for the sign-up command.
     * @param {string} params.username - The username of the user.
     * @param {string} params.password - The password of the user.
     * @param {string} params.name - The name of the user.
     * @param {string} params.businessName - The business name of the user.
     * @param {string} params.role - The role of the user.
     */
    constructor({username, password, name, businessName, role}) {
        this.#username = username;
        this.#password = password;
        this.#name = name;
        this.#businessName = businessName;
        this.#role = role;
    }

    /**
     * Get the username of the user.
     * @returns {string} The username of the user.
     */
    get username() {
        return this.#username;
    }

    /**
     * Get the password of the user.
     * @returns {string} The password of the user.
     */
    get password() {
        return this.#password;
    }

    /**
     * Get the name of the user.
     * @returns {string} The name of the user.
     */
    get name() {
        return this.#name;
    }

    /**
     * Get the business name of the user.
     * @returns {string} The business name of the user.
     */
    get businessName() {
        return this.#businessName;
    }

    /**
     * Get the role of the user.
     * @returns {string} The role of the user.
     */
    get role() {
        return this.#role;
    }

    /**
     * Set the username of the user.
     * @param {string} value - The username of the user.
     */
    set username(value) {
        this.#username = value;
    }

    /**
     * Set the password of the user.
     * @param {string} value - The password of the user.
     */
    set password(value) {
        this.#password = value;
    }

    /**
     * Set the name of the user.
     * @param {string} value - The name of the user.
     */
    set name(value) {
        this.#name = value;
    }

    /**
     * Set the business name of the user.
     * @param {string} value - The business name of the user.
     */
    set businessName(value) {
        this.#businessName = value;
    }

    /**
     * Set the role of the user.
     * @param {string} value - The role of the user.
     */
    set role(value) {
        this.#role = value;
    }
}
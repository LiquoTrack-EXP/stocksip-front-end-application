/**
 * @class RegisterWorkerCommand
 * @summary Represents a command for registering a new worker.
 */
export class RegisterWorkerCommand {
    #name;
    #email;
    #password;
    #role;
    #phoneNumber;
    #profileRole;

    /**
     * @param {Object} params - the params needed for registering a new worker.
     * @param {string} name - the name of the new worker.
     * @param {string} email - the email of the new worker.
     * @param {string} password - the password of the new worker.
     * @param {string} role - the role of the new worker.
     * @param {string} phoneNumber - the phone number of the new worker.
     * @param {string} profileRole - the profile role of the new worker.
     */
    constructor({name, email, password, role, phoneNumber, profileRole}) {
        this.#name = name;
        this.#email = email;
        this.#password = password;
        this.#role = role;
        this.#phoneNumber = phoneNumber;
        this.#profileRole = profileRole;
    }

    /**
     * Gets the name of the new worker.
     * @returns {string} The name of the new worker.
     */
    get name() {
        return this.#name;
    }

    /**
     * Gets the email of the new worker.
     * @returns {string} The email of the new worker.
     */
    get email() {
        return this.#email;
    }

    /**
     * Gets the password of the new worker.
     * @returns {string} The password of the new worker.
     */
    get password() {
        return this.#password;
    }

    /**
     * Gets the role of the new worker.
     * @returns {string} The role of the new worker.
     */
    get role() {
        return this.#role;
    }

    /**
     * Gets the phone number of the new worker.
     * @returns {string} The phone number of the new worker.
     */
    get phoneNumber() {
        return this.#phoneNumber;
    }

    /**
     * Gets the profile role of the new worker.
     * @returns {string} The profile role of the new worker.
     */
    get profileRole() {
        return this.#profileRole;
    }

    /**
     * Sets the name of the new worker.
     * @param {string} value - the new name of the new worker.
     */
    set name(value) {
        this.#name = value;
    }

    /**
     * Sets the email of the new worker.
     * @param {string} value - the new email of the new worker.
     */
    set email(value) {
        this.#email = value;
    }

    /**
     * Sets the password of the new worker.
     * @param {string} value - the new password of the new worker.
     */
    set password(value) {
        this.#password = value;
    }

    /**
     * Sets the role of the new worker.
     * @param {string} value - the new role of the new worker.
     */
    set role(value) {
        this.#role = value;
    }

    /**
     * Sets the phone number of the new worker.
     * @param {string} value - the new phone number of the new worker.
     */
    set phoneNumber(value) {
        this.#phoneNumber = value;
    }

    /**
     * Sets the profile role of the new worker.
     * @param {string} value - the new profile role of the new worker.
     */
    set profileRole(value) {
        this.#profileRole = value;
    }
}
/**
 * @class RegisterWorkerCommand
 * @summary Represents a command for registering a new worker.
 */
export class RegisterWorkerCommand {

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
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.profileRole = profileRole;
    }
}
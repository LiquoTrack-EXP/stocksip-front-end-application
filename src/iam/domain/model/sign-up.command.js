/**
 * @class SignUpCommand
 * @summary Represents a command for signing up a user.
 */
export class SignUpCommand {

    /**
     * @param {Object} params - The parameters for the sign-up command.
     * @param {string} params.username - The username of the user.
     * @param {string} params.password - The password of the user.
     * @param {string} params.name - The name of the user.
     * @param {string} params.businessName - The business name of the user.
     * @param {string} params.role - The role of the user.
     */
    constructor({username, password, name, businessName, role}) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.businessName = businessName;
        this.role = role;
    }
}
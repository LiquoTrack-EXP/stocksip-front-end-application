/**
 * @class User
 * @summary Represents a user entity.
 */
export class User {

    /**
     * @param {Object} params - the params related to the user
     * @param {string} params.id - the identifier of the user
     * @param {string} params.email - the email of the user
     */
    constructor({id, email}) {
        this.id = id;
        this.email = email;
    }
}
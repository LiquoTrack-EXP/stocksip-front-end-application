/**
 * @class User
 * @summary Represents a user entity.
 */
export class User {

    /**
     * @param {Object} params - the params related to the user
     * @param {string} params.id - the identifier of the user
     * @param {string} params.username - the name of the user
     */
    constructor({id, username}) {
        this.id = id;
        this.username = username;
    }
}
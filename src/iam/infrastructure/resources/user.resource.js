/**
 * @class UserResource
 * @summary Represents a resource for a user.
 */
export class UserResource {

    /**
     * @param {Object} params - the params related to the user
     * @param {string} params.id - the unique identifier of the user
     * @param {string} params.email - the email of the user
     */
    constructor({id, email}) {
        this.id = id;
        this.email = email;
    }
}
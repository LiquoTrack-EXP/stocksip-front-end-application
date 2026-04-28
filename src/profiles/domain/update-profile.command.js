/**
 * @class UpdateProfileCommand
 * @summary Represents a command to update a profile.
 */
export class UpdateProfileCommand {

    /**
     * @param {Object} params - the params related to the profile
     * @param {string} params.firstName - the first name of the profile
     * @param {string} params.lastName - the last name of the profile
     * @param {string} params.phoneNumber - the phone number of the profile
     */
    constructor({firstName, lastName, phoneNumber}) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
    }
}
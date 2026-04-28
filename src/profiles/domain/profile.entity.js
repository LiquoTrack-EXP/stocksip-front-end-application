/**
 * @class Profile
 * @summary Represents a profile entity.
 */
export class Profile {

    /**
     * @param {Object} params - the params related to the profile
     * @param {string} params.id - the identifier of the profile
     * @param {string} params.firstName - the first name of the profile
     * @param {string} params.lastName - the last name of the profile
     * @param {string} params.fullName - the full name of the profile
     * @param {string} params.phoneNumber - the phone number of the profile
     * @param {string} params.contactNumber - the contact number of the profile
     * @param {string} params.profilePictureUrl - the URL of the profile picture
     * @param {string} params.userId - the identifier of the user associated with the profile
     * @param {string} params.assignedRole - the assigned role of the profile
     */
    constructor({id, firstName, lastName, fullName, phoneNumber, contactNumber, profilePictureUrl, userId, assignedRole}) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.contactNumber = contactNumber;
        this.profilePictureUrl = profilePictureUrl;
        this.userId = userId;
        this.assignedRole = assignedRole;
    }
}
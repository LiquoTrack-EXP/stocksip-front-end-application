import {IamApi} from "@/iam/infrastructure/api/iam-api.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {SignInAssembler} from "@/iam/infrastructure/assemblers/sign-in.assembler.js";
import {UserAssembler} from "@/iam/infrastructure/assemblers/user.assembler.js";
import {SignUpAssembler} from "@/iam/infrastructure/assemblers/sign-up.assembler.js";
import {RegisterWorkerAssembler} from "@/iam/infrastructure/assemblers/register-worker.assembler.js";

const iamApi = new IamApi();

/**
 * Pinia store for managing IAM components state.
 * Handles user authentication, registration, and user management.
 * @returns {Object} - The store object containing state, actions, and getters.
 */
const useIamStore = defineStore('iam', () => {

    /** @type {ref} */
    const users = ref([]);
    /** @type {ref} */
    const errors = ref([]);
    /** @type {ref} */
    const userLoaded = ref(false);
    /** @type {ref} */
    const isSignedIn = ref(false);
    /** @type {string|null} */
    const currentUsername = ref(null);
    /** @type {string|null} */
    const currentUserId = ref(null);
    /** @type {computed} */
    const currentToken = computed(() => isSignedIn.value ? localStorage.getItem('token') : null);

    /**
     * Signs in a user and updates the store state accordingly.
     *
     * @param {SignInCommand} signInCommand - The sign-in command containing user credentials.
     * @param router - the router instance.
     * @throws {Error} If the sign-in fails.
     */
    function signIn(signInCommand, router) {
        console.log(signInCommand);
        iamApi.signIn(signInCommand)
            .then(response => {
                let signInResource = SignInAssembler.toResourceFromResponse(response);
                if (signInResource) {
                    let currentUser = UserAssembler.toEntityFromResource(signInResource);
                    let currentUsername = currentUser.email;
                    localStorage.setItem('token', signInResource.token);
                    isSignedIn.value = true;
                    console.log(`User signed in: ${currentUsername.value}`);
                    errors.value = [];
                    router.push({name: '/'});
                } else {
                    isSignedIn.value = false;
                    console.log(`Sign-in failed: Invalid response from server`);
                    errors.value.push(new Error('Sign-in failed'));
                    router.push({name: 'iam-sign-in'});
                }
            })
            .catch(error => {
                isSignedIn.value = false;
                currentUsername.value = error.name;
                console.log(error);
                errors.value.push(error);
                router.push({name: 'iam-sign-in'});
            });
    }

    /**
     * Registers a new user and updates the store state accordingly.
     *
     * @param {SignUpCommand} signUpCommand - The sign-up command containing user information.
     * @param router - the router instance.
     * @throws {Error} If the sign-up fails.
     */
    function signUp(signUpCommand, router) {
        iamApi.signUp(signUpCommand)
            .then(response => {
                let signUpResource = SignUpAssembler.toResourceFromResponse(response);
                if (signUpResource) {
                    console.log(signUpResource.message);
                    errors.value = [];
                    router.push({name: '/'});
                } else {
                    console.log('Sign-up failed: Invalid response from server');
                    errors.value.push(new Error('Sign-up failed'));
                    router.push({name: 'iam-sign-up'});
                }
            })
            .catch(error => {
                console.log(error);
                errors.value.push(error);
                router.push({name: 'iam-sign-up'});
            });
    }

    /**
     * Registers a worker in the specified account.
     *
     * @param {string} accountId - The ID of the account to register the worker in.
     * @param {RegisterWorkerCommand} registerWorkerCommand - The command containing worker information.
     * @param router - the router instance.
     * @throws {Error} If the sign-in fails.
     */
    function registerWorker(accountId, registerWorkerCommand, router) {
        iamApi.registerWorker(accountId, registerWorkerCommand)
            .then(response => {
                let registerWorkerResource = RegisterWorkerAssembler.toResourceFromResponse(response);
                if (registerWorkerResource) {
                    console.log(registerWorkerResource.message);
                    errors.value = [];
                    router.back()
                } else {
                    console.log('Worker registration failed: Invalid response from server');
                    errors.value.push(new Error('Worker registration failed'));
                    router.back();
                }
            })
            .catch(error => {
                console.log(error);
                errors.value.push(error);
                router.back();
            });
    }

    /**
     * Fetches users of an account.
     *
     * @param {string} accountId - The ID of the account to fetch users for.
     * @throws {Error} If the sign-in fails.
     */
    function fetchAccountUsers(accountId) {
        iamApi.fetchAccountUsers(accountId)
            .then(response => {
                let usersResource = UserAssembler.toEntitiesFromResponse(response);
                if (usersResource) {
                    users.value = usersResource;
                    errors.value = [];
                    console.log('Users fetched successfully');
                } else {
                    console.log('Failed to fetch users');
                    errors.value.push(new Error('Failed to fetch users'));
                }
            })
            .catch(error =>{
                console.log(error);
                errors.value.push(error);
            });
    }

    /**
     * Signs out the current user and updates the store state accordingly.
     *
     * @param router - the router instance.
     */
    function signOut(router) {
        currentUsername.value = null;
        currentUserId.value = 0;
        localStorage.removeItem('token');
        isSignedIn.value = false;
        console.log('User signed out');
        errors.value = [];
        router.push({name: 'iam-sign-in'});
    }

    return {
        users,
        errors,
        usersLoaded,
        currentUsername,
        currentUserId,
        currentToken,
        isSignedIn,
        signIn,
        signUp,
        fetchAccountUsers,
        signOut
    };
})

export default useIamStore;
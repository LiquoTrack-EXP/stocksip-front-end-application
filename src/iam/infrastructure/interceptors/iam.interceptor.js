import useIamStore from "@/iam/application/iam.store.js";

/**
 * Interceptor to add the Authorization header with the current token if the user is signed in.
 *
 * @param {Object} config - The Axios config object.
 * @returns {Object} The modified Axios config object.
 */
export const iamInterceptor = (config) => {
    const store = useIamStore();
    const { isSignedIn, currentToken} = store;
    if (isSignedIn) {
        config.headers.Authorization = `Bearer ${currentToken}`;
        console.log(config);
    }
    return config;
}
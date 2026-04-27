import useIamStore from "@/iam/application/iam.store.js";

/**
 * Vue Router navigation guard for authentication in the IAM bounded context.
 * Redirects unauthenticated users to the sign-in page for protected routes.
 * @param {Object} to - the target route object.
 * @param {Object} from - the current route object.
 * @param {Function} next - the function to call to proceed with navigation.
 */
export const authenticationGuard = (to, from, next) => {
    const store = useIamStore();
    const isAnonymous = !store.isSignedIn;
    const publicRoutes = ['/sign-in', '/sign-up', '/page-not-found'];
    const routeRequiresToBeAuthenticated = !publicRoutes.includes(to.path);
    if (isAnonymous && routeRequiresToBeAuthenticated) return next({ name: 'iam-sign-in'});
    else next();
}
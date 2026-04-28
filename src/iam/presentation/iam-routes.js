const signInForm = () => import('./views/sign-in-form.vue');
const signUpForm = () => import('./views/sign-up-form.vue');
const adminPanel = () => import('./views/admin-panel.vue');
const adminPanelWorker = () => import('./components/admin-panel-worker.vue');
const adminPanelEditForm = () => import('./views/admin-panel-edit-form.vue');
const adminPanelRegisterForm = () => import('./views/admin-panel-create-form.vue');

/**
 * Routes for the IAM bounded context.
 */
const iamRoutes = [
    { path: 'sign-in',              name: 'iam-sign-in',              component: signInForm,             meta: { title: 'Sign-in' } },
    { path: 'sign-up',              name: 'iam-sign-up',              component: signUpForm,             meta: { title: 'Sign-up' } },
    { path: 'admin-panel',          name: 'iam-admin-panel',          component: adminPanel,             meta: { title: 'Admin Panel' } },
    { path: 'admin-panel/register', name: 'iam-admin-panel-register', component: adminPanelRegisterForm, meta: { title: 'Register Worker' } },
    { path: 'admin-panel/edit/:id', name: 'iam-admin-panel-edit',     component: adminPanelEditForm,     meta: { title: 'Edit Worker' } },
    { path: 'admin-panel/:id',      name: 'iam-admin-panel-user',     component: adminPanelWorker,       meta: { title: 'Worker' } },
];

export default iamRoutes;
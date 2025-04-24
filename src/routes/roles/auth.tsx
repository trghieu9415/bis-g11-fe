import config from '@/config';
import NoneLayout from '@/layouts/none-layout';
import ForgotPassword from '@/pages/commerce/ForgotPassword';
import Login from '@/pages/commerce/Login';

// Authentication routes
export const authRoutes = [
	{ path: config.routes.eLogin, component: Login, layout: NoneLayout },
	{ path: config.routes.eForgot, component: ForgotPassword, layout: NoneLayout }
];

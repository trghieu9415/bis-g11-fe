import config from '@/config';
import DashboardLayout from '@/layouts/dashboard-layout';

import HREmployees from '@/pages/dashboard/HREmployees';
import Employee from '@/pages/dashboard/Employee';
import UserInfomation from '@/pages/dashboard/UserInfomation';

const publicRoutes = [
	// {path: config.routes.home, component: Home}
	{ path: config.routes.hremployee, component: HREmployees, layout: DashboardLayout },
	{ path: config.routes.employee, component: Employee, layout: DashboardLayout },
	{ path: config.routes.userInfomation, component: UserInfomation, layout: DashboardLayout }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

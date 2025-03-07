import config from '@/config';

import HREmployees from '@/pages/dashboard/HREmployees';
import Employee from '@/pages/dashboard/Employee';
import DashboardLayout from '@/layouts/dashboard-layout';

const publicRoutes = [
	// {path: config.routes.home, component: Home}
	{ path: config.routes.hremployee, component: HREmployees, layout: DashboardLayout },
	{ path: config.routes.employee, component: Employee, layout: DashboardLayout }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

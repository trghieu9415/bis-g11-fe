import config from '@/config';
import DashboardLayout from '@/layouts/dashboard-layout';

import HREmployees from '@/pages/dashboard/HREmployees';
import Employee from '@/pages/dashboard/Employee';
import DashboardLayout from '@/layouts/dashboard-layout';
import Products from '@/pages/dashboard/Products';
import Supplier from '@/pages/dashboard/Supplier';
import UserInfomation from '@/pages/dashboard/UserInfomation';


const publicRoutes = [
	// {path: config.routes.home, component: Home}
	{ path: config.routes.hremployee, component: HREmployees, layout: DashboardLayout },
	{ path: config.routes.employee, component: Employee, layout: DashboardLayout },
	{ path: config.routes.supplier, component: Supplier, layout: DashboardLayout },
	{ path: config.routes.products, component: Products, layout: DashboardLayout }
	{ path: config.routes.userInfomation, component: UserInfomation, layout: DashboardLayout }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

import config from '@/config';
import DashboardLayout from '@/layouts/dashboard-layout';

import HREmployees from '@/pages/dashboard/HREmployees';
import Employee from '@/pages/dashboard/Employee';
import Products from '@/pages/dashboard/Products';
import Supplier from '@/pages/dashboard/Supplier';
import UserInfomation from '@/pages/dashboard/UserInfomation';
import NewOrder from '@/pages/commerce/NewOrder';
import CommerceLayout from '@/layouts/commerce-layout';
import Orders from '@/pages/commerce/Orders';

const publicRoutes = [
	// {path: config.routes.home, component: Home}
	{ path: config.routes.hremployee, component: HREmployees, layout: DashboardLayout },
	{ path: config.routes.employee, component: Employee, layout: DashboardLayout },
	{ path: config.routes.supplier, component: Supplier, layout: DashboardLayout },
	{ path: config.routes.products, component: Products, layout: DashboardLayout },
	{ path: config.routes.userInfomation, component: UserInfomation, layout: DashboardLayout },

	{ path: config.routes.newOrder, component: NewOrder, layout: CommerceLayout },
	{ path: config.routes.orders, component: Orders, layout: CommerceLayout },
	{ path: config.routes.customers, component: NewOrder, layout: CommerceLayout }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

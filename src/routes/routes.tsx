import config from '@/config';
import DashboardLayout from '@/layouts/dashboard-layout';
import NoneLayout from '@/layouts/none-layout';

import HREmployees from '@/pages/dashboard/HREmployees';
import Products from '@/pages/dashboard/Products';
import Supplier from '@/pages/dashboard/Supplier';
import UserInformation from '@/pages/dashboard/UserInformation';
import Contracts from '@/pages/dashboard/Contracts';
import AllLeaveRequests from '@/pages/dashboard/AllLeaveRequests';
import TimeTrackingToday from '@/pages/dashboard/TimeTrackingToday';
import Holiday from '@/pages/dashboard/Holidays';
import NewOrder from '@/pages/commerce/NewOrder';
import CommerceLayout from '@/layouts/commerce-layout';
import Orders from '@/pages/commerce/Orders';
import Login from '@/pages/commerce/Login';
import ForgotPassword from '@/pages/commerce/ForgotPassword';
import TimeTrackingMonth from '@/pages/dashboard/TimeTrackingMonth';
import SalaryMonth from '@/pages/dashboard/PayrollsMonth';
import SalaryYear from '@/pages/dashboard/PayrollsYear';
import Roles from '@/pages/dashboard/Roles';

const publicRoutes = [
	// {path: config.routes.home, component: Home}
	{ path: config.routes.hremployee, component: HREmployees, layout: DashboardLayout },
	{ path: config.routes.contracts, component: Contracts, layout: DashboardLayout },
	{ path: config.routes.leaveRequests, component: AllLeaveRequests, layout: DashboardLayout },
	{ path: config.routes.leaveRequestsByType, component: AllLeaveRequests, layout: DashboardLayout },
	{ path: config.routes.timeTrackingToday, component: TimeTrackingToday, layout: DashboardLayout },
	{ path: config.routes.supplier, component: Supplier, layout: DashboardLayout },
	{ path: config.routes.products, component: Products, layout: DashboardLayout },
	{ path: config.routes.holiday, component: Holiday, layout: DashboardLayout },
	{ path: config.routes.userInformation, component: UserInformation, layout: DashboardLayout },
	{ path: config.routes.newOrder, component: NewOrder, layout: CommerceLayout },
	{ path: config.routes.customers, component: NewOrder, layout: CommerceLayout },
	{ path: config.routes.eLogin, component: Login, layout: NoneLayout },
	{ path: config.routes.eForgot, component: ForgotPassword, layout: NoneLayout },
	{ path: config.routes.orders, component: Orders, layout: CommerceLayout },
	{ path: config.routes.timeTrackingMonth, component: TimeTrackingMonth, layout: DashboardLayout },
	{ path: config.routes.salaryYear, component: SalaryYear, layout: DashboardLayout },
	{ path: config.routes.salaryMonth, component: SalaryMonth, layout: DashboardLayout },
	{ path: config.routes.roles, component: Roles, layout: DashboardLayout }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

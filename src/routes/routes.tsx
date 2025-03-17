import config from '@/config';
import DashboardLayout from '@/layouts/dashboard-layout';

import HREmployees from '@/pages/dashboard/HREmployees';
import UserInfomation from '@/pages/dashboard/UserInfomation';
import Contracts from '@/pages/dashboard/Contracts';
import AllLeaveRequests from '@/pages/dashboard/AllLeaveRequests';
import TimeTrackingToday from '@/pages/dashboard/TimeTrackingToday';

const publicRoutes = [
	// {path: config.routes.home, component: Home}
	{ path: config.routes.hremployee, component: HREmployees, layout: DashboardLayout },
	{ path: config.routes.contracts, component: Contracts, layout: DashboardLayout },
	{ path: config.routes.userInfomation, component: UserInfomation, layout: DashboardLayout },
	{ path: config.routes.leaveRequests, component: AllLeaveRequests, layout: DashboardLayout },
	{ path: config.routes.leaveRequestsByType, component: AllLeaveRequests, layout: DashboardLayout },
	{ path: config.routes.timeTrackingToday, component: TimeTrackingToday, layout: DashboardLayout }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

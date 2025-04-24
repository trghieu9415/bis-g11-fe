import config from '@/config';
import DashboardLayout from '@/layouts/dashboard-layout';
import AllLeaveRequests from '@/pages/dashboard/AllLeaveRequests';
import Contracts from '@/pages/dashboard/Contracts';
import Holiday from '@/pages/dashboard/Holidays';
import HREmployees from '@/pages/dashboard/HREmployees';
import SalaryMonth from '@/pages/dashboard/PayrollsMonth';
import SalaryYear from '@/pages/dashboard/PayrollsYear';
import Roles from '@/pages/dashboard/Roles';
import TimeTrackingMonth from '@/pages/dashboard/TimeTrackingMonth';
import TimeTrackingToday from '@/pages/dashboard/TimeTrackingToday';

// HR routes
export const hrRoutes = [
	{ path: config.routes.hremployee, component: HREmployees, layout: DashboardLayout },
	{ path: config.routes.contracts, component: Contracts, layout: DashboardLayout },
	{ path: config.routes.leaveRequests, component: AllLeaveRequests, layout: DashboardLayout },
	{ path: config.routes.leaveRequestsByType, component: AllLeaveRequests, layout: DashboardLayout },
	{ path: config.routes.timeTrackingToday, component: TimeTrackingToday, layout: DashboardLayout },
	{ path: config.routes.holiday, component: Holiday, layout: DashboardLayout },
	{ path: config.routes.timeTrackingMonth, component: TimeTrackingMonth, layout: DashboardLayout },
	{ path: config.routes.salaryYear, component: SalaryYear, layout: DashboardLayout },
	{ path: config.routes.salaryMonth, component: SalaryMonth, layout: DashboardLayout },
	{ path: config.routes.roles, component: Roles, layout: DashboardLayout }
];

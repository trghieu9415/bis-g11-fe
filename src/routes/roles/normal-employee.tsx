import config from '@/config';
import DashboardLayout from '@/layouts/dashboard-layout';
import UserInformation from '@/pages/dashboard/UserInformation';

// For normal employee
export const normalEmployeeRoutes = [
	{ path: config.routes.employee, component: UserInformation, layout: DashboardLayout }
];

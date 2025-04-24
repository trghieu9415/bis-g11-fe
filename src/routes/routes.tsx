import config from '@/config';
import DashboardLayout from '@/layouts/dashboard-layout';
import UserInformation from '@/pages/dashboard/UserInformation';

import { authRoutes } from './roles/auth';
import { businessRoutes } from './roles/business';
import { hrRoutes } from './roles/hr';
import { salesRoutes } from './roles/sales';
import { warehouseRoutes } from './roles/warehouse';

export const getRoutesByRole = (role: string | undefined) => {
	const commonRoute = {
		path: config.routes.userInformation,
		component: UserInformation,
		layout: DashboardLayout
	};

	switch (role) {
		case 'HR_MANAGER':
			return [...hrRoutes, commonRoute, ...authRoutes];
		case 'WAREHOUSE_MANAGER':
			return [...warehouseRoutes, commonRoute, ...authRoutes];
		case 'BUSINESS_MANAGER':
			return [...businessRoutes, commonRoute, ...authRoutes];
		case 'EMPLOYEE':
			return [...salesRoutes, commonRoute, ...authRoutes];
		default:
			return [commonRoute, ...authRoutes];
	}
};

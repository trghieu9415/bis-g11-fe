const routes = {
	home: '/',
	userInformation: '/user',

	// For HR
	hr: '/hr',
	hremployee: '/hr/hremployee',
	contracts: '/hr/contracts',
	leaveRequests: '/hr/leave-requests',
	leaveRequestsByType: '/hr/leave-requests/:type',
	timeTrackingToday: '/hr/time-tracking/today',
	timeTrackingMonth: '/hr/time-tracking/month',
	holiday: '/hr/holiday',
	salaryMonth: '/hr/salary/month',
	salaryYear: '/hr/salary/year',
	roles: '/hr/roles',

	// For sales
	// sales: '/sales',
	// newOrder: `/sales/new-order`,
	// orders: `/sales/orders`,
	// customers: `/sales/customers`,

	// For normal employee
	employee: '/employee',

	// For business
	business: '/business',
	newOrderBusiness: `/business/new-order`,
	ordersBusiness: `/business/orders`,
	customersBusiness: `/business/customers`,
	statistics: 'business/statistics',

	// For warehouse employee
	warehouse: '/warehouse',
	products: '/warehouse/products',
	supplier: '/warehouse/suppliers',
	author: '/warehouse/author',
	category: '/warehouse/category',
	inventory: '/warehouse/inventory',

	// For login
	eLogin: '/login',
	eForgot: '/forgot-password',
	hrLogin: '/hr-login'
};

export default routes;

const routes = {
	home: '/',
	userInformation: '/user',

	// For HR
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
	newOrder: `/sales/new-order`,
	orders: `/sales/orders`,
	customers: `/sales/customers`,

	// For business
	newOrderBussiness: `/business/new-order`,
	ordersBussiness: `/business/orders`,
	customersBussiness: `/business/customers`,
	// statistics: ???

	// For warehouse employee
	products: '/warehouse/products',
	supplier: '/warehouse/suppliers',
	author: '/warehouse/author',
	category: '/warehouse/category',
	inventory: '/warehouse/inventory',
	// statistics: ???

	// For login
	eLogin: '/login',
	eForgot: '/forgot-password',
	hrLogin: '/hr-login'
};

export default routes;

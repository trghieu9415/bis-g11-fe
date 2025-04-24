import config from '@/config';
import CommerceLayout from '@/layouts/commerce-layout';
import Customer from '@/pages/commerce/Customer';
import NewBill from '@/pages/commerce/NewBill';
import Orders from '@/pages/commerce/Orders';

// For business
export const businessRoutes = [
	{ path: config.routes.business, component: NewBill, layout: CommerceLayout },
	{ path: config.routes.newOrderBussiness, component: NewBill, layout: CommerceLayout },
	{ path: config.routes.ordersBussiness, component: Orders, layout: CommerceLayout },
	{ path: config.routes.customersBussiness, component: Customer, layout: CommerceLayout }
];

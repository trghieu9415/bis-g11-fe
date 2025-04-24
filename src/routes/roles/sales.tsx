import config from '@/config';
import CommerceLayout from '@/layouts/commerce-layout';
import Customer from '@/pages/commerce/Customer';
import NewBill from '@/pages/commerce/NewBill';
import Orders from '@/pages/commerce/Orders';

// For sales
export const salesRoutes = [
	{ path: config.routes.sales, component: NewBill, layout: CommerceLayout },
	{ path: config.routes.newOrder, component: NewBill, layout: CommerceLayout },
	{ path: config.routes.orders, component: Orders, layout: CommerceLayout },
	{ path: config.routes.customers, component: Customer, layout: CommerceLayout }
];

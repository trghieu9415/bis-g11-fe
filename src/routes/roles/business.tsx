import config from '@/config';
import CommerceLayout from '@/layouts/commerce-layout';
import Customer from '@/pages/commerce/Customer';
import NewBill from '@/pages/commerce/NewBill';
import Orders from '@/pages/commerce/Orders';
import ProductStatistics from '@/pages/commerce/ProductStatistic';


// For business
export const businessRoutes = [
	{ path: config.routes.business, component: NewBill, layout: CommerceLayout },
	{ path: config.routes.newOrderBusiness, component: NewBill, layout: CommerceLayout },
	{ path: config.routes.ordersBusiness, component: Orders, layout: CommerceLayout },
	{ path: config.routes.customersBusiness, component: Customer, layout: CommerceLayout },
	{ path: config.routes.statistics, component: ProductStatistics, layout: CommerceLayout }

];

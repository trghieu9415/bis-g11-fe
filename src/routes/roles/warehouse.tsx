import config from '@/config';
import CommerceLayout from '@/layouts/commerce-layout';
import Author from '@/pages/commerce/Author';
import Category from '@/pages/commerce/Category';
import Customer from '@/pages/commerce/Customer';
import Inventory from '@/pages/commerce/Inventory';
import Products from '@/pages/commerce/Products';
import Supplier from '@/pages/commerce/Supplier';

// WAREHOUSE routes
export const warehouseRoutes = [
	{ path: config.routes.warehouse, component: Products, layout: CommerceLayout },
	{ path: config.routes.products, component: Products, layout: CommerceLayout },
	{ path: config.routes.supplier, component: Supplier, layout: CommerceLayout },
	{ path: config.routes.author, component: Author, layout: CommerceLayout },
	{ path: config.routes.category, component: Category, layout: CommerceLayout },
	{ path: config.routes.customers, component: Customer, layout: CommerceLayout },
	{ path: config.routes.inventory, component: Inventory, layout: CommerceLayout }
];

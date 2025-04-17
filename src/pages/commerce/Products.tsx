import ProductsTable from './Warehouse Management/Products/ProductsTable';
import CreateProducts from './Warehouse Management/Products/ProductNew';
export default function Products() {
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách sản phẩm</h1>
			<CreateProducts />
			<div className='mb-2'>
				<ProductsTable />
			</div>
		</div>
	);
}

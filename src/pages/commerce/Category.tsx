import CategoryNew from './Warehouse Management/Category/CategoryNew';
import CategoryTable from './Warehouse Management/Category/CategoryTable';

const Category = () => {
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách danh mục</h1>
			<CategoryNew />
			<div className='mb-2'>
				<CategoryTable />
			</div>
		</div>
	);
};

export default Category;

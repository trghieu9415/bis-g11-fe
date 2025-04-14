import CreateSupplier from './Warehouse Management/Supplier/SupplierNew';
import SupplierTable from './Warehouse Management/Supplier/SupplierTable';

const Supplier = () => {
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách nhà cung cấp</h1>
			<CreateSupplier />
			<div className='mb-2'>
				<SupplierTable />
			</div>
		</div>
	);
};

export default Supplier;

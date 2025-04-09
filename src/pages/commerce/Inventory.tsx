import CreateGoodReceipt from './Warehouse Management/InventoryNew';
import InventoryTable from './Warehouse Management/InventoryTable';
const Inventory = () => {
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách phiếu nhập kho</h1>
			<div className='mb-2'>
				<CreateGoodReceipt />
				<InventoryTable />
			</div>
		</div>
	);
};

export default Inventory;

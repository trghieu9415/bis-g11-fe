import ContractTable from '@/pages/dashboard/Contracts/contract-table';
import ContractCreateNew from './Contracts/contract-create-new';

export default function Contracts() {
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách hợp đồng</h1>
			<ContractCreateNew />
			<div className='mb-2'>
				<ContractTable />
			</div>
		</div>
	);
}

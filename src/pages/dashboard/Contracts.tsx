import ContractTable from '@/pages/dashboard/Contracts/contract-table';

export default function Contracts() {
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách hợp đồng</h1>
			<div className='mb-2'>
				<ContractTable />
			</div>
		</div>
	);
}

import RolesTable from './Roles/roles-table';

export default function Products() {
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách chức vụ</h1>
			<div className='mb-2'>
				<RolesTable />
			</div>
		</div>
	);
}

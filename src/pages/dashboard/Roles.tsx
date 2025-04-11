import { useEffect, useState } from 'react';
import { fetchAllAllowances } from '@/redux/slices/allowancesSlice';
import { useAppDispatch } from '@/redux/store';

import RolesCreateNew from './Roles/roles-create-new';
import RolesTable from './Roles/roles-table';

export default function Products() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchAllAllowances());
	}, [dispatch]);

	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách chức vụ</h1>
			<RolesCreateNew />
			<div className='mb-2'>
				<RolesTable />
			</div>
		</div>
	);
}

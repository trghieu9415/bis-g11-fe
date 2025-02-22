import DashboardLayout from '@/layouts/dashboard-layout';
import HREmployeeTable from '@/pages/dashboard/HREmployees/hremployee-table';

function Content() {
	const data = [
		{ id: 1, name: 'Minh', age: 25 },
		{ id: 2, name: 'Nam', age: 22 },
		{ id: 3, name: 'Linh', age: 23 }
	];

	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold'>Danh sách nhân sự</h1>
			<div>
				<HREmployeeTable data={data} />
			</div>
		</div>
	);
}

export default function HREmployees() {
	return (
		<>
			<DashboardLayout mainContent={<Content />} />
		</>
	);
}

import DashboardLayout from '@/layouts/dashboard-layout';
import HREmployeeTable from '@/pages/dashboard/HREmployees/hremployee-table';
import data from '@/pages/dashboard/HREmployees/data.json';

function Content() {
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-xl font-bold mt-3 mb-4'>Danh sách nhân sự</h1>
			<div className='my-auto'>
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

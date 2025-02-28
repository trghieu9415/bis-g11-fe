import DashboardLayout from '@/layouts/dashboard-layout';
import EmployeeTable from './employees/employee-table';

function Content() {
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách nhân sự</h1>
			<div>
				<EmployeeTable />
			</div>
		</div>
	);
}

export default function Employees() {
	return (
		<>
			<DashboardLayout mainContent={<Content />} />
		</>
	);
}

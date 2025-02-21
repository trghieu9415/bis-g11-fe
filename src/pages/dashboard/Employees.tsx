import DashboardLayout from '@/layouts/dashboard-layout';
import EmployeeTable from './general-components/employee-table';

function Content() {
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold'>Danh sách nhân sự</h1>
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

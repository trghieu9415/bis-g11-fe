import DashboardLayout from '@/layouts/dashboard-layout';
import EmployeeTable from './employees/employee-table';
import EmployeeCreateNew from './employees/employee-create-new';

function Content() {
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách nhân sự</h1>
			<EmployeeCreateNew />
			<div className='mb-2'>
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

import DashboardLayout from '@/layouts/dashboard-layout';
import EmployeementContractTable from '@/pages/dashboard/EmploymentContract/employmentContract-table';
import data from '@/pages/dashboard/EmploymentContract/data.json';

function Content() {
	return (
		<div className='flex flex-col overflow-hidden'>
			<h1 className='text-xl font-bold my-2'>Danh sách nhân sự</h1>
			<div className='w-full'>
				<EmployeementContractTable data={data} />
			</div>
		</div>
	);
}

export default function EmployeementContract() {
	return (
		<>
			<DashboardLayout mainContent={<Content />} />
		</>
	);
}

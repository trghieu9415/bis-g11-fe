import DashboardLayout from '@/layouts/dashboard-layout';
import EmployeementContractTable from '@/pages/dashboard/EmploymentContract/employmentContract-table';
import data from '@/pages/dashboard/EmploymentContract/data.json';

function Content() {

  
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-xl font-bold mt-3 mb-4'>Danh sách nhân sự</h1>
			<div className='my-auto'>
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

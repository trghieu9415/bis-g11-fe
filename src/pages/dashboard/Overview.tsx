import DashboardLayout from '@/layouts/dashboard-layout';

function Content() {
	return (
		<div className='flex flex-col'>
			<h1 className='text-lg font-bold'>Danh sách nhân sự</h1>
		</div>
	);
}

export default function Overview() {
	return (
		<>
			<DashboardLayout mainContent={<Content />} hScreen />
		</>
	);
}

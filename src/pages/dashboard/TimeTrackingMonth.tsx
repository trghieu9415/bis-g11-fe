import TimeTrackingMonthTable from './TimeTracking/time-tracking-month-table';

export default function TimeTrackingToday() {
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách chấm công theo tháng </h1>
			<div className='mb-2'>
				<TimeTrackingMonthTable />
			</div>
		</div>
	);
}

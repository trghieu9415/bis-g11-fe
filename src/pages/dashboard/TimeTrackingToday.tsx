import TimeTrackingTodayTable from './TimeTracking/time-tracking-today-table';

export default function TimeTrackingToday() {
	const today = new Date();

	const weekday = today.toLocaleDateString('vi-VN', { weekday: 'long' });
	const day = today.toLocaleDateString('vi-VN', { day: '2-digit' });
	const month = today.toLocaleDateString('vi-VN', { month: '2-digit' });
	const year = today.toLocaleDateString('vi-VN', { year: 'numeric' });
	const formattedDate = `(${weekday}, ${day} tháng ${month}, ${year})`;

	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách chấm công hôm nay {formattedDate}</h1>
			<div className='mb-2'>
				<TimeTrackingTodayTable />
			</div>
		</div>
	);
}

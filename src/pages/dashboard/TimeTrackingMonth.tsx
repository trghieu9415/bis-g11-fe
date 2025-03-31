import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TimeTrackingMonthTable from './TimeTracking/time-tracking-month-table';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

import { RootState, useAppDispatch } from '@/redux/store';
import { fetchAllTimeTrackingToday } from '@/redux/slices/timeTrackingTodaySlice';
import { scanAttendanceDetailRedux } from '@/redux/slices/scanAttendanceDetailSlice';

export default function TimeTrackingMonth() {
	const dispatch = useAppDispatch();
	const { scanAttendanceDetail } = useSelector((state: RootState) => state.scanAttendanceDetail);

	const [today, setToday] = useState(new Date());
	const [isScan, setIsScan] = useState(false);
	const [scanTime, setScanTime] = useState('');

	const updateDate = (e: React.ChangeEvent<HTMLInputElement>) => {
		setToday(new Date(e.target.value));
	};

	const currentDate = new Date();
	currentDate.setHours(0, 0, 0, 0);

	const selectedDate = new Date(today);
	selectedDate.setHours(0, 0, 0, 0);

	const isToday = selectedDate.getTime() === currentDate.getTime();

	const weekday = today.toLocaleDateString('vi-VN', { weekday: 'long' });
	const day = today.toLocaleDateString('vi-VN', { day: '2-digit' });
	const month = today.toLocaleDateString('vi-VN', { month: '2-digit' });
	const year = today.toLocaleDateString('vi-VN', { year: 'numeric' });
	const formattedDate = `tháng ${month}, ${year}`;

	useEffect(() => {
		dispatch(fetchAllTimeTrackingToday(`${year}-${month}-${day}`));
	}, [today]);

	useEffect(() => {
		const localDateTime = new Date().toISOString();
		dispatch(scanAttendanceDetailRedux(localDateTime));
	}, []);

	useEffect(() => {
		if (scanAttendanceDetail?.statusCode === 200) {
			setIsScan(true);
			const currentTime = new Date().toLocaleTimeString('vi-VN', {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			});
			setScanTime(currentTime);
		}
	}, [scanAttendanceDetail]);

	console.log(formattedDate);

	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>
				Danh sách chấm công theo tháng{' '}
				<span className='text-lg pb-[2px] font-bold border-b-4 border-blue-300 '>{formattedDate}</span>{' '}
			</h1>
			<div>
				<div className='inline-block float-end mr-1'>
					<Input
						type='date'
						className='border-gray-200 outline-none mb-2 !text-base'
						value={`${year}-${month}-${day}`}
						onChange={updateDate}
					/>
				</div>
			</div>
			<div className='flex items-center gap-1 mb-2'>
				{isScan && (
					<>
						<div className='text-sm text-gray-600'>Thời gian quét: {scanTime}</div>
						<button
							className='p-1 hover:bg-gray-100 rounded-full text-gray-600'
							onClick={() => {
								const localDateTime = new Date().toISOString();
								dispatch(scanAttendanceDetailRedux(localDateTime));
							}}
						>
							<Loader2 className='w-4 h-4 text-gray-600' />
						</button>
					</>
				)}
			</div>
			<div className='mb-2'>
				<TimeTrackingMonthTable />
			</div>
		</div>
	);
}

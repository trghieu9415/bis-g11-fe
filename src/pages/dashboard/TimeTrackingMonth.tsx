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

	return (
		<div className='flex w-full flex-col'>
			<h1 className='py-4 text-lg font-bold uppercase'>
				Danh sách chấm công theo tháng{' '}
				<span className='border-b-4 border-blue-300 pb-[2px] text-lg font-bold'>{formattedDate}</span>{' '}
			</h1>
			<div>
				<div className='float-end mr-1 inline-block'>
					<Input
						type='date'
						className='mb-2 border-gray-200 !text-base outline-none'
						value={`${year}-${month}-${day}`}
						onChange={updateDate}
					/>
				</div>
			</div>
			<div className='mb-2 flex items-center gap-1'>
				{isScan && (
					<>
						<div className='text-sm text-gray-600'>Thời gian quét: {scanTime}</div>
						<button
							className='rounded-full p-1 text-gray-600 hover:bg-gray-100'
							onClick={() => {
								const localDateTime = new Date().toISOString();
								dispatch(scanAttendanceDetailRedux(localDateTime));
							}}
						>
							<Loader2 className='h-4 w-4 text-gray-600' />
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

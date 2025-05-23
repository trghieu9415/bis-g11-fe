import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import TimeTrackingTodayTable from './TimeTracking/time-tracking-today-table';
import PresentSummary from './TimeTracking/components/present-summary';
import AbsentSummary from './TimeTracking/components/absent-summary';
import AwaySummary from './TimeTracking/components/away-summary';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

import { RootState, useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchAllTimeTrackingToday } from '@/redux/slices/timeTrackingTodaySlice';
import { getAllAttendanceDetailByDate } from '@/services/attendanceDetailService';
import { scanAttendanceDetailRedux } from '@/redux/slices/scanAttendanceDetailSlice';
import { toast } from 'react-toastify';

export default function TimeTrackingToday() {
	const dispatch = useAppDispatch();
	const { timeTrackingToday } = useSelector((state: RootState) => state.timeTrackingToday);
	const { scanAttendanceDetail } = useSelector((state: RootState) => state.scanAttendanceDetail);

	const [today, setToday] = useState(new Date());
	const [scanTime, setScanTime] = useState('');
	const [isFuture, setIsFuture] = useState(false);
	const [attendanceSummary, setAttendanceSummary] = useState({
		present: {
			onTime: 0,
			late: 0,
			early: 0,
			onTimeGTEorLTE: 0,
			lateGTEorLTE: 0,
			earlyGTEorLTE: 0
		},
		absent: {
			unpaidLeave: 0,
			notCheckIn: 0,
			notCheckOut: 0,
			unpaidGTEorLTE: 0,
			notCheckInGTEorLTE: 0,
			notCheckOutGTEorLTE: 0
		},
		away: {
			paidLeave: 0,
			sickLeave: 0,
			maternityLeave: 0,
			paidLeaveGTEorLTE: 0,
			sickLeaveGTEorLTE: 0,
			maternityLeaveGTEorLTE: 0
		},
		isSet: false
	});

	const updateDate = (e: React.ChangeEvent<HTMLInputElement>) => {
		setToday(new Date(e.target.value));
		apiCalledRef.current = false;
	};

	const currentDate = new Date();
	const selectedDate = new Date(today);

	const isToday = selectedDate.setHours(0, 0, 0, 0) === currentDate.setHours(0, 0, 0, 0);

	const weekday = today.toLocaleDateString('vi-VN', { weekday: 'long' });
	const day = today.toLocaleDateString('vi-VN', { day: '2-digit' });
	const month = today.toLocaleDateString('vi-VN', { month: '2-digit' });
	const year = today.toLocaleDateString('vi-VN', { year: 'numeric' });
	const formattedDate = `${weekday}, ${day} tháng ${month}, ${year}`;

	const apiCalledRef = useRef(false);

	useEffect(() => {
		dispatch(fetchAllTimeTrackingToday(`${year}-${month}-${day}`));
		setAttendanceSummary(prev => ({ ...prev, isSet: false }));
	}, [today, scanAttendanceDetail]);

	useEffect(() => {
		fetchPrevDate(today);
	}, [timeTrackingToday]);

	useEffect(() => {
		if (selectedDate.setHours(0, 0, 0, 0) > currentDate.setHours(0, 0, 0, 0)) {
			setIsFuture(true);
			toast.error('Không thể lọc ngày ở tương lai');
		} else {
			setIsFuture(false);
			const localDateTime = new Date(today).toISOString().slice(0, 19);

			// Use useRef to avoid the problem when scan API call 2 times (react strict mode)
			if (!apiCalledRef.current) {
				dispatch(scanAttendanceDetailRedux(localDateTime));
				apiCalledRef.current = true;
			}

			const currentTime = new Date().toLocaleTimeString('vi-VN', {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			});
			setScanTime(currentTime);
		}
	}, [today]);

	const fetchPrevDate = async (today: Date) => {
		try {
			const yesterday = new Date(today);

			// Check if today is Monday, then yesterday is Friday
			if (today.getDay() === 1) {
				yesterday.setDate(today.getDate() - 3);
			} else {
				yesterday.setDate(today.getDate() - 1);
			}

			const day = yesterday.toLocaleDateString('vi-VN', { day: '2-digit' });
			const month = yesterday.toLocaleDateString('vi-VN', { month: '2-digit' });
			const year = yesterday.toLocaleDateString('vi-VN', { year: 'numeric' });

			const prevDateData = await getAllAttendanceDetailByDate(`${year}-${month}-${day}`);
			// @ts-expect-error - Response from getAllAttendanceDetailByDate includes success property
			if (prevDateData?.success) {
				const { onTime, late, early } = timeTrackingToday.reduce(
					(acc, item) => {
						if (!item.checkIn) return acc;

						const [hour, minute] = item.checkIn.split(':').map(Number);
						const checkInMinutes = hour * 60 + minute;

						if (checkInMinutes < 8 * 60) {
							acc.early += 1;
						} else if (checkInMinutes <= 8 * 60 + 15) {
							acc.onTime += 1;
						} else {
							acc.late += 1;
						}

						return acc;
					},
					{ onTime: 0, late: 0, early: 0 }
				);

				const data = Array.isArray(prevDateData.data) ? prevDateData.data : [];
				const { yesterdayOnTime, yesterdayLate, yesterdayEarly } = data.reduce(
					(acc, item) => {
						if (!item.checkIn || typeof item.checkIn !== 'string') return acc;

						const [hour, minute] = item.checkIn.split(':').map(Number);
						const checkInMinutes = hour * 60 + minute;

						if (checkInMinutes < 8 * 60) {
							acc.yesterdayEarly += 1;
						} else if (checkInMinutes <= 8 * 60 + 15) {
							acc.yesterdayOnTime += 1;
						} else {
							acc.yesterdayLate += 1;
						}

						return acc;
					},
					{ yesterdayOnTime: 0, yesterdayLate: 0, yesterdayEarly: 0 }
				);

				const { unpaidLeave, notCheckIn, notCheckOut } = timeTrackingToday.reduce(
					(acc, item) => {
						if (item.checkIn === null) {
							acc.notCheckIn += 1;
							if (item.attendanceStatus === 'ABSENT') acc.unpaidLeave += 1;
						} else if (item.checkOut === null) {
							acc.notCheckOut += 1;
						}
						return acc;
					},
					{ unpaidLeave: 0, notCheckIn: 0, notCheckOut: 0 }
				);

				const { yesterdayUnpaidLeave, yesterdayNotCheckIn, yesterdayNotCheckOut } = data.reduce(
					(acc, item) => {
						if (item.checkIn === null) {
							acc.yesterdayNotCheckIn += 1;
							if (item.attendanceStatus === 'ABSENT') acc.yesterdayUnpaidLeave += 1;
						} else if (item.checkOut === null) {
							acc.yesterdayNotCheckOut += 1;
						}
						return acc;
					},
					{ yesterdayUnpaidLeave: 0, yesterdayNotCheckIn: 0, yesterdayNotCheckOut: 0 }
				);

				const { paidLeave, sickLeave, maternityLeave } = timeTrackingToday.reduce(
					(acc, item) => {
						if (item.attendanceStatus === 'ON_LEAVE') {
							if (item.leaveTypeEnum === 1) acc.paidLeave += 1;
							else if (item.leaveTypeEnum === 0) acc.sickLeave += 1;
							else if (item.leaveTypeEnum === 2) acc.maternityLeave += 1;
						}
						return acc;
					},
					{ paidLeave: 0, sickLeave: 0, maternityLeave: 0 }
				);

				const { paidLeaveGTEorLTE, sickLeaveGTEorLTE, maternityLeaveGTEorLTE } = data.reduce(
					(acc, item) => {
						if (item.attendanceStatus === 'ON_LEAVE') {
							if (item.leaveTypeEnum === 1) acc.paidLeaveGTEorLTE += 1;
							else if (item.leaveTypeEnum === 0) acc.sickLeaveGTEorLTE += 1;
							else if (item.leaveTypeEnum === 2) acc.maternityLeaveGTEorLTE += 1;
						}
						return acc;
					},
					{ paidLeaveGTEorLTE: 0, sickLeaveGTEorLTE: 0, maternityLeaveGTEorLTE: 0 }
				);

				setAttendanceSummary(prev => ({
					...prev,
					present: {
						onTime: onTime || 0,
						late: late || 0,
						early: early || 0,
						onTimeGTEorLTE: (onTime || 0) - (yesterdayOnTime || 0),
						lateGTEorLTE: (late || 0) - (yesterdayLate || 0),
						earlyGTEorLTE: (early || 0) - (yesterdayEarly || 0)
					},
					absent: {
						unpaidLeave: unpaidLeave || 0,
						notCheckIn: notCheckIn || 0,
						notCheckOut: notCheckOut || 0,
						unpaidGTEorLTE: (unpaidLeave || 0) - (yesterdayUnpaidLeave || 0),
						notCheckInGTEorLTE: (notCheckIn || 0) - (yesterdayNotCheckIn || 0),
						notCheckOutGTEorLTE: (notCheckOut || 0) - (yesterdayNotCheckOut || 0)
					},
					away: {
						paidLeave: paidLeave || 0,
						sickLeave: sickLeave || 0,
						maternityLeave: maternityLeave || 0,
						paidLeaveGTEorLTE: (paidLeave || 0) - (paidLeaveGTEorLTE || 0),
						sickLeaveGTEorLTE: (sickLeave || 0) - (sickLeaveGTEorLTE || 0),
						maternityLeaveGTEorLTE: (maternityLeave || 0) - (maternityLeaveGTEorLTE || 0)
					},
					isSet: true
				}));
			}
		} catch (error) {
			console.error(`Lỗi khi lấy dữ liệu ngày hôm qua:`, error);
		}
	};

	return (
		<div className='flex w-full flex-col'>
			<h1 className='py-4 text-lg font-bold uppercase'>
				Danh sách chấm công ngày{' '}
				<span className='border-b-4 border-blue-300 pb-[2px] text-lg font-bold'>{formattedDate}</span>{' '}
				{isToday && <span className='ml-2 rounded bg-yellow-200 px-2 py-1 text-black'>Hôm nay</span>}
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
			{!isFuture && (
				<div className='mb-2 flex items-center gap-1'>
					<div className='text-sm text-gray-600'>Thời gian quét: {scanTime}</div>
					<button
						className='rounded-full p-1 text-gray-600 hover:bg-gray-100'
						onClick={() => {
							const localDateTime = new Date(today).toISOString().slice(0, 19);
							dispatch(scanAttendanceDetailRedux(localDateTime));
							if (scanAttendanceDetail?.statusCode === 200) {
								const currentTime = new Date().toLocaleTimeString('vi-VN', {
									hour: '2-digit',
									minute: '2-digit',
									second: '2-digit'
								});
								setScanTime(currentTime);
							}
						}}
					>
						<Loader2 className='h-4 w-4 text-gray-600' />
					</button>
				</div>
			)}
			{attendanceSummary.isSet && !isFuture && (
				<div className='mb-4 flex items-center justify-between gap-4'>
					<PresentSummary {...attendanceSummary.present} />
					<AbsentSummary {...attendanceSummary.absent} />
					<AwaySummary {...attendanceSummary.away} />
				</div>
			)}
			<div className='mb-2'>
				<TimeTrackingTodayTable />
			</div>
		</div>
	);
}

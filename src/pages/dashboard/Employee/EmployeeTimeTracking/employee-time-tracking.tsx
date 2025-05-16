import { RootState, useAppDispatch } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { CalendarCheck } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';

import EmployeeCalendar from '@/pages/dashboard/Employee/EmployeeTimeTracking/employee-calendar';
import { fetchAttendanceDetailsByUserID } from '@/redux/slices/attendanceDetailByUserIDSlice';
import {
	checkIn,
	checkOut,
	checkExistAttendanceDetail,
	updateAttendanceDetail
} from '@/services/attendanceDetailService';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export default function EmployeeTimeTracking() {
	const dispatch = useAppDispatch();
	// const { user } = useSelector((state: RootState) => state.user);
	const { profile } = useSelector((state: RootState) => state.profile);
	const { attendanceDetailsByUserID } = useSelector((state: RootState) => state.attendanceDetailsByUserID);
	const [events, setEvents] = useState(attendanceDetailsByUserID);

	useEffect(() => {
		if (attendanceDetailsByUserID.length === 0 && profile?.id) {
			dispatch(fetchAttendanceDetailsByUserID(profile.id));
		}
	}, [dispatch, profile]);

	useEffect(() => {
		setEvents(attendanceDetailsByUserID);
	}, [attendanceDetailsByUserID]);

	function toISOStringWithTimezone(date: Date, offset: number): string {
		const tzDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
		const isoString = tzDate.toISOString().split('Z')[0];
		return `${isoString}`;
	}

	const handleCheckIn = async () => {
		try {
			const now = new Date(); // Get the current date and time
			const nowUTC = toISOStringWithTimezone(now, 7);
			const checkInData = {
				userId: profile?.id,
				checkIn: nowUTC
			};

			const formattedDate = now.toISOString().split('T')[0];
			if (profile) {
				const res = await checkExistAttendanceDetail(profile?.id, formattedDate);

				// @ts-expect-error - Except res.success
				if (res?.success) {
					if (res?.data == 'AttendanceDetail not exist') {
						await checkIn(checkInData);
						const formattedTime = now.toLocaleTimeString('vi-VN', {
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit'
						});
						toast.success(`Check-in thành công lúc  ${formattedTime}`);
						dispatch(fetchAttendanceDetailsByUserID(profile?.id));
					} else if (res?.data == 'AttendanceDetail already exist') {
						await updateAttendanceDetail({
							...checkInData,
							checkOut: null
						});
						const formattedTime = now.toLocaleTimeString('vi-VN', {
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit'
						});
						toast.success(`Check-in thành công lúc  ${formattedTime}`);
						dispatch(fetchAttendanceDetailsByUserID(profile?.id));
					} else {
						toast.error('Có lỗi trong quá trình chấm công, vui lòng thử lại!');
					}
				}
			}
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error(
					(err.response.data as { message?: string }).message || 'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
				);
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy nhân viên.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	const handleCheckOut = async () => {
		try {
			const now = new Date();
			const nowUTC = toISOStringWithTimezone(now, 7);

			const checkOutData = {
				userId: profile?.id,
				checkOut: nowUTC
			};
			if (profile) {
				const res = await checkOut(checkOutData);
				// @ts-expect-error - Except res.success
				if (res?.success) {
					const formattedTime = now.toLocaleTimeString('vi-VN', {
						hour: '2-digit',
						minute: '2-digit',
						second: '2-digit'
					});
					toast.success(`Check-out thành công lúc  ${formattedTime}`);
					dispatch(fetchAttendanceDetailsByUserID(profile?.id));
				}
			}
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error(
					(err.response.data as { message?: string }).message || 'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
				);
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy nhân viên.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline' className='h-[32px] w-full items-center justify-start border-none px-[8px] py-[6px]'>
					<CalendarCheck />
					Chấm công
				</Button>
			</DialogTrigger>
			<DialogContent className='!w-[50vw] !max-w-none'>
				<DialogHeader>
					<DialogTitle>Bảng chấm công</DialogTitle>
					<DialogDescription>
						Đảm bảo bạn luôn nhớ check-in và check-out đúng giờ để theo dõi thời gian làm việc chính xác và tránh sai
						sót trong bảng chấm công!
					</DialogDescription>
				</DialogHeader>
				<EmployeeCalendar events={events} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} />
			</DialogContent>
		</Dialog>
	);
}

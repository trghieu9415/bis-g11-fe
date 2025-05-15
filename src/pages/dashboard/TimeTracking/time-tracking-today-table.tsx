import CustomTable from '@/components/custom-table';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import CustomDialog from '@/components/custom-dialog';
import { fetchAllTimeTrackingToday } from '@/redux/slices/timeTrackingTodaySlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { checkIn, updateAttendanceDetail } from '@/services/attendanceDetailService';
import { ColumnDef } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import {
	AlertTriangle,
	ArrowUpDown,
	Baby,
	CalendarCheck,
	CheckCircle,
	Ellipsis,
	Hospital,
	PartyPopper,
	XCircle,
	Minus,
	Dot
} from 'lucide-react';
import { useState } from 'react';
import { RegisterOptions } from 'react-hook-form';
import { toast } from 'react-toastify';

type TimeTrackingToday = {
	id: number;
	idString: string;
	checkIn: string;
	checkOut: string;
	workingDay: string;
	attendanceStatus: string;
	leaveTypeEnum: number | null;
	userId: number;
	userIdString: string;
	fullName: string;
	attendanceId: number;
	leaveTypeEnumLabel?: string;
	attendanceStatusLabel?: string;
};

type FieldConfig = {
	label: string;
	key: keyof TimeTrackingToday;
	type: 'input' | 'select' | 'number' | 'date' | 'time';
	options?: { value: string; label: string; isBoolean?: boolean }[];
	disabled?: boolean;
	validation?: RegisterOptions;
	showOnly?: 'view' | 'edit' | 'delete';
	isShow?: boolean;
};

export default function TimeTrackingTodayTable() {
	const [selectedTimeTrackingToday, setSelectedTimeTrackingToday] = useState<TimeTrackingToday | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');

	const dispatch = useAppDispatch();
	const { timeTrackingToday } = useSelector((state: RootState) => state.timeTrackingToday);
	const formattedDate = format(new Date(), 'yyyy-MM-dd');

	const columns: ColumnDef<TimeTrackingToday>[] = [
		{
			accessorKey: 'idString',
			header: ({ column }) => (
				<Button
					variant='link'
					className='w-16 text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					ID <ArrowUpDown />
				</Button>
			),
			enableHiding: false
		},
		{
			accessorKey: 'userIdString',
			header: ({ column }) => (
				<Button
					variant='link'
					className='w-28 text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					ID nhân viên <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex items-center'>{row.getValue('userIdString')}</span>,
			enableHiding: false
		},
		{
			accessorKey: 'fullName',
			header: ({ column }) => (
				<Button
					variant='link'
					className='w-40 text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Họ và tên <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex items-center'>{row.getValue('fullName')}</span>,
			enableHiding: false
		},
		{
			accessorKey: 'workingHours',
			header: ({ column }) => (
				// <Button
				// 	variant='link'
				// 	className='text-white min-w-[200px]'
				// 	onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				// >
				// 	Giờ làm việc <ArrowUpDown />
				// </Button>
				<Select
					onValueChange={value => {
						const newValue = value === 'all' ? undefined : value;
						column.setFilterValue(newValue);
					}}
				>
					<SelectTrigger className='bg-bg-green-800 w-full border-0 text-white ring-0 focus-visible:ring-0 focus-visible:ring-offset-0'>
						<SelectValue placeholder='Giờ làm việc' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Giờ làm việc</SelectItem>
						<SelectItem value='early'>Đi sớm</SelectItem>
						<SelectItem value='onTime'>Đúng giờ</SelectItem>
						<SelectItem value='late'>Đi trễ</SelectItem>
						<SelectItem value='leaveEarly'>Về sớm</SelectItem>
						<SelectItem value='leaveLate'>Về trễ</SelectItem>
					</SelectContent>
				</Select>
			),
			filterFn: (row, columnId, filterValue) => {
				const checkIn = row.original.checkIn;
				const checkOut = row.original.checkOut;

				if (!checkIn) return filterValue === 'late'; // If not checkin => Late

				const [inHour, inMinute] = checkIn.split(':').map(Number);
				const totalCheckInMinutes = inHour * 60 + inMinute;

				if (filterValue === 'early') return totalCheckInMinutes < 480; // Before 8AM
				if (filterValue === 'onTime') return totalCheckInMinutes >= 480 && totalCheckInMinutes <= 495; // 08:00 - 08:15
				if (filterValue === 'late') return totalCheckInMinutes > 495; // After 8:15AM

				if (!checkOut) return false;

				const [outHour, outMinute] = checkOut.split(':').map(Number);
				const totalCheckOutMinutes = outHour * 60 + outMinute;
				if (filterValue === 'leaveEarly') return totalCheckOutMinutes < 1050; // Before 5:30PM
				if (filterValue === 'leaveLate') return totalCheckOutMinutes >= 1080; // After 6PM

				return true;
			},
			cell: ({ row }) => {
				const checkIn = row.original.checkIn;
				const checkOut = row.original.checkOut;

				const formatTime = (time: string | null): string => {
					if (!time) return '--:--';
					const [hour, minute] = time.split(':').map(Number);
					const ampm = hour >= 12 ? 'PM' : 'AM';
					const formattedHour = (hour % 12 || 12).toString().padStart(2, '0');
					const formattedMinute = minute.toString().padStart(2, '0');
					return `${formattedHour}:${formattedMinute} ${ampm}`;
				};

				const getCheckInColorCheckIn = (checkIn: string | null) => {
					if (!checkIn) return 'text-gray-400';

					const [hour, minute] = checkIn.split(':').map(Number);
					const totalMinutes = hour * 60 + minute;

					if (totalMinutes < 480) return 'text-blue-500';
					if (totalMinutes <= 495) return 'text-black';
					return 'text-red-500';
				};

				const getCheckOutColorCheckOut = (checkOut: string | null) => {
					if (!checkOut) return 'text-gray-400';

					const [hour, minute] = checkOut.split(':').map(Number);
					const totalMinutes = hour * 60 + minute;

					if (totalMinutes < 1050) return 'text-red-500';
					if (totalMinutes < 1080) return 'text-black';
					return 'text-orange-500';
				};

				return (
					<div className='grid grid-cols-3 items-center text-sm font-semibold text-gray-700'>
						<span className={classNames('text-center', getCheckInColorCheckIn(checkIn))}>{formatTime(checkIn)}</span>
						<div className='flex justify-center'>
							<Minus className='w-6 text-gray-300' stroke='currentColor' />
						</div>
						<span className={classNames('text-center', getCheckOutColorCheckOut(checkOut))}>
							{formatTime(checkOut)}
						</span>
					</div>
				);
			}
		},
		{
			accessorKey: 'attendanceStatus',
			header: ({ column }) => (
				<Select
					onValueChange={value => {
						const newValue = value === 'all' ? undefined : value;
						column.setFilterValue(newValue);
					}}
				>
					<SelectTrigger className='bg-bg-green-800 w-40 border-0 text-white ring-0 focus-visible:ring-0 focus-visible:ring-offset-0'>
						<SelectValue placeholder='Trạng thái' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Trạng thái</SelectItem>
						<SelectItem value='PRESENT'>Có mặt</SelectItem>
						<SelectItem value='ON_LEAVE'>Vắng có phép</SelectItem>
						<SelectItem value='ABSENT'>Vắng mặt</SelectItem>
					</SelectContent>
				</Select>
			),
			cell: ({ row }) => {
				const checkIn = row.original.checkIn;
				return (
					<span className='flex justify-center'>
						{row.getValue('attendanceStatus') === 'PRESENT' ? (
							<p className='flex w-[84%] items-center justify-center gap-1 rounded-sm bg-green-500 p-1 text-white'>
								<CheckCircle className='mr-1 h-4 w-4' stroke='white' />
								Có mặt
							</p>
						) : row.getValue('attendanceStatus') === 'ON_LEAVE' ? (
							<p className='flex w-[84%] items-center justify-center gap-1 rounded-sm bg-yellow-500 p-1 text-white'>
								<CalendarCheck className='mr-1 h-4 w-4' stroke='white' /> Vắng có phép
							</p>
						) : row.getValue('attendanceStatus') === 'ABSENT' && !checkIn ? (
							<p className='flex w-[84%] items-center justify-center gap-1 rounded-sm bg-red-500 p-1 text-white'>
								<XCircle className='mr-1 h-4 w-4' stroke='white' /> Vắng mặt
							</p>
						) : (
							<span className='flex justify-center text-gray-400'>Chưa cập nhật</span>
						)}
					</span>
				);
			}
		},
		{
			accessorKey: 'leaveTypeEnum',
			header: ({ column }) => (
				<Select
					onValueChange={value => {
						const newValue = value === 'all' ? undefined : Number(value);
						column.setFilterValue(newValue);
					}}
				>
					<SelectTrigger className='bg-bg-green-800 w-40 border-0 text-white ring-0 focus-visible:ring-0 focus-visible:ring-offset-0'>
						<SelectValue placeholder='Loại nghỉ' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Loại nghỉ</SelectItem>
						<SelectItem value='0'>Nghỉ bệnh</SelectItem>
						<SelectItem value='1'>Nghỉ phép</SelectItem>
						<SelectItem value='2'>Nghỉ thai sản</SelectItem>
						<SelectItem value='3'>Nghỉ lễ</SelectItem>
					</SelectContent>
				</Select>
			),
			cell: ({ row }) => {
				const checkIn = row.original.checkIn;

				return (
					<span className='flex justify-center'>
						{row.getValue('leaveTypeEnum') === 0 ? (
							<p className='flex w-[95%] items-center justify-center gap-1 rounded-sm bg-blue-500 p-1 text-white'>
								<Hospital className='mr-1 h-4 w-4' stroke='white' />
								Nghỉ bệnh
							</p>
						) : row.getValue('leaveTypeEnum') === 1 ? (
							<p className='flex w-[95%] items-center justify-center gap-1 rounded-sm bg-orange-500 p-1 text-white'>
								<CalendarCheck className='mr-1 h-4 w-4' stroke='white' /> Nghỉ phép
							</p>
						) : row.getValue('leaveTypeEnum') === 2 ? (
							<p className='flex w-[95%] items-center justify-center gap-1 rounded-sm bg-pink-500 p-1 text-white'>
								<Baby className='h-4 w-6' stroke='white' /> Nghỉ thai sản
							</p>
						) : row.getValue('leaveTypeEnum') === 3 ? (
							<p className='flex w-[95%] items-center justify-center gap-1 rounded-sm bg-yellow-500 p-1 text-white'>
								<PartyPopper className='mr-1 h-4 w-4' stroke='white' /> Nghỉ lễ
							</p>
						) : row.getValue('attendanceStatus') === 'ABSENT' && !checkIn ? (
							<p className='flex w-[95%] items-center justify-center gap-1 rounded-sm bg-red-500 p-1 text-white'>
								<AlertTriangle className='mr-1 h-4 w-4' stroke='white' /> Không phép
							</p>
						) : (
							<span className='flex justify-center text-gray-400'>--</span>
						)}
					</span>
				);
			},
			filterFn: (row, columnId, filterValue) => {
				if (filterValue === undefined) return true;
				return row.getValue(columnId) == filterValue;
			}
		},
		{
			id: 'actions',
			header: 'Thao tác',
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon'>
							<Ellipsis className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'view')}>Xem</DropdownMenuItem>
						{row.original.attendanceStatus === 'ABSENT' && (
							<DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'edit')}>Sửa</DropdownMenuItem>
						)}
						{/* <DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'delete')}>Xóa</DropdownMenuItem> */}
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	];

	const handleOpenDialog = (timeTrackingToday: TimeTrackingToday, mode: 'view' | 'edit' | 'delete') => {
		const leaveTypeMap: Record<number, string> = {
			0: 'Nghỉ bệnh',
			1: 'Nghỉ phép',
			2: 'Nghỉ thai sản',
			3: 'Nghỉ lễ'
		};

		const attendanceStatusMap: Record<string, string> = {
			PRESENT: 'Có mặt',
			ON_LEAVE: 'Vắng có phép',
			ABSENT: 'Vắng mặt'
		};

		const data = {
			...timeTrackingToday,
			leaveTypeEnumLabel:
				timeTrackingToday?.leaveTypeEnum !== null ? leaveTypeMap[timeTrackingToday.leaveTypeEnum as number] : '--',
			attendanceStatusLabel: attendanceStatusMap[timeTrackingToday?.attendanceStatus ?? ''] || 'Chưa cập nhật'
		};
		setSelectedTimeTrackingToday(data);
		setDialogMode(mode);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setSelectedTimeTrackingToday(null);
	};

	const timeTrackingTodayFields: FieldConfig[][][] = [
		[
			[
				{
					label: 'Mã chấm công',
					key: 'idString',
					type: 'input',
					disabled: true
				},
				{
					label: 'Mã NV',
					key: 'userIdString',
					type: 'input',
					disabled: true
				}
			],
			[{ label: 'Ngày chấm công', key: 'workingDay', type: 'date', disabled: true }]
		],
		[
			[
				{
					label: 'Họ và tên',
					key: 'fullName',
					type: 'input',
					disabled: true
				}
			],
			[
				{
					label: 'Trạng thái',
					key: 'attendanceStatusLabel',
					type: 'input',
					disabled: true
				},
				{
					label: 'Loại nghỉ',
					key: 'leaveTypeEnumLabel',
					type: 'input',
					disabled: true
				}
			]
		],
		[
			[],
			[
				{
					label: 'Giờ check-in',
					key: 'checkIn',
					type: 'time',
					validation: {
						required: 'Vui lòng nhập giờ check-in',
						pattern: {
							value: /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
							message: 'Định dạng không hợp lệ (HH:mm:ss)'
						},
						validate: value => {
							if (value === '00:00:00') return 'Vui lòng nhập giờ check-in';
							if (!selectedTimeTrackingToday?.checkIn) return true;
							const [hh, mm, ss] = value.split(':').map(Number);
							if (hh > 23 || mm > 59 || ss > 59) {
								return 'Giờ nhập vào không hợp lệ';
							}
						}
					}
					// isShow: selectedTimeTrackingToday?.attendanceStatus === 'PRESENT' && true
				},
				{
					label: 'Giờ check-out',
					key: 'checkOut',
					type: 'time',
					validation: {
						required: 'Vui lòng nhập giờ check-out',
						pattern: {
							value: /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
							message: 'Định dạng không hợp lệ (HH:mm:ss)'
						},
						validate: value => {
							if (value === '00:00:00') return 'Vui lòng nhập giờ check-in';
							if (!selectedTimeTrackingToday?.checkIn) return true;
							const [hh, mm, ss] = value.split(':').map(Number);
							if (hh > 23 || mm > 59 || ss > 59) {
								return 'Giờ nhập vào không hợp lệ';
							}

							const checkInTime = selectedTimeTrackingToday?.checkIn.split(':').map(Number);
							const checkOutTime = value.split(':').map(Number);

							const checkInSeconds = checkInTime[0] * 3600 + checkInTime[1] * 60 + checkInTime[2];
							const checkOutSeconds = checkOutTime[0] * 3600 + checkOutTime[1] * 60 + checkOutTime[2];

							return checkOutSeconds > checkInSeconds || 'Giờ check-out phải lớn hơn giờ check-in';
						}
					}
					// isShow: selectedTimeTrackingToday?.attendanceStatus === 'PRESENT' && true
				}
			]
		]
	];

	const formatToFake7Z = (date: string, time: string): string | null => {
		return time === '00:00:00' ? null : `${date}T${time}.000Z`;
	};

	const handleSave = async (data: TimeTrackingToday) => {
		const attendanceDetail = {
			userId: data.userId,
			checkIn: formatToFake7Z(data.workingDay, data.checkIn),
			checkOut: formatToFake7Z(data.workingDay, data.checkOut)
		};

		try {
			await updateAttendanceDetail(attendanceDetail);
			toast.success('Cập nhật chấm công thành công!');
			dispatch(fetchAllTimeTrackingToday(formattedDate));
			setIsDialogOpen(false);
		} catch (error: unknown) {
			const err = error as AxiosError;
			if (err.response?.status === 400) {
				toast.error(
					(err.response.data as { message?: string }).message || 'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
				);
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy chấm công.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	// const handleDelete = async (data: Employee) => {
	// 	const userId = data.id;

	// 	try {
	// 		await deleteUser(userId);
	// 		toast.success('Cập nhật thông tin nhân viên thành công!');
	// 		dispatch(fetchUsers());
	// 		setIsDialogOpen(false);
	// 	} catch (error) {
	// 		const err = error as AxiosError;

	// 		if (err.response?.status === 400) {
	// 			toast.error('Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
	// 		} else if (err.response?.status === 404) {
	// 			toast.error('Lỗi 404: Không tìm thấy nhân viên.');
	// 		} else if (err.response?.status === 500) {
	// 			toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
	// 		} else {
	// 			toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
	// 		}
	// 	}
	// };

	return (
		<div>
			<CustomTable columns={columns} data={timeTrackingToday} stickyClassIndex={0} />
			{selectedTimeTrackingToday && (
				<CustomDialog
					entity={{
						...selectedTimeTrackingToday,
						checkIn: selectedTimeTrackingToday.checkIn ? selectedTimeTrackingToday.checkIn : '00:00:00',
						checkOut: selectedTimeTrackingToday.checkOut ? selectedTimeTrackingToday.checkOut : '00:00:00',
						leaveTypeEnum: selectedTimeTrackingToday.leaveTypeEnum ? selectedTimeTrackingToday.leaveTypeEnum : 5 // 5 == null
					}}
					isOpen={isDialogOpen}
					onClose={handleCloseDialog}
					mode={dialogMode}
					fields={timeTrackingTodayFields}
					onSave={handleSave}
					// onDelete={handleDelete}
				/>
			)}
		</div>
	);
}

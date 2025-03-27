import CustomTable from '@/components/custom-table';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { fetchAllTimeTrackingMonth } from '@/redux/slices/timeTrackingMonthSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { getAllAttendanceDetailByUser } from '@/services/attendanceDetailService';
import { ColumnDef } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { ArrowUpDown, Ellipsis } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import TimeTrackingMonthDialog from './components/time-tracking-month-dialog';

type TimeTrackingMonth = {
	id: number;
	idString: string;
	monthOfYear: string;
	totalWorkingDays: number;
	totalSickLeaves: number;
	totalPaidLeaves: number;
	totalMaternityLeaves: number;
	totalUnpaidLeaves: number;
	totalHolidayLeaves: number;
	userId: number;
};

interface AttendanceDetail {
	id: number;
	idString: string;
	checkIn: string;
	checkOut: string;
	workingDay: string;
	attendanceStatus: string;
	leaveTypeEnum: number | null;
	lateTypeEnum: string | null;
	userId: number;
	userIdString: string;
	fullName: string;
	attendanceId: number;
}

export default function TimeTrackingMonthTable() {
	const [selectedTimeTrackingMonth, setSelectedTimeTrackingMonth] = useState<TimeTrackingMonth | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');
	const [events, setEvents] = useState([]);

	const dispatch = useAppDispatch();
	const { timeTrackingMonth } = useSelector((state: RootState) => state.timeTrackingMonth);

	useEffect(() => {
		const formattedDate = format(new Date(), 'yyyy-MM');
		dispatch(fetchAllTimeTrackingMonth(formattedDate));
		// dispatch(fetchAllTimeTrackingMonth('2025-02'));
	}, [dispatch]);

	const columns: ColumnDef<TimeTrackingMonth>[] = [
		{
			accessorKey: 'idString',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-16'
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
					className='text-white w-28'
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
					className='text-white w-20'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Họ và tên <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex items-center'>{row.getValue('fullName')}</span>,
			enableHiding: false
		},

		{
			accessorKey: 'totalHolidayLeaves',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-20'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Nghỉ lễ <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex items-center float-end'>{row.getValue('totalHolidayLeaves')}</span>,
			enableHiding: true
		},
		{
			accessorKey: 'totalSickLeaves',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-20'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Nghỉ bệnh <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex items-center float-end'>{row.getValue('totalSickLeaves')}</span>,
			enableHiding: true
		},
		{
			accessorKey: 'totalPaidLeaves',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-20'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Nghỉ phép <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex items-center float-end'>{row.getValue('totalPaidLeaves')}</span>,
			enableHiding: true
		},
		{
			accessorKey: 'totalMaternityLeaves',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-[84px]'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Nghỉ thai sản <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex items-center float-end'>{row.getValue('totalMaternityLeaves')}</span>,
			enableHiding: true
		},
		{
			accessorKey: 'totalWorkingDays',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-20'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Làm việc <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex items-center float-end'>{row.getValue('totalWorkingDays')}</span>,
			enableHiding: true
		},
		// {
		// 	accessorKey: 'workDistribute',
		// 	header: ({ column }) => (
		// 		<Button
		// 			variant='link'
		// 			className='text-white w-24'
		// 			onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
		// 		>
		// 			Phân bổ CV <ArrowUpDown />
		// 		</Button>
		// 	),
		// 	cell: ({ row }) => {
		// 		const totalHolidayLeaves = row.original.totalHolidayLeaves;
		// 		const totalSickLeaves = row.original.totalSickLeaves;
		// 		const totalPaidLeaves = row.original.totalPaidLeaves;
		// 		const totalUnpaidLeaves = row.original.totalUnpaidLeaves;
		// 		const totalMaternityLeaves = row.original.totalMaternityLeaves;
		// 		const totalWorkingDays = row.original.totalWorkingDays;

		// 		const data = [
		// 			{ name: 'Ngày làm việc', value: totalWorkingDays, fill: '#4CAF50' },
		// 			{ name: 'Nghỉ lễ', value: totalHolidayLeaves, fill: '#FFEB3B' },
		// 			{ name: 'Nghỉ bệnh', value: totalSickLeaves, fill: '#2196F3' },
		// 			{ name: 'Nghỉ phép', value: totalPaidLeaves, fill: '#FF5722' },
		// 			{ name: 'Nghỉ thai sản', value: totalMaternityLeaves, fill: '#9C27B0' },
		// 			{ name: 'Nghỉ không phép', value: totalUnpaidLeaves, fill: '#F44336' }
		// 		];

		// 		return (
		// 			<Dialog>
		// 				<DialogTrigger asChild>
		// 					<Button variant='outline' className='text-center block mx-auto'>
		// 						<ChartPie />
		// 					</Button>
		// 				</DialogTrigger>
		// 				<DialogContent className='sm:max-w-[600px]'>
		// 					<DialogHeader>
		// 						<DialogTitle>Biểu đồ phân bổ ngày nghỉ và làm việc</DialogTitle>
		// 						<DialogDescription>
		// 							Biểu đồ này thể hiện tỷ lệ các loại ngày nghỉ và ngày làm việc của nhân viên. Bạn có thể xem chi tiết
		// 							các ngày nghỉ lễ, bệnh, phép, thai sản, không phép và ngày làm việc.
		// 						</DialogDescription>
		// 					</DialogHeader>
		// 					<div style={{ width: '100%', height: 400 }}>
		// 						<ResponsiveContainer width='100%' height='100%'>
		// 							<PieChart>
		// 								<Pie data={data} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius='80%' label>
		// 									{data.map((entry, index) => (
		// 										<Cell key={`cell-${index}`} fill={entry.fill} />
		// 									))}
		// 								</Pie>
		// 								<Legend />
		// 								<Tooltip />
		// 							</PieChart>
		// 						</ResponsiveContainer>
		// 					</div>
		// 					<DialogFooter>
		// 						<Button type='submit'>Đóng</Button>
		// 					</DialogFooter>
		// 				</DialogContent>
		// 			</Dialog>
		// 		);
		// 	}
		// },
		{
			id: 'actions',
			header: 'Thao tác',
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon'>
							<Ellipsis className='w-4 h-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'view')}>Xem</DropdownMenuItem>
						{/* <DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'edit')}>Sửa</DropdownMenuItem> */}
						{/* <DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'delete')}>Xóa</DropdownMenuItem> */}
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	];

	const fetchEvents = async (userId: number, monthOfYear: string) => {
		try {
			const response = await getAllAttendanceDetailByUser(userId);
			if (response?.data) {
				const data = response.data.filter((item: AttendanceDetail) => item.workingDay.startsWith(monthOfYear));

				const events = data.map((item: AttendanceDetail) => {
					let calendarId = '';
					let title = '';

					if (item.leaveTypeEnum !== null) {
						if (item.leaveTypeEnum === 0) {
							calendarId = 'blue-theme'; // (SICK_LEAVE)
							title = 'Nghỉ bệnh';
						} else if (item.leaveTypeEnum === 1) {
							calendarId = 'orange-theme'; // (PAID_LEAVE)
							title = 'Nghỉ phép';
						} else if (item.leaveTypeEnum === 2) {
							calendarId = 'pink-theme'; //(MATERNITY_LEAVE)
							title = 'Nghỉ thai sản';
						} else if (item.leaveTypeEnum === 3) {
							calendarId = 'purple-theme'; //(HOLIDAY_LEAVE)
							title = 'Nghỉ lễ';
						}
					}

					if (item.attendanceStatus === 'ABSENT') {
						calendarId = 'red-theme'; // (ABSENT)
						title = 'Vắng không phép';
					} else if (item.attendanceStatus === 'PRESENT') {
						if (!calendarId) {
							if (item?.lateTypeEnum) {
								calendarId = 'yellow-theme'; // (PRESENT but LATE)
								title = 'Đi trễ';
							} else {
								calendarId = 'green-theme'; // (PRESENT)
								title = 'Có mặt';
							}
						}
					}

					const checkOut = item.checkOut ? ' ' + item.checkOut.split(':').slice(0, 2).join(':') : '';
					const checkIn = item.checkIn ? ' ' + item.checkIn.split(':').slice(0, 2).join(':') : '';

					return {
						calendarId: calendarId,
						end: `${item.workingDay}${checkOut}`,
						id: item.idString,
						start: `${item.workingDay}${checkIn}`,
						title: `${checkOut ? '- ' + checkOut + ':' : ''} ${title}`
					};
				});

				// console.log(events);
				setEvents(events);
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

	const handleOpenDialog = async (timeTrackingMonth: TimeTrackingMonth, mode: 'view' | 'edit' | 'delete') => {
		console.log(timeTrackingMonth);
		setSelectedTimeTrackingMonth(timeTrackingMonth);
		await fetchEvents(timeTrackingMonth.userId, timeTrackingMonth.monthOfYear);
		console.log(events, timeTrackingMonth?.monthOfYear);

		setDialogMode(mode);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setSelectedTimeTrackingMonth(null);
	};

	const hiddenColumns = {
		// totalHolidayLeaves: false,
		// totalMaternityLeaves: false,
		// totalPaidLeaves: false,
		// totalSickLeaves: false,
		// totalUnpaidLeaves: false,
		// totalWorkingDays: false
	};

	return (
		<div>
			<CustomTable columns={columns} data={timeTrackingMonth} hiddenColumns={hiddenColumns} stickyClassIndex={0} />
			{events.length > 0 && selectedTimeTrackingMonth?.monthOfYear && (
				<Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
					<DialogContent className='max-w-[70vw] max-h-[100vh]'>
						<DialogHeader>
							<DialogTitle>Lịch làm việc và nghỉ của nhân viên</DialogTitle>
							<DialogDescription></DialogDescription>
						</DialogHeader>
						<TimeTrackingMonthDialog events={events} monthOfYear={selectedTimeTrackingMonth?.monthOfYear} />
						<DialogFooter>
							<Button onClick={handleCloseDialog}>Đóng</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}

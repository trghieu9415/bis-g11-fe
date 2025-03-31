import CustomTable from '@/components/custom-table';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Ellipsis } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RegisterOptions } from 'react-hook-form';
import { useSelector } from 'react-redux';

// import data from '@/pages/dashboard/HREmployees/data.json';
import { fetchHolidays } from '@/redux/slices/holidaysSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import HolidayCalendar from './holiday-calendar/holiday-calendar';
import CustomDialog from '@/components/custom-dialog';
import { deleteHoliday, updateHoliday } from '@/services/holidayService';
import '@schedule-x/theme-default/dist/index.css';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface EventType {
	end: string;
	id: number;
	start: string;
	title: string;
	description: string;
}

type Holiday = {
	id: number;
	idString: string;
	name: string;
	startDate: string;
	endDate: string;
	description: string;
	status: number;
};

type FieldConfig = {
	label: string;
	key: keyof Holiday;
	type: 'input' | 'select' | 'number' | 'date';
	options?: { value: string; label: string; isBoolean?: boolean }[];
	disabled?: boolean;
	validation?: RegisterOptions;
	showOnly?: 'view' | 'edit' | 'delete';
};

interface HolidayCalendarProps {
	newEvent: EventType | null;
}

export default function HolidayTable({ newEvent }: HolidayCalendarProps) {
	const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');

	const dispatch = useAppDispatch();
	const { holidays } = useSelector((state: RootState) => state.holidays);
	const [events, setEvents] = useState(holidays);

	useEffect(() => {
		setEvents(holidays);
	}, [holidays]);

	useEffect(() => {
		dispatch(fetchHolidays());
	}, [dispatch]);

	const columns: ColumnDef<Holiday>[] = [
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
			accessorKey: 'name',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-40'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Tên ngày lễ <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex items-center'>{row.getValue('name')}</span>,
			enableHiding: false
		},
		{
			accessorKey: 'description',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-40'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Mô tả <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex items-center'>{row.getValue('description')}</span>,
			enableHiding: true
		},
		{
			accessorKey: 'startDate',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-32'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Ngày bắt đầu <ArrowUpDown />
				</Button>
			)
		},
		{
			accessorKey: 'endDate',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-32'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Ngày kết thúc
					<ArrowUpDown />
				</Button>
			)
		},
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
						{new Date(row.original.startDate) > new Date() && (
							<DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'edit')}>Sửa</DropdownMenuItem>
						)}
						{new Date(row.original.startDate) > new Date() && (
							<DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'delete')}>Xóa</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	];

	const handleOpenDialog = (holiday: Holiday, mode: 'view' | 'edit' | 'delete') => {
		setSelectedHoliday(holiday);
		setDialogMode(mode);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setSelectedHoliday(null);
	};

	const hiddenColumns = {
		description: false
	};

	const holidayFields: FieldConfig[][][] = [
		[
			[
				{
					label: 'Mã nghỉ lễ',
					key: 'idString',
					type: 'input',
					disabled: true
				}
			],
			[
				{
					label: 'Tên ngày lễ',
					key: 'name',
					type: 'input',
					validation: { required: 'Vui lòng nhập tên ngày lễ' }
				}
			]
		],
		[
			[
				{
					label: 'Mô tả',
					key: 'description',
					type: 'input',
					validation: { required: 'Vui lòng nhập mô tả' }
				}
			]
		],
		[
			[
				{
					label: 'Ngày bắt đầu',
					key: 'startDate',
					type: 'date',
					validation: {
						required: 'Vui lòng chọn ngày bắt đầu',
						validate: value => {
							if (!value) return 'Ngày bắt đầu không hợp lệ';

							const startDate = new Date(value);
							const tomorrow = new Date();
							tomorrow.setDate(tomorrow.getDate() + 1);

							if (startDate < tomorrow) {
								return 'Ngày bắt đầu phải từ ngày mai trở đi';
							}

							return true;
						}
					}
				}
			],
			[
				{
					label: 'Ngày kết thúc',
					key: 'endDate',
					type: 'date',
					validation: {
						required: 'Vui lòng chọn ngày kết thúc',
						validate: value => {
							if (!value) return 'Ngày kết thúc không hợp lệ';

							if (selectedHoliday?.startDate) {
								const startDate = new Date(selectedHoliday?.startDate);
								const endDate = new Date(value);

								if (endDate <= startDate) {
									return 'Ngày kết thúc phải lớn hơn ngày bắt đầu';
								}
							}

							return true;
						}
					}
				}
			]
		]
	];

	const [saveEventId, setSaveEventId] = useState<EventType | null>(null);
	const handleSave = async (data: Holiday) => {
		const holidayId = data.id;
		const eventData = {
			end: data.endDate,
			id: data.id,
			start: data.startDate,
			title: data.name,
			description: data.description
		};

		const holidayData = {
			id: data.id,
			startDate: data.startDate,
			endDate: data.endDate,
			name: data.name,
			description: data.description
		};

		try {
			await updateHoliday(holidayId, holidayData);
			toast.success('Cập nhật ngày nghĩ lễ thành công!');
			dispatch(fetchHolidays());
			setIsDialogOpen(false);
			setSaveEventId(eventData);
		} catch (error: unknown) {
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

	const [deleteEventId, setDeleteEventId] = useState<number | undefined>(undefined);
	const handleDelete = async (data: Holiday) => {
		const holidayId = data.id;

		try {
			await deleteHoliday(holidayId);
			toast.success('Hủy lịch nghỉ lễ thành công!');
			dispatch(fetchHolidays());
			setIsDialogOpen(false);
			setDeleteEventId(holidayId);
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error(
					(err.response.data as { message?: string }).message || 'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
				);
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy lịch nghỉ lễ.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	return (
		<div className='flex w-full gap-4'>
			<PanelGroup direction='horizontal' className='flex w-full h-full rounded-sm'>
				<Panel defaultSize={50} minSize={20} maxSize={80} className='overflow-auto'>
					<CustomTable columns={columns} data={holidays} hiddenColumns={hiddenColumns} stickyClassIndex={0} />
				</Panel>

				<PanelResizeHandle className='w-2 cursor-ew-resize' />

				<Panel defaultSize={30} minSize={38} maxSize={80} className='overflow-auto'>
					{events?.length > 0 && (
						<HolidayCalendar events={events} onDelete={deleteEventId} onSave={saveEventId} onAdd={newEvent} />
					)}
				</Panel>
			</PanelGroup>

			{selectedHoliday && (
				<CustomDialog
					entity={selectedHoliday}
					isOpen={isDialogOpen}
					onClose={handleCloseDialog}
					mode={dialogMode}
					fields={holidayFields}
					onSave={handleSave}
					onDelete={handleDelete}
				/>
			)}
		</div>
	);
}

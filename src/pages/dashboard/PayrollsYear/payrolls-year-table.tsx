import CustomTable from '@/components/custom-table';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, CalendarCheck, CheckCircle, Ellipsis, Mars, UserRoundPen, Venus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { fetchUsers } from '@/redux/slices/usersSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import PayrollsYearDialog from './payrolls-year-dialog';

type Employee = {
	id: number;
	idString: string;
	full_name: string;
	role: string;
	status: boolean;
	base_salary: number;
	level: string;
	salary_coefficient: number;
	gender: boolean;
	email: string;
	phone: string;
	date_of_birth: string;
	address: string;
	username: string;
	password: string;
};

type PayrollYearsTableProps = {
	year: string;
};

export default function PayrollsYearTable({ year }: PayrollYearsTableProps) {
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');

	const dispatch = useAppDispatch();
	const { users } = useSelector((state: RootState) => state.users);

	useEffect(() => {
		dispatch(fetchUsers());
	}, [dispatch]);

	const columns: ColumnDef<Employee>[] = [
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
			accessorKey: 'full_name',
			header: ({ column }) => (
				<Button
					variant='link'
					className='w-40 text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Họ và tên <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => (
				<span className='flex items-center'>
					<Button variant='ghost' className='mr-2 h-5 p-1 text-black'>
						<UserRoundPen />
					</Button>
					{row.getValue('full_name')}
				</span>
			),
			enableHiding: false
		},
		{
			accessorKey: 'gender',
			header: ({ column }) => (
				<Button
					variant='link'
					className='w-20 text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Giới tính <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => {
				return (
					<span className='flex justify-center'>
						{row.getValue('gender') ? (
							<p className='flex w-[100%] items-center justify-center gap-1 rounded-sm bg-blue-500 p-1 text-white'>
								<Mars className='mr-1 h-4 w-4' stroke='white' />
								Nam
							</p>
						) : (
							<p className='flex w-[100%] items-center justify-center gap-1 rounded-sm bg-pink-500 p-1 text-white'>
								<Venus className='mr-1 h-4 w-4' stroke='white' /> Nữ
							</p>
						)}
					</span>
				);
			}
			// enableHiding: false
		},
		{
			accessorKey: 'role',
			header: ({ column }) => (
				<Button
					variant='link'
					className='w-40 text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Chức vụ hiện tại <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => (
				<span className='flex justify-start'>{row.getValue('role') ? row.getValue('role') : '--'}</span>
			)
		},
		{
			accessorKey: 'level',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Cấp bậc hiện tại <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => (
				<span className='flex justify-start'>{row.getValue('level') ? row.getValue('level') : '--'}</span>
			)
		},
		{
			accessorKey: 'status',
			header: ({ column }) => (
				<Button
					variant='link'
					className='w-30 text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Trạng thái <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => {
				return (
					<span className='flex justify-center'>
						{row.getValue('status') && row.getValue('role') !== '' ? (
							<p className='flex w-[100%] items-center justify-center gap-1 rounded-sm bg-green-500 p-1 text-white'>
								<CheckCircle className='mr-1 h-4 w-4' stroke='white' />
								Đang làm việc
							</p>
						) : (
							row.getValue('role') === '' && (
								<p className='flex w-[100%] items-center justify-center gap-1 rounded-sm bg-yellow-500 p-1 text-white'>
									<CalendarCheck className='mr-1 h-4 w-4' stroke='white' /> Hết hợp đồng
								</p>
							)
						)}
					</span>
				);
			},
			sortingFn: (rowA, rowB) => {
				const statusA = rowA.original.status ? 1 : 0;
				const statusB = rowB.original.status ? 1 : 0;
				return statusA - statusB;
			},
			enableHiding: false
		},

		{
			accessorKey: 'email',
			header: ({ column }) => (
				<Button
					variant='link'
					className='w-52 text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Email <ArrowUpDown />
				</Button>
			)
		},
		{
			accessorKey: 'phone',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Số điện thoại <ArrowUpDown />
				</Button>
			)
		},
		{
			accessorKey: 'date_of_birth',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Ngày sinh <ArrowUpDown />
				</Button>
			)
		},
		{
			accessorKey: 'address',
			header: ({ column }) => (
				<Button
					variant='link'
					className='w-72 text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Địa chỉ <ArrowUpDown />
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
							<Ellipsis className='h-4 w-4' />
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

	const handleOpenDialog = (employee: Employee, mode: 'view' | 'edit' | 'delete') => {
		setSelectedEmployee(employee);
		setDialogMode(mode);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setSelectedEmployee(null);
	};

	const hiddenColumns = {
		gender: false,
		date_of_birth: false,
		address: false,
		base_salary: false,
		salary_coefficient: false,
		email: false,
		phone: false
	};

	return (
		<div>
			<CustomTable columns={columns} data={users} hiddenColumns={hiddenColumns} />
			{selectedEmployee && year && (
				<PayrollsYearDialog
					year={year}
					isDialogOpen={isDialogOpen}
					selectedId={selectedEmployee.id}
					handleCloseDialog={handleCloseDialog}
				/>
			)}
			{/* <PayrollsYearDialog isDialogOpen={true} selectedId={1} handleCloseDialog={handleCloseDialog} year={year} /> */}
		</div>
	);
}

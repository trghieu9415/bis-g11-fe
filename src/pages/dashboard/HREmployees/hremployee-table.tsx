import CustomTable from '@/components/custom-table';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Ban, CircleCheckBig, Ellipsis, UserRoundPen } from 'lucide-react';
import { useState } from 'react';
import CustomDialog from '@/components/custom-dialog';

import data from '@/pages/dashboard/HREmployees/data.json';

type Employee = {
	id: string;
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
};

type FieldConfig = {
	label: string;
	key: keyof Employee;
	type: 'input' | 'select' | 'number' | 'date';
	options?: { value: string; label: string; isBoolean?: boolean }[];
	disabled?: boolean;
};

export default function EmployeeTable() {
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');

	const columns: ColumnDef<Employee>[] = [
		{
			accessorKey: 'id',
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
			accessorKey: 'full_name',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-40'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Tên <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => (
				<span className='flex items-center'>
					<Button variant='ghost' className='text-black p-1 h-5 mr-2'>
						<UserRoundPen />
					</Button>
					{row.getValue('full_name')}
				</span>
			),
			enableHiding: false
		},
		{
			accessorKey: 'role',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-40'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Vai trò <ArrowUpDown />
				</Button>
			)
		},
		{
			accessorKey: 'status',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-20'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Trạng thái <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => (
				<span className='flex justify-center'>
					{row.getValue('status') ? (
						<CircleCheckBig color='#31843f' strokeWidth={3} />
					) : (
						<Ban color='#ef5350' strokeWidth={3} />
					)}
				</span>
			),
			sortingFn: (rowA, rowB) => {
				const statusA = rowA.original.status ? 1 : 0;
				const statusB = rowB.original.status ? 1 : 0;
				return statusA - statusB;
			},
			enableHiding: false
		},
		{
			accessorKey: 'base_salary',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Lương cơ bản <ArrowUpDown />
				</Button>
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
					Kinh nghiệm <ArrowUpDown />
				</Button>
			)
		},
		{
			accessorKey: 'salary_coefficient',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Hệ số lương <ArrowUpDown />
				</Button>
			)
		},
		{
			accessorKey: 'gender',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Giới tính <ArrowUpDown />
				</Button>
			)
		},
		{
			accessorKey: 'email',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-52'
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
					className='text-white w-72'
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
							<Ellipsis className='w-4 h-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'view')}>Xem</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'edit')}>Sửa</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'delete')}>Xóa</DropdownMenuItem>
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
		date_of_birth: false,
		gender: false,
		address: false,
		base_salary: false,
		salary_coefficient: false
	};

	const employeeFields: FieldConfig[] = [
		{ label: 'Họ và tên', key: 'full_name', type: 'input' },
		{
			label: 'Giới tính',
			key: 'gender',
			type: 'select',
			options: [
				{ value: 'false', label: 'Nữ', isBoolean: true },
				{ value: 'true', label: 'Nam', isBoolean: true }
			]
		},
		{ label: 'ID', key: 'id', type: 'input', disabled: true },
		{ label: 'Vai trò', key: 'role', type: 'input', disabled: true },
		{
			label: 'Trạng thái',
			key: 'status',
			type: 'select',
			options: [
				{ value: 'true', label: 'Hoạt động', isBoolean: true },
				{ value: 'false', label: 'Không Hoạt động', isBoolean: true }
			]
		},
		{ label: 'Cấp bậc', key: 'level', type: 'input', disabled: true },
		{ label: 'Lương cơ bản', key: 'base_salary', type: 'number', disabled: true },
		{ label: 'Hệ số lương', key: 'salary_coefficient', type: 'number', disabled: true },
		{ label: 'Ngày sinh', key: 'date_of_birth', type: 'date' },
		{ label: 'Địa chỉ', key: 'address', type: 'input' },
		{ label: 'Email', key: 'email', type: 'input' },
		{ label: 'SĐT', key: 'phone', type: 'input' }
	];

	const handleSave = (data: Employee) => {
		console.log('Saving data:', data);
		setIsDialogOpen(false);
	};

	const handleDelete = (data: Employee) => {
		console.log('Deleting data:', data);
		setIsDialogOpen(false);
	};

	return (
		<div>
			<CustomTable columns={columns} data={data} hiddenColumns={hiddenColumns} />
			{selectedEmployee && (
				<CustomDialog
					entity={selectedEmployee}
					isOpen={isDialogOpen}
					onClose={handleCloseDialog}
					mode={dialogMode}
					fields={employeeFields}
					onSave={handleSave}
					onDelete={handleDelete}
				/>
			)}
		</div>
	);
}

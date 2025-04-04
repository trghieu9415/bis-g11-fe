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
import { useSelector } from 'react-redux';

import { fetchPayrollsByYear } from '@/redux/slices/payrollsByYearSlice';
import { RootState, useAppDispatch } from '@/redux/store';

type Payroll = {
	id: number;
	idString: string;
	standardWorkingDays: number;
	maternityBenefit: string;
	sickBenefit: string;
	netSalary: string;
	grossSalary: string;
	tax: string;
	employeeBHXH: string;
	employeeBHYT: string;
	employeeBHTN: string;
	penalties: string;
	allowance: string;
	totalIncome: string;
	attendanceId: number;
	monthOfYear: string;
	userIdStr: string;
	fullName: string;
	roleName: string;
	salaryCoefficient: number;
	totalWorkingDays: number;
	totalSickLeaves: number;
	totalPaidLeaves: number;
	totalMaternityLeaves: number;
	totalUnpaidLeaves: number;
	totalHolidayLeaves: number;
	baseSalary: string;
	totalBaseSalary: string;
	totalBenefit: string;
	mainSalary: string;
	deductions: string;
};

export default function PayrollsYearTable() {
	const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');

	const { payrollsByYear } = useSelector((state: RootState) => state.payrollsByYear);

	console.log(payrollsByYear);

	const columns: ColumnDef<Payroll>[] = [
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
			accessorKey: 'userIdStr',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-24'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					ID nhân viên <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex items-center'>{row.getValue('userIdStr')}</span>,
			enableHiding: false
		},
		{
			accessorKey: 'fullName',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-40'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Họ và tên <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex items-center'>{row.getValue('fullName')}</span>,
			enableHiding: false
		},
		{
			accessorKey: 'roleName',
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
			accessorKey: 'totalWorkingDays',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-26'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Ngày làm việc <ArrowUpDown />
				</Button>
			),
			cell: ({ getValue }) => <div style={{ textAlign: 'right' }}>{`${getValue()}`}</div>,
			enableHiding: false
		},
		{
			accessorKey: 'allowance',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Phụ cấp <ArrowUpDown />
				</Button>
			),
			cell: ({ getValue }) => <div style={{ textAlign: 'right' }}>{`${getValue()} VNĐ`}</div>
		},
		{
			accessorKey: 'deductions',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-26'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Khấu trừ BH <ArrowUpDown />
				</Button>
			),
			cell: ({ getValue }) => <div style={{ textAlign: 'right' }}>{`${getValue()} VNĐ`}</div>
		},
		{
			accessorKey: 'tax',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-24'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Thuế <ArrowUpDown />
				</Button>
			),
			cell: ({ getValue }) => <div style={{ textAlign: 'right' }}>{`${getValue()} VNĐ`}</div>
		},
		{
			accessorKey: 'baseSalary',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Lương cơ bản <ArrowUpDown />
				</Button>
			),
			cell: ({ getValue }) => <div style={{ textAlign: 'right' }}>{`${getValue()} VNĐ`}</div>
		},
		{
			accessorKey: 'grossSalary',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Lương Gross <ArrowUpDown />
				</Button>
			),
			cell: ({ getValue }) => <div style={{ textAlign: 'right' }}>{`${getValue()} VNĐ`}</div>
		},
		{
			accessorKey: 'netSalary',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Lương Net <ArrowUpDown />
				</Button>
			),
			cell: ({ getValue }) => {
				const value = getValue() as string;
				const numericValue = Math.floor(parseFloat(value));
				const formattedValue = numericValue.toLocaleString('en-US', {
					minimumFractionDigits: 0,
					maximumFractionDigits: 0
				});
				return <div style={{ textAlign: 'right' }}>{`${formattedValue} VNĐ`}</div>;
			}
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
						{/* <DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'edit')}>Sửa</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'delete')}>Xóa</DropdownMenuItem> */}
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	];

	const handleOpenDialog = (payroll: Payroll, mode: 'view' | 'edit' | 'delete') => {
		setSelectedPayroll(payroll);
		setDialogMode(mode);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setSelectedPayroll(null);
	};

	const hiddenColumns = {
		totalWorkingDays: false,
		roleName: false
	};

	return (
		<div>
			<CustomTable columns={columns} data={payrollsByYear} hiddenColumns={hiddenColumns} />
			{/* <PayrollsMonthDialog isOpen={isDialogOpen} selectedPayroll={selectedPayroll} onClose={handleCloseDialog} /> */}
		</div>
	);
}

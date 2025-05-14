import CustomTable from '@/components/custom-table';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useSelector } from 'react-redux';

import { fetchRoles } from '@/redux/slices/rolesSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Ellipsis, CheckCircle, CalendarCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import RolesDialog from './roles-dialog';

interface ResSeniority {
	id: number;
	idString: string;
	levelName: string;
	description: string;
	salaryCoefficient: number;
	status: number;
	roleId: number;
}

type Role = {
	id: number;
	idString: string;
	name: string;
	description: string;
	allowanceId: number;
	status: number;
	resSeniority: ResSeniority[];
};

export default function RolesTable() {
	const [selectedRole, setSelectedRole] = useState<Role | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');

	const dispatch = useAppDispatch();
	const { roles } = useSelector((state: RootState) => state.roles);
	const { allowances } = useSelector((state: RootState) => state.allowances);

	useEffect(() => {
		dispatch(fetchRoles());
	}, [dispatch]);

	useEffect(() => {
		if (selectedRole?.id) {
			const newRole = roles.filter(item => item.id === selectedRole.id);
			setSelectedRole(newRole?.[0] || null);
		}
	}, [roles]);

	const columns: ColumnDef<Role>[] = [
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
					Tên vai trò <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex items-center'>{row.getValue('name')}</span>,
			enableHiding: false
		},
		{
			accessorKey: 'status',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-30'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Trạng thái <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => {
				const status = row.getValue('status');
				return status === 1 ? (
					<p className='text-white flex items-center gap-1 justify-center w-[100%] bg-green-500 rounded-sm p-1'>
						<CheckCircle className='w-4 h-4 mr-1' stroke='white' />
						Hoạt động
					</p>
				) : (
					<p className='text-white flex items-center gap-1 justify-center w-[100%] bg-yellow-500 rounded-sm p-1'>
						<CalendarCheck className='w-4 h-4 mr-1' stroke='white' /> Chưa kích hoạt
					</p>
				);
			},
			enableHiding: false
		},
		{
			accessorKey: 'description',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-60'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Mô tả <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex items-center'>{row.getValue('description')}</span>,
			enableHiding: true
		},
		{
			accessorKey: 'allowanceId',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-22'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Phụ cấp <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => {
				const allowance = allowances.find(a => a.id === row.getValue('allowanceId'));
				if (allowance?.allowance != null) {
					return <span className='flex items-center justify-end'>{allowance.allowance.toLocaleString()} VNĐ</span>;
				} else {
					return <span className='flex items-center justify-center'>--</span>;
				}
			},
			enableHiding: false
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
						{row.getValue('status') !== 1 && (
							<DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'delete')}>Xóa</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	];

	const handleOpenDialog = (role: Role, mode: 'view' | 'edit' | 'delete') => {
		setSelectedRole(role);
		setDialogMode(mode);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setSelectedRole(null);
	};

	return (
		<div>
			<CustomTable columns={columns} data={roles} stickyClassIndex={0} />
			{selectedRole && (
				<RolesDialog isOpen={isDialogOpen} selectedRole={selectedRole} onClose={handleCloseDialog} mode={dialogMode} />
			)}
		</div>
	);
}

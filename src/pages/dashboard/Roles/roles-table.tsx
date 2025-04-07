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
import { fetchAllAllowances } from '@/redux/slices/allowancesSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Ellipsis } from 'lucide-react';
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
	allowanceId: string;
	resSeniority: ResSeniority[];
};

export default function RolesTable() {
	const [selectedRole, setSelectedRole] = useState<Role | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');

	const dispatch = useAppDispatch();
	const { roles } = useSelector((state: RootState) => state.roles);
	const { allowances } = useSelector((state: RootState) => state.allowances);

	console.log(allowances);
	console.log(roles);

	useEffect(() => {
		dispatch(fetchRoles());
		dispatch(fetchAllAllowances());
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
			enableHiding: false
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
				const allowance = allowances.find(a => a.allowanceId === row.getValue('allowanceId'));
				console.log(allowance);
				return <span className='flex items-center justify-end'>{allowance}</span>;
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
						<DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'delete')}>Xóa</DropdownMenuItem>
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

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
import { fetchRoles } from '@/redux/slices/rolesSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { RegisterOptions } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowUpDown, Ellipsis } from 'lucide-react';

import RolesDialog from './roles-dialog';

interface ResSeniority {
	id: number;
	levelName: string;
	description: string;
	salaryCoefficient: number;
	status: number;
	roleId: number;
}

type Role = {
	id: number;
	name: string;
	description: string;
	resSeniority: ResSeniority[];
};

type FieldConfig = {
	label: string;
	key: keyof Role;
	type: 'input' | 'select' | 'number' | 'date' | 'time';
	options?: { value: string; label: string; isBoolean?: boolean }[];
	disabled?: boolean;
	validation?: RegisterOptions;
	showOnly?: 'view' | 'edit' | 'delete';
	isShow?: boolean;
};

export default function RolesTable() {
	const [selectedRole, setSelectedRole] = useState<Role | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');

	const dispatch = useAppDispatch();
	const { roles } = useSelector((state: RootState) => state.roles);

	console.log(roles)

	useEffect(() => {
		dispatch(fetchRoles());
	}, [dispatch]);

	const columns: ColumnDef<Role>[] = [
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

	console.log(selectedRole);

	return (
		<div>
			<CustomTable columns={columns} data={roles} stickyClassIndex={0} />
			{/* {selectedRole && (
				<CustomDialog
					entity={selectedRole}
					isOpen={isDialogOpen}
					onClose={handleCloseDialog}
					mode={dialogMode}
					fields={roleFields}
					// onSave={handleSave}
					// onDelete={handleDelete}
				/>
			)} */}
			<RolesDialog isOpen={isDialogOpen} selectedRole={selectedRole} onClose={handleCloseDialog} mode={dialogMode} />
		</div>
	);
}

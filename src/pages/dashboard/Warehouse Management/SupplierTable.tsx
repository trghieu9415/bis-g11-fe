import data from '@/pages/dashboard/Warehouse Management/SupplierData.json';
import CustomTable from '@/components/custom-table';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Ban, CircleCheckBig, Ellipsis, BookText } from 'lucide-react';
import { useState } from 'react';
import CustomDialog from '@/components/custom-dialog';

type FieldConfig = {
	label: string;
	key: keyof Supplier;
	type: 'input' | 'select' | 'number' | 'date';
	options?: { value: string; label: string; isBoolean?: boolean }[];
	disabled?: boolean;
};
type Supplier = {
	id: number;
	name: string;
	phone: string;
	email: string;
	address: string;
	status: boolean;
	percentage: number;
};

const SupplierTable = () => {
	const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');
	const columns: ColumnDef<Supplier>[] = [
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
					Tên <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => (
				<span className='flex items-center'>
					<Button variant='ghost' className='text-black p-1 h-5 mr-2'>
						<BookText />
					</Button>
					{row.getValue('name')}
				</span>
			),
			enableHiding: false
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
			accessorKey: 'phone',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					SĐT <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex justify-center'>{row.getValue('phone')}</span>
		},
		{
			accessorKey: 'email',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Giá <ArrowUpDown />
				</Button>
			)
		},
		{
			accessorKey: 'percentage',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Giá <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex justify-center'>{row.getValue('percentage')}%</span>
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

	const handleOpenDialog = (supplier: Supplier, mode: 'view' | 'edit' | 'delete') => {
		setSelectedSupplier(supplier);
		setDialogMode(mode);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setSelectedSupplier(null);
	};
	const productFields: FieldConfig[][][] = [
		[
			[
				{ label: 'ID', key: 'id', type: 'input', disabled: true },
				{ label: 'Tên nhà cung cấp', key: 'name', type: 'input' }
			]
		],
		[
			[
				{
					label: 'Trạng thái',
					key: 'status',
					type: 'select',
					options: [
						{ value: 'true', label: 'Hoạt động', isBoolean: true },
						{ value: 'false', label: 'Không Hoạt động', isBoolean: true }
					]
				}
			]
		],
		[[{ label: 'SĐT', key: 'phone', type: 'input' }], [{ label: 'Email', key: 'email', type: 'input' }]],
		[
			[
				{
					label: 'Chiết khấu',
					key: 'percentage',
					type: 'input'
				}
			]
		]
	];

	const handleSave = (data: Supplier) => {
		console.log('Saving data:', data);
		setIsDialogOpen(false);
	};

	const handleDelete = (data: Supplier) => {
		console.log('Deleting data:', data);
		setIsDialogOpen(false);
	};

	return (
		<div>
			<CustomTable columns={columns} data={data} />
			{selectedSupplier && (
				<CustomDialog
					entity={selectedSupplier}
					isOpen={isDialogOpen}
					onClose={handleCloseDialog}
					mode={dialogMode}
					fields={productFields}
					onSave={handleSave}
					onDelete={handleDelete}
				/>
			)}
		</div>
	);
};

export default SupplierTable;

import data from '@/pages/dashboard/Warehouse Management/data.json';
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
	key: keyof Product;
	type: 'input' | 'select' | 'number' | 'date';
	options?: { value: string; label: string; isBoolean?: boolean }[];
	disabled?: boolean;
};
type Product = {
	id: number;
	name: string;
	status: boolean;
	quantity: number;
	price: string;
};

const ProductsTable = () => {
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');
	const columns: ColumnDef<Product>[] = [
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
			accessorKey: 'quantity',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Số Lượng <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex justify-center'>{row.getValue('quantity')}</span>
		},
		{
			accessorKey: 'price',
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

	const handleOpenDialog = (product: Product, mode: 'view' | 'edit' | 'delete') => {
		setSelectedProduct(product);
		setDialogMode(mode);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setSelectedProduct(null);
	};
	const productFields: FieldConfig[][][] = [
		[
			[
				{ label: 'ID', key: 'id', type: 'input', disabled: true },
				{ label: 'Tên sản phẩm', key: 'name', type: 'input' }
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
		[
			[{ label: 'Số lượng', key: 'quantity', type: 'number', disabled: true }],
			[{ label: 'Giá', key: 'price', type: 'input' }]
		]
	];

	const handleSave = (data: Product) => {
		console.log('Saving data:', data);
		setIsDialogOpen(false);
	};

	const handleDelete = (data: Product) => {
		console.log('Deleting data:', data);
		setIsDialogOpen(false);
	};

	return (
		<div>
			<CustomTable columns={columns} data={data} />
			{selectedProduct && (
				<CustomDialog
					entity={selectedProduct}
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

export default ProductsTable;

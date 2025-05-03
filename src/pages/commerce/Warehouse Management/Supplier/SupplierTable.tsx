// import data from '@/pages/dashboard/Warehouse Management/SupplierData.json';
import CustomTable from '@/components/custom-table';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Ellipsis, BookText, CheckCircle, CalendarCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import CustomDialog from '@/components/custom-dialog';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { fetchSuppliers } from '@/redux/slices/supplierSlice';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { deleteSupllier, updateSupplier } from '@/services/supplierService';

type FieldConfig = {
	label: string;
	key: keyof Supplier;
	type: 'input' | 'select' | 'number' | 'date';
	options?: { value: string; label: string; isBoolean?: boolean }[];
	disabled?: boolean;
};
export type Supplier = {
	id: number;
	name: string;
	phone: string;
	email: string;
	address: string;
	status: boolean;
	percentage: number;
};

const SupplierTable = () => {
	const { suppliers } = useSelector((state: RootState) => state.supplier);
	console.log(suppliers);

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(fetchSuppliers());
	}, []);

	const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');
	const columns: ColumnDef<Supplier>[] = [
		{
			accessorKey: 'id',
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
			accessorKey: 'name',
			header: ({ column }) => (
				<Button
					variant='link'
					className='w-40 text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Tên <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => (
				<span className='flex items-center'>
					<Button variant='ghost' className='mr-2 h-5 p-1 text-black'>
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
					className='w-20 text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Trạng thái <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => (
				<span className='flex justify-center'>
					{row.getValue('status') ? (
						<p className='flex w-[100%] items-center justify-center gap-1 rounded-sm bg-green-500 p-1 text-white'>
							<CheckCircle className='mr-1 h-4 w-4' stroke='white' />
							Đang hoạt động
						</p>
					) : (
						<p className='flex w-[84%] items-center justify-center gap-1 rounded-sm bg-yellow-500 p-1 text-white'>
							<CalendarCheck className='mr-1 h-4 w-4' stroke='white' /> Ngừng hoạt động
						</p>
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
			accessorKey: 'address',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Địa chỉ <ArrowUpDown />
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
							<Ellipsis className='h-4 w-4' />
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
				{ label: 'SĐT', key: 'phone', type: 'input' },
				{ label: 'Email', key: 'email', type: 'input' }
			]
		],
		[
			[
				{
					label: 'Chiết khấu',
					key: 'percentage',
					type: 'input'
				},
				{
					label: 'Địa chỉ',
					key: 'address',
					type: 'input'
				}
			]
		]
	];

	const handleSave = async (data: Supplier) => {
		const supplierId = data.id;

		const updatedData = {
			name: data.name,
			phoneNumber: data.phone,
			email: data.email,
			address: data.address,
			status: 1,
			percentage: Number(data.percentage)
		};

		try {
			await updateSupplier(supplierId, updatedData);
			toast.success('Cập nhật thông tin nhà cung cấp thành công!');
			dispatch(fetchSuppliers());
			setIsDialogOpen(false);
		} catch (error: unknown) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error('Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy nhân viên.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
		setIsDialogOpen(false);
	};

	const handleDelete = async (data: Supplier) => {
		const supplierId = data.id;

		try {
			await deleteSupllier(supplierId);
			toast.success('Xóa nhà cung cấp thành công!');
			dispatch(fetchSuppliers());
			setIsDialogOpen(false);
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error('Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy nhân viên.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	return (
		<div>
			<CustomTable columns={columns} data={suppliers} />
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

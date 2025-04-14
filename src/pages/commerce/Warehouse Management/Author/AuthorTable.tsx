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
import { ArrowUpDown, Ellipsis, BookText, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import CustomDialog from '@/components/custom-dialog';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { fetchSuppliers } from '@/redux/slices/supplierSlice';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { deleteSupllier, updateSupplier } from '@/services/supplierService';
import { Author, fetchAuthor } from '@/redux/slices/authorSlice';
import { format } from 'date-fns';
import { updateAuthor } from '@/services/authorService';
type FieldConfig = {
	label: string;
	key: keyof Author;
	type: 'input' | 'select' | 'number' | 'date';
	options?: { value: string; label: string; isBoolean?: boolean }[];
	disabled?: boolean;
};

const AuthorTable = () => {
	const { authors } = useSelector((state: RootState) => state.author);

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(fetchAuthor());
	}, []);

	const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');

	// Format date
	const formatDate = (dateString: string) => {
		try {
			return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
		} catch (error) {
			return dateString;
		}
	};
	const columns: ColumnDef<Author>[] = [
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
			accessorKey: 'createdAt',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-primary'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Ngày tạo <ArrowUpDown className='ml-1 h-4 w-4' />
				</Button>
			),
			cell: ({ row }) => (
				<div className='flex items-center'>
					<Calendar className='mr-2 h-4 w-4' />
					{formatDate(row.original.createdAt)}
				</div>
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
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	];

	const handleOpenDialog = (author: Author, mode: 'view' | 'edit' | 'delete') => {
		setSelectedAuthor(author);
		setDialogMode(mode);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setSelectedAuthor(null);
	};
	const productFields: FieldConfig[][][] = [
		[[{ label: 'ID', key: 'id', type: 'input', disabled: true }]],
		[[{ label: 'Tên tác giả', key: 'name', type: 'input' }]]
	];

	const handleSave = async (data: Author) => {
		const authorId = data.id;

		const updatedData = {
			name: data.name
		};

		try {
			await updateAuthor(authorId, updatedData);
			toast.success('Cập nhật thông tin tác giả thành công!');
			dispatch(fetchAuthor());
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
	return (
		<div>
			<CustomTable columns={columns} data={authors} />
			{selectedAuthor && (
				<CustomDialog
					entity={selectedAuthor}
					isOpen={isDialogOpen}
					onClose={handleCloseDialog}
					mode={dialogMode}
					fields={productFields}
					onSave={handleSave}
				/>
			)}
		</div>
	);
};

export default AuthorTable;

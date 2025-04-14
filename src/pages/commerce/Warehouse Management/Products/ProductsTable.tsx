// import data from '@/pages/dashboard/Warehouse Management/data.json';
import CustomTable from '@/components/custom-table';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Ellipsis, CalendarCheck, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchProducts, Product } from '@/redux/slices/productSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import { deleteProduct, updateProduct } from '@/services/productService';
import CustomProductDialog from '@/components/custom-product-dialog';
import { AxiosError } from 'axios';
import ProductsStatus from './ProductStatus';

export type FieldProduct = {
	image: string;
	id: number;
	name: string;
	status: boolean;
	quantity: number;
	price: number;
	supplierName: string;
	categoryName: string;
	authorName: string;
};

type FieldConfig = {
	label: string;
	key: keyof FieldProduct;
	type: 'input' | 'select' | 'number' | 'image';
	options?: { value: string; label: string; isBoolean?: boolean }[];
	disabled?: boolean;
};

const ProductsTable = () => {
	const [selectedProduct, setSelectedProduct] = useState<FieldProduct | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');
	const [productImage, setProductImage] = useState<File | null>(null);
	const { products, isLoading, error } = useSelector((state: RootState) => state.products);

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(fetchProducts());
	}, []);

	const columns: ColumnDef<Product>[] = [
		{
			accessorKey: 'image',
			header: ({}) => (
				<Button
					variant='link'
					className='text-white w-16'
					// onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Hình ảnh
				</Button>
			),
			cell: ({ row }) => (
				<span className='flex items-center justify-center'>
					<img src={row.getValue('image')} className='min-w-[90px] h-[120px] object-fill overflow-auto rounded' />
				</span>
			),
			enableHiding: false
		},

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
			cell: ({ row }) => <span className='flex justify-center'>{row.getValue('id')}</span>,
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
			cell: ({ row }) => <span className='flex items-center flex-wrap'>{row.getValue('name')}</span>,
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
			cell: ({ row }) => (
				<span className='flex justify-center'>
					{row.getValue('status') ? (
						<p className='text-white flex items-center gap-1 justify-center w-[100%] bg-green-500 rounded-sm p-1'>
							<CheckCircle className='w-4 h-4 mr-1' stroke='white' />
							Đang kinh doanh
						</p>
					) : (
						<p className='text-white flex items-center gap-1 justify-center w-[84%] bg-yellow-500 rounded-sm p-1'>
							<CalendarCheck className='w-4 h-4 mr-1' stroke='white' /> Ngừng kinh doanh
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
			),
			cell: ({ row }) => {
				const price = Number(row.getValue('price'));
				const formattedPrice = new Intl.NumberFormat('vi-VN', {
					style: 'currency',
					currency: 'VND'
				}).format(price);

				return <span className='flex items-center justify-end text-right text-base'>{formattedPrice}</span>;
			}
		},
		{
			accessorKey: 'supplier',
			header: ({}) => (
				<Button
					variant='link'
					className='text-white w-16'
					// onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Nhà xuất bản
				</Button>
			),
			cell: ({ row }) => {
				const supplier = row.getValue('supplier') as { id: number; name: string };
				return <span className='flex items-center'>{supplier.name}</span>;
			},
			enableHiding: true
		},
		{
			accessorKey: 'author',
			header: ({}) => (
				<Button
					variant='link'
					className='text-white w-16'
					// onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Tác giả
				</Button>
			),
			cell: ({ row }) => {
				const author = row.getValue('author') as { id: number; name: string };
				return <span className='flex items-center'>{author.name}</span>;
			},
			enableHiding: true
		},
		{
			accessorKey: 'category',
			header: ({}) => (
				<Button
					variant='link'
					className='text-white w-16'
					// onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Thể loại
				</Button>
			),
			cell: ({ row }) => {
				const category = row.getValue('category') as { id: number; name: string };
				return <span className='flex items-center'>{category.name}</span>;
			},
			enableHiding: true
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
						<DropdownMenuItem
							onClick={() => {
								const entity: FieldProduct = {
									id: row.original.id,
									name: row.original.name,
									image: row.original.image,
									status: row.original.status,
									quantity: row.original.quantity,
									price: row.original.price,
									supplierName: row.original.supplier.name,
									categoryName: row.original.category.name,
									authorName: row.original.author.name
								};
								handleOpenDialog(entity, 'view');
							}}
						>
							Xem
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								const entity: FieldProduct = {
									id: row.original.id,
									name: row.original.name,
									image: row.original.image,
									status: row.original.status,
									quantity: row.original.quantity,
									price: row.original.price,
									supplierName: row.original.supplier.name,
									categoryName: row.original.category.name,
									authorName: row.original.author.name
								};
								handleOpenDialog(entity, 'edit');
							}}
						>
							Sửa
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								const entity: FieldProduct = {
									id: row.original.id,
									name: row.original.name,
									image: row.original.image,
									status: row.original.status,
									quantity: row.original.quantity,
									price: row.original.price,
									supplierName: row.original.supplier.name,
									categoryName: row.original.category.name,
									authorName: row.original.author.name
								};
								handleOpenDialog(entity, 'delete');
							}}
						>
							Xóa
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	];

	const handleOpenDialog = (product: FieldProduct, mode: 'view' | 'edit' | 'delete') => {
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
			[{ label: 'Hình ảnh', key: 'image', type: 'image' }],
			[
				{ label: 'ID', key: 'id', type: 'input', disabled: true },
				{ label: 'Số lượng', key: 'quantity', type: 'number', disabled: true }
			]
		],
		[[{ label: 'Tên sản phẩm', key: 'name', type: 'input' }]],
		[
			[
				{ label: 'Nhà cung cấp', key: 'supplierName', type: 'input', disabled: true },
				{ label: 'Giá', key: 'price', type: 'input', disabled: true }
			]
		],
		[
			[
				{ label: 'Tác giả', key: 'authorName', type: 'input', disabled: true },
				{ label: 'Thể loại', key: 'categoryName', type: 'input', disabled: true }
			]
		]
	];

	// const handleSave = async (data: FieldProduct) => {
	// 	const product = products.find(p => p.id === data.id);
	// 	console.log(data);
	// 	const formData = new FormData();
	// 	formData.append(
	// 		'product',
	// 		JSON.stringify({
	// 			name: data.name,
	// 			price: data.price,
	// 			quantity: data.quantity,
	// 			supplierId: product?.supplier.id,
	// 			authorId: product?.author.id,
	// 			categoryId: product?.category.id
	// 		})
	// 	);
	// 	if (data.image) {
	// 		formData.append('file', data.image);
	// 	}
	// 	try {
	// 		await updateProduct(data.id, formData);
	// 		toast.success('Cập nhật thông tin sản phẩm thành công!');
	// 		dispatch(fetchProducts());
	// 		setIsDialogOpen(false);
	// 	} catch (error: unknown) {
	// 		const err = error as AxiosError;

	// 		if (err.response?.status === 400) {
	// 			toast.error('Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
	// 		} else if (err.response?.status === 404) {
	// 			toast.error('Lỗi 404: Không tìm thấy nhân viên.');
	// 		} else if (err.response?.status === 500) {
	// 			toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
	// 		} else {
	// 			toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
	// 		}
	// 	}
	// 	console.log('Saving data:', data);
	// 	setIsDialogOpen(false);
	// };

	const handleSave = async (data: FieldProduct) => {
		const product = products.find(p => p.id === data.id);
		const status = data.status === true ? 1 : 0;
		const formData = new FormData();
		formData.append(
			'product',
			JSON.stringify({
				name: data.name,
				price: data.price,
				quantity: data.quantity,
				status: status,
				supplierId: product?.supplier.id,
				authorId: product?.author.id,
				categoryId: product?.category.id
			})
		);
		// Use the stored image file if available
		if (productImage) {
			formData.append('file', productImage);
		}

		try {
			await updateProduct(data.id, formData);
			setIsDialogOpen(false);
			toast.success('Cập nhật thông tin sản phẩm thành công!');
			dispatch(fetchProducts());
			// Reset the product image after successful update
			setProductImage(null);
		} catch (error: unknown) {
			// Error handling remains the same
		}
	};

	const handleDelete = async (data: FieldProduct) => {
		console.log('Deleting data:', data);
		const productId = data.id;

		try {
			await deleteProduct(productId);
			toast.success('Xóa sản phẩm thành công!');
			dispatch(fetchProducts());
			setIsDialogOpen(false);
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error('Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy sản phẩm.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	return (
		<div>
			{isLoading || error ? (
				<ProductsStatus isLoading={isLoading} error={error} />
			) : (
				<CustomTable columns={columns} data={products} stickyClassIndex={0} />
			)}
			{selectedProduct && (
				<CustomProductDialog
					entity={selectedProduct}
					isOpen={isDialogOpen}
					onClose={handleCloseDialog}
					mode={dialogMode}
					fields={productFields}
					onSave={handleSave}
					onDelete={handleDelete}
					setProductImage={setProductImage}
				/>
			)}
		</div>
	);
};

export default ProductsTable;

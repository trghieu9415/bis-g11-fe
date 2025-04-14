import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchGoodreceipt } from '@/redux/slices/goodReceiptsSlice';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import CustomTable from '@/components/custom-table';
import { ArrowUpDown, Eye, Calendar, User, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { getUser } from '@/services/userService';
import { getProduct } from '@/services/productService';

// Định nghĩa kiểu dữ liệu
interface GoodReceiptDetail {
	productId: number;
	productName?: string;
	quantity: number;
	inputPrice: number;
}

interface GoodReceipt {
	id: number;
	userId: number;
	userName?: string;
	totalPrice: number;
	createdAt: string;
	updatedAt: string;
	goodReceiptDetails: GoodReceiptDetail[];
}

const InventoryTable = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { goodReceipts } = useSelector((state: RootState) => state.goodsReceipt);
	const [selectedReceipt, setSelectedReceipt] = useState<GoodReceipt | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [formattedReceipts, setFormattedReceipts] = useState<GoodReceipt[]>([]);

	useEffect(() => {
		dispatch(fetchGoodreceipt());
	}, [dispatch]);

	useEffect(() => {
		if (goodReceipts && goodReceipts.length > 0) {
			formatData();
		}
	}, [goodReceipts]);

	// Hàm này lấy thông tin người dùng và sản phẩm và thêm vào dữ liệu phiếu nhập
	const formatData = async () => {
		try {
			const formattedData = await Promise.all(
				goodReceipts.map(async receipt => {
					// Lấy thông tin người dùng
					const user = await getUser(receipt.userId);

					// Lấy thông tin sản phẩm và thêm vào chi tiết phiếu nhập
					const formattedDetails = await Promise.all(
						receipt.goodReceiptDetails.map(async detail => {
							const product = await getProduct(detail.productId);
							return {
								...detail,
								productName: product ? product.name : 'Không xác định'
							};
						})
					);

					return {
						...receipt,
						userName: user ? user.fullName : 'Không xác định',
						goodReceiptDetails: formattedDetails
					};
				})
			);

			setFormattedReceipts(formattedData);
		} catch (error) {
			console.error('Lỗi khi format dữ liệu:', error);
			// Sử dụng dữ liệu gốc nếu có lỗi
			setFormattedReceipts(goodReceipts);
		}
	};

	// Format currency
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
	};

	// Format date
	const formatDate = (dateString: string) => {
		try {
			return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
		} catch (error) {
			return dateString;
		}
	};

	const handleViewDetails = (receipt: GoodReceipt) => {
		setSelectedReceipt(receipt);
		setIsDialogOpen(true);
	};

	const columns: ColumnDef<GoodReceipt>[] = [
		{
			accessorKey: 'id',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-primary w-16'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					ID <ArrowUpDown className='ml-1 h-4 w-4' />
				</Button>
			),
			cell: ({ row }) => <div className='font-medium'>{row.original.id}</div>
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
			accessorKey: 'userName',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-primary'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Người nhập <ArrowUpDown className='ml-1 h-4 w-4' />
				</Button>
			),
			cell: ({ row }) => (
				<div className='flex items-center'>
					<User className='mr-2 h-4 w-4' />
					{row.original.userName || `ID: ${row.original.userId}`}
				</div>
			)
		},
		{
			accessorKey: 'totalPrice',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-primary'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Tổng tiền <ArrowUpDown className='ml-1 h-4 w-4' />
				</Button>
			),
			cell: ({ row }) => (
				<div className='flex items-center'>
					<DollarSign className='mr-2 h-4 w-4' />
					{formatCurrency(row.original.totalPrice)}
				</div>
			)
		},
		{
			accessorKey: 'itemCount',
			header: 'Số mặt hàng',
			cell: ({ row }) => <div className='text-center font-medium'>{row.original.goodReceiptDetails.length}</div>
		},
		{
			id: 'actions',
			header: 'Hành động',
			cell: ({ row }) => (
				<Button variant='ghost' size='sm' className='flex items-center' onClick={() => handleViewDetails(row.original)}>
					<Eye className='mr-2 h-4 w-4' />
					Xem chi tiết
				</Button>
			)
		}
	];

	return (
		<div className='container mx-auto py-4'>
			<CustomTable columns={columns} data={formattedReceipts.length > 0 ? formattedReceipts : goodReceipts || []} />

			{/* Dialog hiển thị chi tiết */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className='max-w-3xl'>
					<DialogHeader>
						<DialogTitle>Chi tiết phiếu nhập #{selectedReceipt?.id}</DialogTitle>
					</DialogHeader>

					<div className='grid grid-cols-2 gap-4 mb-4'>
						<div>
							<p className='text-sm text-muted-foreground'>Ngày tạo:</p>
							<p className='font-medium'>{selectedReceipt && formatDate(selectedReceipt.createdAt)}</p>
						</div>
						<div>
							<p className='text-sm text-muted-foreground'>Người nhập:</p>
							<p className='font-medium'>{selectedReceipt?.userName || `ID: ${selectedReceipt?.userId}`}</p>
						</div>
						<div>
							<p className='text-sm text-muted-foreground'>Tổng tiền:</p>
							<p className='font-medium'>{selectedReceipt && formatCurrency(selectedReceipt.totalPrice)}</p>
						</div>
						<div>
							<p className='text-sm text-muted-foreground'>Cập nhật lần cuối:</p>
							<p className='font-medium'>{selectedReceipt && formatDate(selectedReceipt.updatedAt)}</p>
						</div>
					</div>

					<div className='border rounded-md overflow-hidden'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										STT
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Mã SP
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Tên SP
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Số lượng
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Giá nhập
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Thành tiền
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{selectedReceipt?.goodReceiptDetails.map((detail, index) => (
									<tr key={index}>
										<td className='px-6 py-4 whitespace-nowrap text-sm'>{index + 1}</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm'>{detail.productId}</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm'>{detail.productName || '—'}</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm'>{detail.quantity}</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm'>{formatCurrency(detail.inputPrice)}</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
											{formatCurrency(detail.quantity * detail.inputPrice)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className='flex justify-end mt-4'>
						<DialogClose asChild>
							<Button variant='outline'>Đóng</Button>
						</DialogClose>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default InventoryTable;

import { Plus, Trash, PackagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGoodreceipt } from '@/redux/slices/goodReceiptsSlice';
import { AxiosError } from 'axios';
import { AppDispatch, RootState } from '@/redux/store';
import { useState, useEffect } from 'react';
// import { createGoodReceipt } from '@/services/goodReceiptService';
import { fetchProducts } from '@/redux/slices/productSlice';
import { addGoodsReceipt } from '@/services/goodReceiptService';

// Định nghĩa kiểu dữ liệu
interface Product {
	id: number;
	name: string;
	price: number;
}

type FormField = {
	items: {
		productId: string;
		quantity: string;
		inputPrice: string; // Chỉ dùng để hiển thị, không gửi lên API
	}[];
};

export default function CreateGoodReceipt() {
	const [isOpen, setIsOpen] = useState(false);
	const { products } = useSelector((state: RootState) => state.products);
	const dispatch = useDispatch<AppDispatch>();

	// Fix cứng thông tin user
	const currentUser = {
		userId: 2,
		fullName: 'Clone'
	};

	const {
		register,
		control,
		reset,
		formState: { errors },
		handleSubmit,
		setValue,
		watch
	} = useForm<FormField>({
		defaultValues: {
			items: [{ productId: '', quantity: '1', inputPrice: '0' }]
		}
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'items'
	});

	// Tính tổng tiền (chỉ để hiển thị)
	const watchItems = watch('items');
	const calculateTotal = () => {
		return watchItems.reduce((total, item) => {
			const quantity = Number(item.quantity) || 0;
			const price = Number(item.inputPrice) || 0;
			return total + quantity * price;
		}, 0);
	};

	// Format tiền tệ
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
	};

	// Lấy danh sách sản phẩm
	useEffect(() => {
		dispatch(fetchProducts());
	}, [dispatch]);

	const openDialog = () => {
		reset({
			items: [{ productId: '', quantity: '1', inputPrice: '0' }]
		});
		setIsOpen(true);
	};

	const closeDialog = () => setIsOpen(false);

	const onSubmit = async (data: FormField) => {
		// Kiểm tra xem có sản phẩm trùng lặp không
		const productIds = data.items.map(item => item.productId);
		const hasDuplicates = productIds.some((id, index) => productIds.indexOf(id) !== index && id !== '');

		if (hasDuplicates) {
			toast.error('Có sản phẩm bị trùng lặp trong phiếu nhập!');
			return;
		}

		// Format dữ liệu để gửi lên API
		const formattedData = {
			userId: currentUser.userId, // Sử dụng userId đã fix cứng
			goodReceiptDetails: data.items.map(item => ({
				productId: Number(item.productId),
				quantity: Number(item.quantity)
				// Không gửi inputPrice như yêu cầu API
			}))
		};
		console.log(formattedData);
		try {
			await addGoodsReceipt(formattedData);
			toast.success('Tạo phiếu nhập hàng thành công!');
			closeDialog();
			reset();
			dispatch(fetchGoodreceipt());
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error('Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy sản phẩm hoặc người dùng.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	const handleProductChange = (index: number, productId: string) => {
		const selectedProduct = products.find(p => p.id === Number(productId));
		if (selectedProduct) {
			setValue(`items.${index}.inputPrice`, String(selectedProduct.price));
		}
	};

	return (
		<div className='text-end mb-4'>
			<Button className='bg-slate-800 hover:bg-slate-900' onClick={openDialog}>
				<PackagePlus className='mr-2' />
				Tạo phiếu nhập
			</Button>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className='w-full max-w-4xl mx-auto p-6 space-y-4'>
					<DialogHeader>
						<DialogTitle>Tạo phiếu nhập hàng mới</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='space-y-4 py-4'>
							{/* Hiển thị thông tin người tạo phiếu (đã fix cứng) */}
							<div className='mb-4'>
								<Label className='font-bold mb-2 block'>Người tạo phiếu</Label>
								<div className='p-2 border rounded-md bg-slate-50'>
									{currentUser.fullName} (ID: {currentUser.userId})
								</div>
							</div>

							<div className='flex justify-end mb-2'>
								<Button
									type='button'
									variant='outline'
									onClick={() => append({ productId: '', quantity: '1', inputPrice: '0' })}
								>
									<Plus className='mr-1 h-4 w-4' /> Thêm sản phẩm
								</Button>
							</div>

							{/* Header của bảng */}
							<div className='grid grid-cols-12 gap-2 font-medium text-sm mb-2 px-2'>
								<div className='col-span-5'>Sản phẩm</div>
								<div className='col-span-2'>Số lượng</div>
								<div className='col-span-3'>Đơn giá (Tham khảo)</div>
								<div className='col-span-2'>Thao tác</div>
							</div>

							{/* Danh sách sản phẩm */}
							{fields.map((field, index) => (
								<div key={field.id} className='grid grid-cols-12 gap-2 items-center'>
									<div className='col-span-5'>
										<Select
											value={watchItems[index].productId}
											onValueChange={value => {
												setValue(`items.${index}.productId`, value, {
													shouldValidate: true // Thêm dòng này để trigger validation khi giá trị thay đổi
												});
												handleProductChange(index, value);
											}}
										>
											<SelectTrigger>
												<SelectValue placeholder='Chọn sản phẩm' />
											</SelectTrigger>
											<SelectContent>
												{products.map(product => (
													<SelectItem key={product.id} value={String(product.id)}>
														{product.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>{' '}
										<input
											type='hidden'
											{...register(`items.${index}.productId`, {
												required: 'Vui lòng chọn sản phẩm'
											})}
										/>
										{errors.items?.[index]?.productId && (
											<p className='text-red-500 text-xs mt-1'>{errors.items?.[index]?.productId?.message}</p>
										)}
									</div>

									<div className='col-span-2'>
										<Input
											type='number'
											min='1'
											{...register(`items.${index}.quantity`, {
												required: 'Cần nhập số lượng',
												min: { value: 1, message: 'Số lượng phải lớn hơn 0' }
											})}
										/>
										{errors.items?.[index]?.quantity && (
											<p className='text-red-500 text-xs mt-1'>{errors.items?.[index]?.quantity?.message}</p>
										)}
									</div>

									<div className='col-span-3'>
										<Input type='number' disabled {...register(`items.${index}.inputPrice`)} />
										<p className='text-xs text-muted-foreground mt-1'>Chỉ hiển thị, không gửi lên</p>
									</div>

									<div className='col-span-2 flex justify-center'>
										<Button
											type='button'
											variant='destructive'
											onClick={() => remove(index)}
											disabled={fields.length === 1}
											className='p-2 h-8 w-8'
										>
											<Trash className='h-4 w-4' />
										</Button>
									</div>
								</div>
							))}

							{/* Tổng tiền */}
							<div className='flex justify-end mt-6 pt-4 border-t'>
								<div className='text-lg font-medium'>Tổng tiền (Tham khảo): {formatCurrency(calculateTotal())}</div>
							</div>
						</div>

						<DialogFooter className='gap-2 pt-2'>
							<DialogClose asChild>
								<Button type='button' variant='secondary'>
									Hủy
								</Button>
							</DialogClose>
							<Button type='submit'>Lưu phiếu nhập</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}

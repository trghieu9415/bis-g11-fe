import { Plus, Image, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogClose,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { fetchSuppliers } from '@/redux/slices/supplierSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { fetchAuthor } from '@/redux/slices/authorSlice';
import { fetchCategory } from '@/redux/slices/categorySlice';
import { fetchProducts } from '@/redux/slices/productSlice';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { addProduct } from '@/services/productService';

type FormField = {
	image: File | null;
	name: string;
	price: number;
	supplierId: string;
	categoryId: string;
	authorId: string;
};

export default function CreateProducts({}) {
	const [productImage, setProductImage] = useState<string | null>(null);
	const suppliers = useSelector((state: RootState) => state.supplier.suppliers);
	const categories = useSelector((state: RootState) => state.category.categories);
	const authors = useSelector((state: RootState) => state.author.authors);
	const dispatch = useDispatch<AppDispatch>();
	const [isOpen, setIsOpen] = useState(false);
	const openDialog = () => {
		reset();
		setFormattedPrice('');
		setIsOpen(true);
		_handleRemoveImage();
	};

	useEffect(() => {
		dispatch(fetchSuppliers());
		dispatch(fetchAuthor());
		dispatch(fetchCategory());
	}, []);
	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
		reset,
		trigger
	} = useForm<FormField>();

	const fileInputRef = useRef<HTMLInputElement | null>(null); //
	const _handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setProductImage(imageUrl);
			setValue('image', file);
		}
	};

	const _handleRemoveImage = () => {
		setProductImage(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = ''; // Reset input file
		}
		setValue('image', null);
	};

	const onSubmit = async (data: FormField) => {
		console.log(data);
		const formData = new FormData();
		formData.append(
			'product',
			JSON.stringify({
				name: data.name,
				price: data.price,
				supplierId: data.supplierId,
				authorId: data.authorId,
				categoryId: data.categoryId
			})
		);
		if (data.image) {
			formData.append('file', data.image);
		}
		try {
			await addProduct(formData);
			toast.success('Thêm sản phẩm thành công!');
			dispatch(fetchProducts());
			setIsOpen(false);
			setIsOpen(false);
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error('Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy nhân viên.');
			} else if (err.response?.status === 500) {
				toast.error((err.response?.data as any).message);
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};
	const [formattedPrice, setFormattedPrice] = useState('');
	const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = event.target.value.replace(/\./g, ''); // Loại bỏ dấu chấm
		if (!/^\d*$/.test(rawValue)) return; // Chỉ chấp nhận số

		const numericValue = Number(rawValue);
		setFormattedPrice(new Intl.NumberFormat('vi-VN').format(numericValue)); // Định dạng số
		console.log(numericValue);
		setValue('price', numericValue); // Lưu số nguyên vào react-hook-form
	};

	return (
		<div className='text-end mb-4'>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<Button className='bg-slate-800 hover:bg-slate-900' onClick={openDialog}>
						<Plus />
						Thêm
					</Button>
				</DialogTrigger>
				<DialogContent className='w-full max-w-2xl mx-auto p-6 space-y-4'>
					<DialogHeader>
						<DialogTitle>Tạo sản phẩm mới</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
							{/* Hình ảnh sản phẩm bên trái */}
							<div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 p-4'>
								{productImage ? (
									<div className='relative'>
										<img
											src={productImage}
											width={'100%'}
											alt='Hình sản phẩm'
											className='object-cover rounded-md border'
										/>
										<button
											onClick={_handleRemoveImage}
											className='absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition'
										>
											<Trash2 size={16} />
										</button>
									</div>
								) : (
									<>
										<Image className='mx-auto size-12 text-gray-300' />
										<div className='mt-4 flex text-sm text-gray-600'>
											<label
												htmlFor='file-upload'
												className='relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2'
											>
												<span>Chọn ảnh</span>
												<input
													{...register('image', {
														required: 'Vui lòng chọn ảnh sản phẩm'
													})}
													id='file-upload'
													name='file-upload'
													type='file'
													accept='image/*'
													className='sr-only'
													onChange={_handleFileChange}
													ref={fileInputRef}
												/>
											</label>
										</div>
									</>
								)}
								{errors.image && <p className='text-red-500 text-sm'>{errors.image.message}</p>}
							</div>

							{/* Các trường thông tin còn lại bên phải */}
							<div className='grid gap-4'>
								{/* Tên sản phẩm */}
								<div className='grid items-center gap-4'>
									<Label htmlFor='name' className='text-center font-bold'>
										Tên sản phẩm
									</Label>
									<Input
										id='name'
										type='text'
										className='col-span-3'
										{...register('name', { required: 'Vui lòng nhập tên sản phẩm' })}
									/>
									{errors.name && <p className='text-red-500 text-sm col-span-3'>{errors.name.message}</p>}
								</div>

								{/* Giá sản phẩm */}
								<div className='grid items-center gap-4'>
									<Label htmlFor='price' className='text-center font-bold'>
										Giá sản phẩm
									</Label>
									<Input
										id='price'
										type='text'
										className='col-span-3'
										value={formattedPrice} // Hiển thị giá có dấu `.`
										// Cập nhật giá trị khi nhập
										{...register('price', {
											required: 'Vui lòng nhập giá sản phẩm'
										})}
										onChange={handlePriceChange}
									/>
									{errors.price && <p className='text-red-500 text-sm col-span-3'>{errors.price.message}</p>}
								</div>
								{/* Nhà cung cấp */}
								<div className='grid items-center gap-4'>
									<Label className='text-center font-bold'>Nhà cung cấp</Label>
									<Select
										{...register('supplierId', { required: 'Vui lòng chọn nhà cung cấp' })}
										onValueChange={async value => {
											setValue('supplierId', value); // Cập nhật giá trị
											await trigger('supplierId'); // Kiểm tra validation ngay
										}}
									>
										<SelectTrigger className='col-span-3'>
											<SelectValue placeholder='Chọn nhà cung cấp' />
										</SelectTrigger>
										<SelectContent>
											{suppliers?.map(supplier => (
												<SelectItem key={supplier.id} value={supplier.id.toString()}>
													{supplier.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.supplierId && <p className='text-red-500 text-sm col-span-3'>{errors.supplierId.message}</p>}
								</div>
								{/* Danh mục sản phẩm */}
								<div className='grid items-center gap-4'>
									<Label className='text-center font-bold'>Thể loại</Label>
									<Select
										{...register('categoryId', {
											required: 'Vui lòng chọn thể loại'
										})}
										onValueChange={async value => {
											setValue('categoryId', value); // Cập nhật giá trị
											await trigger('categoryId'); // Kiểm tra validation ngay
										}}
									>
										<SelectTrigger className='col-span-3'>
											<SelectValue placeholder='Chọn thể loại' />
										</SelectTrigger>
										<SelectContent>
											{categories?.map(category => (
												<SelectItem key={category.id} value={category.id.toString()}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.categoryId && <p className='text-red-500 text-sm col-span-3'>{errors.categoryId.message}</p>}
								</div>

								{/* Tác giả */}
								<div className='grid items-center gap-4'>
									<Label className='text-center font-bold'>Tác giả</Label>
									<Select
										{...register('authorId', {
											required: 'Vui lòng chọn tác giả'
										})}
										onValueChange={async value => {
											setValue('authorId', value); // Cập nhật giá trị
											await trigger('authorId'); // Kiểm tra validation ngay
										}}
									>
										<SelectTrigger className='col-span-3'>
											<SelectValue placeholder='Chọn tác giả' />
										</SelectTrigger>
										<SelectContent>
											{authors?.map(author => (
												<SelectItem key={author.id} value={author.id.toString()}>
													{author.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.authorId && <p className='text-red-500 text-sm col-span-3'>{errors.authorId.message}</p>}
								</div>
							</div>
						</div>

						<DialogFooter className='md:justify-between'>
							<DialogClose asChild>
								<Button type='button' variant='secondary'>
									Close
								</Button>
							</DialogClose>
							<Button type='submit'>Save changes</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}

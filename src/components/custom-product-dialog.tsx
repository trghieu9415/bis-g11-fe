import { useEffect, useState } from 'react';
import { useForm, Path, RegisterOptions, FieldError, PathValue } from 'react-hook-form';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectValue, SelectTrigger, SelectItem } from '@/components/ui/select';
import { SelectContent } from '@radix-ui/react-select';
import { Trash2, Upload } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction
} from '@/components/ui/alert-dialog';

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

interface FieldConfig {
	label: string;
	key: keyof FieldProduct;
	type: 'input' | 'select' | 'number' | 'image';
	disabled?: boolean;
	options?: { value: string; label: string; isBoolean?: boolean }[];
	validation?: RegisterOptions;
	showOnly?: 'view' | 'edit' | 'delete';
	isShow?: boolean;
}

interface CustomProductDialogProps {
	entity: FieldProduct;
	isOpen: boolean;
	onClose: () => void;
	mode: 'view' | 'edit' | 'delete';
	fields: FieldConfig[][][];
	onSave?: (data: FieldProduct) => void;
	onDelete?: (data: FieldProduct) => void;
	setProductImage: (file: File) => void;
}

export default function CustomProductDialog({
	entity,
	isOpen,
	onClose,
	mode,
	fields,
	onSave,
	onDelete,
	setProductImage
}: CustomProductDialogProps) {
	const isReadOnly = mode === 'view';
	const isSave = mode === 'edit';
	const isDelete = mode === 'delete';
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const {
		register,
		reset,
		watch,
		trigger,
		setValue,
		formState: { errors }
	} = useForm<FieldProduct>({
		defaultValues: entity
	});

	const formData = watch();

	// Reset form when open dialog
	useEffect(() => {
		if (isOpen) {
			reset(entity);
			setImagePreview(entity.image || null);
		}
	}, [isOpen, entity, reset]);

	// Handle change value select option
	const handleChange = (field: keyof FieldProduct, value: PathValue<FieldProduct, Path<FieldProduct>>) => {
		setValue(field as Path<FieldProduct>, value);
	};

	const handleSaveClick = async () => {
		// Get all field keys except image since we handle it separately
		const fieldKeys = fields
			.flat(2)
			.filter(field => field.key !== 'image')
			.map(field => field.key) as Path<FieldProduct>[];

		const isValid = await trigger(fieldKeys);
		if (isValid) {
			if (onSave && formData) {
				// If there's a selected file, update the image in formData
				if (selectedFile) {
					formData.image = selectedFile as unknown as string;
				}
				onSave(formData);
			}
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			setProductImage(file);

			// Create preview URL for the selected image
			const previewUrl = URL.createObjectURL(file);
			setImagePreview(previewUrl);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-4xl p-0' onOpenAutoFocus={e => e.preventDefault()}>
				<DialogHeader className='p-6 pb-2'>
					<DialogTitle>Thông tin sản phẩm</DialogTitle>
					<DialogDescription>
						{isDelete
							? 'Bạn có chắc chắn muốn xóa sản phẩm này không?'
							: isReadOnly
								? 'Xem thông tin chi tiết sản phẩm.'
								: 'Chỉnh sửa thông tin sản phẩm.'}
					</DialogDescription>
				</DialogHeader>

				<div className='flex flex-col md:flex-row p-6 pt-2'>
					{/* Left side - Image section */}
					<div className='w-full md:w-1/3 pr-0 md:pr-6 mb-4 md:mb-0'>
						<div className='flex flex-col'>
							<label className='w-full text-sm mb-2 font-semibold'>Hình ảnh sản phẩm</label>
							<div className='border rounded-md p-4 flex flex-col items-center justify-center bg-gray-50'>
								{imagePreview ? (
									<div className='mb-3 w-full flex justify-center'>
										<img
											src={imagePreview}
											alt='Product preview'
											className='max-h-64 max-w-full object-contain rounded'
										/>
									</div>
								) : (
									<div className='mb-3 h-48 w-full flex items-center justify-center bg-gray-100 rounded'>
										<p className='text-gray-400'>Không có hình ảnh</p>
									</div>
								)}

								{/* Only show file input when in edit mode */}
								{!isReadOnly && !isDelete && (
									<div className='w-full mt-2'>
										<label
											htmlFor='product-image'
											className='cursor-pointer px-4 py-2 border bg-gray-100 text-black rounded-md hover:bg-gray-200 transition flex items-center gap-2 justify-center w-full'
										>
											<Upload size={16} />
											Chọn ảnh mới
										</label>
										<input
											id='product-image'
											type='file'
											accept='image/*'
											className='hidden'
											onChange={handleImageChange}
										/>
										{selectedFile && (
											<p className='text-sm text-gray-500 mt-2 text-center truncate'>{selectedFile.name}</p>
										)}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Right side - Form fields */}
					<div className='w-full md:w-2/3 overflow-y-auto max-h-[60vh]'>
						<div className='grid grid-cols-1 gap-4'>
							{/* ID and Quantity row */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label className='w-full text-sm mb-1 text-start font-semibold'>ID</label>
									<Input
										type='text'
										className='w-full'
										disabled={true}
										readOnly={true}
										{...register('id' as Path<FieldProduct>)}
									/>
								</div>
								<div>
									<label className='w-full text-sm mb-1 text-start font-semibold'>Số lượng</label>
									<Input
										type='number'
										className='w-full'
										disabled={true}
										readOnly={true}
										{...register('quantity' as Path<FieldProduct>)}
									/>
								</div>
							</div>

							{/* Name row */}
							<div>
								<label className='w-full text-sm mb-1 text-start font-semibold'>Tên sản phẩm</label>
								<Input
									type='text'
									className='w-full'
									disabled={isReadOnly || isDelete}
									readOnly={isReadOnly || isDelete}
									{...register('name' as Path<FieldProduct>, {
										required: 'Tên sản phẩm không được để trống'
									})}
								/>
								{errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>}
							</div>

							{/* Price and Supplier row */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label className='w-full text-sm mb-1 text-start font-semibold'>Giá</label>
									<Input
										type='number'
										className='w-full'
										disabled={true}
										readOnly={true}
										{...register('price' as Path<FieldProduct>)}
									/>
								</div>
								<div>
									<label className='w-full text-sm mb-1 text-start font-semibold'>Nhà xuất bản</label>
									<Input
										type='text'
										className='w-full'
										disabled={true}
										readOnly={true}
										{...register('supplierName' as Path<FieldProduct>)}
									/>
								</div>
							</div>

							{/* Author and Category row */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label className='w-full text-sm mb-1 text-start font-semibold'>Tác giả</label>
									<Input
										type='text'
										className='w-full'
										disabled={true}
										readOnly={true}
										{...register('authorName' as Path<FieldProduct>)}
									/>
								</div>
								<div>
									<label className='w-full text-sm mb-1 text-start font-semibold'>Thể loại</label>
									<Input
										type='text'
										className='w-full'
										disabled={true}
										readOnly={true}
										{...register('categoryName' as Path<FieldProduct>)}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Action buttons */}
				<div className={`flex p-6 pt-2 border-t ${isDelete ? 'justify-between' : 'justify-end'}`}>
					{isDelete && (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<button className='px-4 py-2 border bg-red-500 text-white rounded-md hover:bg-red-600 transition flex justify-center items-center gap-1'>
									<Trash2 />
									Xóa
								</button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
									<AlertDialogDescription>
										Hành động này không thể hoàn tác. Dữ liệu của bạn sẽ bị xóa vĩnh viễn.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Hủy</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => {
											if (onDelete && formData) onDelete(formData);
										}}
									>
										Tiếp tục
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}
					<div className='flex justify-end gap-2'>
						<button
							className='px-4 py-2 border bg-white text-black rounded-md hover:bg-gray-100 transition'
							onClick={onClose}
						>
							Thoát
						</button>
						{isSave && (
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<button className='px-4 py-2 border bg-black text-white rounded-md hover:bg-gray-600 transition'>
										Lưu
									</button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Xác nhận lưu</AlertDialogTitle>
										<AlertDialogDescription>Bạn có chắc chắn muốn lưu những thay đổi này không?</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Thoát</AlertDialogCancel>
										<AlertDialogAction onClick={handleSaveClick}>Xác nhận</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

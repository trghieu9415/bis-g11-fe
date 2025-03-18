import { useEffect } from 'react';
import { useForm, DefaultValues, Path, RegisterOptions, FieldError, PathValue } from 'react-hook-form';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectValue, SelectTrigger, SelectItem } from '@/components/ui/select';
import { SelectContent } from '@radix-ui/react-select';
import { Trash2 } from 'lucide-react';
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

interface FieldConfig {
	label: string;
	key: string;
	type: 'input' | 'select' | 'date' | 'number' | 'time';
	disabled?: boolean;
	options?: { value: string; label: string; isBoolean?: boolean }[];
	validation?: RegisterOptions;
	showOnly?: 'view' | 'edit' | 'delete';
	isShow?: boolean;
}

// Cập nhật kiểu cho CustomDialogProps để xác định rõ kiểu của entity và formData
interface CustomDialogProps<T> {
	entity: T;
	isOpen: boolean;
	onClose: () => void;
	mode: 'view' | 'edit' | 'delete';
	fields: FieldConfig[][][];
	onSave?: (data: T) => void;
	onDelete?: (data: T) => void;
}

export default function CustomDialog<T extends Record<string, string | number | boolean | Date>>({
	entity,
	isOpen,
	onClose,
	mode,
	fields,
	onSave,
	onDelete
}: CustomDialogProps<T>) {
	const isReadOnly = mode === 'view';
	const isSave = mode === 'edit';
	const isDelete = mode === 'delete';

	const {
		register,
		reset,
		watch,
		trigger,
		setValue,
		formState: { errors }
	} = useForm<T>({
		defaultValues: entity as DefaultValues<T>
	});

	const formData = watch();

	// Reset form when open dialog
	useEffect(() => {
		if (isOpen) {
			reset(entity);
		}
	}, [isOpen, entity, reset]);

	// Handle change value select option
	const handleChange = (field: keyof T, value: PathValue<T, Path<T>>) => {
		setValue(field as Path<T>, value);
	};

	const handleSaveClick = async () => {
		const fieldKeys = fields.flat(2).map(field => field.key) as Path<T>[]; // Flatten fields for validation
		const isValid = await trigger(fieldKeys);
		if (isValid) {
			if (onSave && formData) {
				onSave(formData);
			}
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-screen-md p-6' onOpenAutoFocus={e => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle>Thông tin</DialogTitle>
					<DialogDescription>
						{isDelete
							? 'Bạn có chắc chắn muốn xóa mục này không?'
							: isReadOnly
								? 'Xem thông tin chi tiết.'
								: 'Chỉnh sửa thông tin.'}
					</DialogDescription>
				</DialogHeader>
				<div className='overflow-x-auto max-h-[65vh]'>
					{/* Dynamically creating grid columns based on array length */}
					<div className='p-4'>
						{fields.map((fieldGroup, fieldGroupIndex) => (
							<div key={fieldGroupIndex} className={`grid gap-x-14 gap-y-4 grid-cols-${fieldGroup.length}`}>
								{fieldGroup.map((childFieldGroup, childIndex) => (
									<div key={childIndex} className={`grid gap-4 grid-cols-${childFieldGroup.length} mb-4`}>
										{childFieldGroup.map(
											({ label, key, type, options, disabled, validation, showOnly, isShow = true }, fieldIndex) => (
												<div key={key} className='flex items-center flex-col'>
													<div className='flex items-start flex-col space-x-2 flex-1 w-full'>
														{isShow && (!showOnly || showOnly === mode) && (
															<>
																<label className='w-full text-sm mb-1 text-start font-semibold'>{label}</label>
																{type === 'input' || type === 'number' ? (
																	<div className='!ml-0 w-full'>
																		<Input
																			type={type === 'number' ? 'number' : 'text'}
																			className='w-full'
																			disabled={disabled || isReadOnly || isDelete}
																			readOnly={isReadOnly || isDelete}
																			{...register(key as Path<T>, {
																				required: validation?.required || false,
																				minLength: validation?.minLength,
																				pattern: validation?.pattern
																			})}
																		/>
																		{errors[key as Path<T>] && (
																			<div className='flex justify-start w-full'>
																				<p className='text-red-500 text-sm'>
																					{(errors[key as keyof T] as FieldError)?.message || ''}
																				</p>
																			</div>
																		)}
																	</div>
																) : type === 'select' && options ? (
																	<div className='!ml-0 w-full'>
																		<Select
																			value={String(watch(key as Path<T>) ?? '')}
																			onValueChange={value => {
																				const selectedOption = options.find(opt => opt.value === value);
																				let parsedValue: PathValue<T, Path<T>> = value as PathValue<T, Path<T>>;

																				if (selectedOption?.isBoolean) {
																					parsedValue = (value === 'true') as PathValue<T, Path<T>>;
																				}
																				handleChange(key as keyof T, parsedValue);
																			}}
																			disabled={disabled || isReadOnly || isDelete}
																		>
																			<SelectTrigger className='w-full border p-2 rounded-md'>
																				<SelectValue />
																			</SelectTrigger>
																			<SelectContent className='bg-white border border-gray-300 shadow-lg rounded-md z-10 w-full'>
																				{options.map(({ value, label }) => (
																					<SelectItem key={value} value={value} className='w-full flex-1'>
																						{label}
																					</SelectItem>
																				))}
																			</SelectContent>
																		</Select>
																	</div>
																) : type === 'date' ? (
																	<div className='!ml-0 w-full'>
																		<Input
																			type='date'
																			className='w-full block'
																			disabled={disabled || isReadOnly || isDelete}
																			{...register(key as Path<T>, {
																				required: validation?.required || false,
																				minLength: validation?.minLength,
																				pattern: validation?.pattern,
																				validate: validation?.validate
																			})}
																		/>
																		{errors[key as Path<T>] && (
																			<div className='flex justify-start w-full'>
																				<p className='text-red-500 text-sm'>
																					{(errors[key as keyof T] as FieldError)?.message || ''}
																				</p>
																			</div>
																		)}
																	</div>
																) : type === 'time' ? (
																	<div className='!ml-0 w-full'>
																		<Input
																			type='text'
																			className='w-full'
																			disabled={disabled || isReadOnly || isDelete}
																			readOnly={isReadOnly || isDelete}
																			{...register(key as Path<T>, {
																				required: validation?.required || false,
																				pattern: validation?.pattern,
																				validate: validation?.validate
																			})}
																		/>
																		{errors[key as Path<T>] && (
																			<div className='flex justify-start w-full'>
																				<p className='text-red-500 text-sm'>
																					{(errors[key as keyof T] as FieldError)?.message || ''}
																				</p>
																			</div>
																		)}
																	</div>
																) : null}
															</>
														)}
													</div>
												</div>
											)
										)}
									</div>
								))}
							</div>
						))}
					</div>
				</div>

				{/* Start: Actions btn */}
				<div className={`flex mt-4 ${isDelete ? 'justify-between' : 'justify-end'}`}>
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
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => {
											if (onDelete && formData) onDelete(formData);
										}}
									>
										Tiếp
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
				{/* End: Actions btn */}
			</DialogContent>
		</Dialog>
	);
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectGroup, SelectValue, SelectTrigger, SelectItem } from '@/components/ui/select';
import { SelectContent } from '@radix-ui/react-select';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FieldConfig {
	label: string;
	key: string;
	type: 'input' | 'select' | 'date' | 'number';
	disabled?: boolean;
	options?: { value: string; label: string; isBoolean?: boolean }[];
}

// Cập nhật kiểu cho CustomDialogProps để xác định rõ kiểu của entity và formData
interface CustomDialogProps<T> {
	entity: T;
	isOpen: boolean;
	onClose: () => void;
	mode: 'view' | 'edit' | 'delete';
	fields: FieldConfig[];
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

	const [formData, setFormData] = useState<T | null>(entity);

	useEffect(() => {
		setFormData(entity);
	}, [entity]);

	const handleChange = (field: keyof T, value: string | boolean | number) => {
		if (!formData) return;
		setFormData(prev => ({
			...prev!,
			[field]: value
		}));
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
				<div>
					<div className='grid grid-cols-2 gap-x-8 gap-y-4 p-4'>
						{fields.map(({ label, key, type, options, disabled }) => (
							<div className='flex items-center space-x-2' key={key}>
								<p className='w-32 text-right font-semibold'>{label}:</p>
								{type === 'input' || type === 'number' ? (
									<Input
										type={type === 'number' ? 'number' : 'text'}
										className='w-full'
										disabled={disabled || isReadOnly || isDelete}
										value={String(formData?.[key as keyof T] ?? '')}
										readOnly={isReadOnly || isDelete}
										autoFocus={false}
										onChange={e =>
											handleChange(key as keyof T, type === 'number' ? Number(e.target.value) : e.target.value)
										}
									/>
								) : type === 'select' && options ? (
									<Select
										value={String(formData?.[key as keyof T] ?? '')}
										onValueChange={value => {
											const selectedOption = options.find(opt => opt.value === value);
											let parsedValue: string | boolean = value;

											if (selectedOption?.isBoolean) {
												parsedValue = value === 'true';
											}

											handleChange(key as keyof T, parsedValue);
										}}
										disabled={isReadOnly || isDelete}
									>
										<SelectTrigger className='w-full border p-2 rounded-md'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent className='bg-white border border-gray-300 shadow-lg rounded-md'>
											<SelectGroup>
												{options.map(({ value, label }) => (
													<SelectItem key={value} value={value}>
														{label}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								) : type === 'date' ? (
									<Input
										type='date'
										className='w-full block'
										disabled={isReadOnly || isDelete}
										value={
											formData?.[key as keyof T] && typeof formData[key as keyof T] === 'string'
												? (() => {
														try {
															return new Date(formData[key as keyof T] as string).toISOString().split('T')[0];
														} catch {
															return '';
														}
													})()
												: ''
										}
										onChange={e => handleChange(key as keyof T, e.target.value)}
									/>
								) : null}
							</div>
						))}
					</div>
				</div>
				<div className={`flex mt-4 ${isDelete ? 'justify-between' : 'justify-end'}`}>
					{isDelete && (
						<button
							className='px-4 py-2 border bg-red-500 text-white rounded-md hover:bg-red-600 transition flex justify-center items-center gap-1'
							onClick={() => {
								if (onDelete && formData) {
									onDelete(formData);
								}
							}}
						>
							<Trash2 />
							Delete
						</button>
					)}
					<div className='flex justify-end gap-2'>
						<button
							className='px-4 py-2 border bg-white text-black rounded-md hover:bg-gray-100 transition'
							onClick={onClose}
						>
							Cancel
						</button>
						{isSave && (
							<button
								className='px-4 py-2 border bg-black text-white rounded-md hover:bg-gray-600 transition'
								onClick={() => {
									if (onSave && formData) {
										onSave(formData);
									}
								}}
							>
								Save changes
							</button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

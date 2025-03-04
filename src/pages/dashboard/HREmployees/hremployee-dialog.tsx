import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectGroup, SelectValue, SelectTrigger, SelectItem } from '@/components/ui/select';
import { SelectContent } from '@radix-ui/react-select';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type Employee = {
	id: string;
	full_name: string;
	role: string;
	status: boolean;
	base_salary: number;
	level: string;
	salary_coefficient: number;
	gender: boolean;
	email: string;
	phone: string;
	date_of_birth: string;
	address: string;
};

interface EmployeeDialogProps {
	employee: Employee | null;
	isOpen: boolean;
	onClose: () => void;
	mode: 'view' | 'edit' | 'delete';
}

export default function EmployeeDialog({ employee, isOpen, onClose, mode }: EmployeeDialogProps) {
	const isReadOnly = mode === 'view';
	const isSave = mode === 'edit';
	const isDelete = mode === 'delete';

	const [formData, setFormData] = useState<Employee | null>(employee);

	useEffect(() => {
		setFormData(employee);
	}, [employee]);

	const handleChange = (field: keyof Employee, value: string | boolean) => {
		if (!formData) return;
		setFormData(prev => ({
			...prev!,
			[field]: value
		}));
	};

	const handleSaveChanges = () => {
		if (!formData) return;
		console.log(formData);
	};

	const handleDelete = () => {
		if (!formData) return;
		console.log(formData);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-screen-md p-6'>
				<DialogHeader>
					<DialogTitle>Thông tin nhân viên</DialogTitle>
				</DialogHeader>
				<div>
					<div className='grid grid-cols-2 gap-x-8 gap-y-4 p-4'>
						{[
							{ label: 'Họ và tên', key: 'full_name', type: 'input' },
							{
								label: 'Giới tính',
								key: 'gender',
								type: 'select',
								option: [
									{ value: 'false', label: 'Nữ', isBoolean: true },
									{ value: 'true', label: 'Nam', isBoolean: true }
								]
							},
							{ label: 'ID', key: 'id', type: 'input', disabled: true },
							{ label: 'Vai trò', key: 'role', type: 'input', disabled: true },
							{
								label: 'Trạng thái',
								key: 'status',
								type: 'select',
								option: [
									{ value: 'true', label: 'Hoạt động', isBoolean: true },
									{ value: 'false', label: 'Không Hoạt động', isBoolean: true }
								]
							},
							{ label: 'Cấp bậc', key: 'level', type: 'input', disabled: true },
							{ label: 'Lương cơ bản', key: 'base_salary', type: 'input', disabled: true },
							{ label: 'Hệ số lương', key: 'salary_coefficient', type: 'input', disabled: true },
							{ label: 'Ngày sinh', key: 'date_of_birth', type: 'date' },
							{ label: 'Địa chỉ', key: 'address', type: 'input' },
							{ label: 'Email', key: 'email', type: 'input' },
							{ label: 'SĐT', key: 'phone', type: 'input' }
						].map(({ label, key, type, option, disabled }) => (
							<div className='flex items-center space-x-2' key={key}>
								<p className='w-32 text-right font-semibold'>{label}:</p>
								{type === 'input' ? (
									<Input
										className='w-full'
										disabled={disabled || isReadOnly || isDelete}
										value={String(formData?.[key as keyof Employee] ?? '')}
										readOnly={isReadOnly || isDelete}
										onChange={e => handleChange(key as keyof Employee, e.target.value)}
									/>
								) : type === 'select' && option ? (
									<Select
										value={String(formData?.[key as keyof Employee] ?? '')}
										onValueChange={value => {
											const selectedOption = option.find(opt => opt.value === value);
											let parsedValue: string | boolean = value;

											if (selectedOption?.isBoolean) {
												parsedValue = value === 'true'; // Chuyển về boolean
											}

											handleChange(key as keyof Employee, parsedValue);
										}}
										disabled={isReadOnly || isDelete}
									>
										<SelectTrigger className='w-full border p-2 rounded-md'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent className='bg-white border border-gray-300 shadow-lg rounded-md'>
											<SelectGroup>
												{option.map(({ value, label }) => (
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
											formData?.[key as keyof Employee] && typeof formData[key as keyof Employee] === 'string'
												? new Date(formData[key as keyof Employee] as string).toISOString().split('T')[0]
												: ''
										}
										onChange={e => handleChange(key as keyof Employee, e.target.value)}
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
							onClick={handleDelete}
						>
							<Trash2 />
							Delete
						</button>
					)}
					<div className='flex justify-end gap-2 '>
						<button
							className='px-4 py-2 border bg-white text-black rounded-md hover:bg-gray-100 transition'
							onClick={onClose}
						>
							Cancel
						</button>
						{isSave && (
							<button
								className='px-4 py-2 border bg-black text-white rounded-md hover:bg-gray-600 transition'
								onClick={handleSaveChanges}
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

import { useEffect, useState } from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import LevelsTable from '@/pages/dashboard/Levels/levels-table';
import { addRole } from '@/services/roleService';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { fetchRoles } from '@/redux/slices/rolesSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { useSelector } from 'react-redux';
import { Plus } from 'lucide-react';

interface ResSeniority {
	id: number;
	idString: string;
	levelName: string;
	description: string;
	salaryCoefficient: number;
	status: number;
	roleId: number;
}

type Role = {
	id: number;
	idString: string;
	name: string;
	allowanceId: number | undefined;
	description: string;
	resSeniority: ResSeniority[];
	status: number;
};

type FormValues = {
	roleName: string;
	description: string;
	allowanceId: number;
	status: number;
};

export default function RolesCreateNew() {
	const [isOpen, setIsOpen] = useState(false);

	const dispatch = useAppDispatch();
	const { allowances } = useSelector((state: RootState) => state.allowances);

	const {
		register,
		formState: { errors },
		reset,
		watch,
		trigger,
		setValue
	} = useForm<FormValues>({
		defaultValues: {
			roleName: '',
			description: '',
			allowanceId: undefined
		}
	});

	const formData = watch();

	const openDialog = () => {
		reset();
		setIsOpen(true);
	};

	const closeDialog = () => setIsOpen(false);

	const handleAddRole = async () => {
		try {
			const fieldsToValidate = ['roleName', 'description', 'allowanceId'] as const;
			const isValid = await trigger(fieldsToValidate);
			if (isValid) {
				const roleData = {
					name: formData.roleName,
					description: formData.description,
					allowanceId: formData.allowanceId
				};
				const res = await addRole(roleData);
				// @ts-expect-error - except success attr
				if (res.success) {
					toast.success('Thêm thông tin cấp bậc thành công!');
					dispatch(fetchRoles());
					closeDialog();
				}
			}
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error(
					(err.response.data as { message?: string }).message || 'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
				);
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy cấp bậc.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	return (
		<div className='text-end mb-4'>
			<Button className='bg-green-800 hover:bg-green-900' onClick={openDialog}>
				<Plus />
				Thêm
			</Button>
			<Dialog open={isOpen} onOpenChange={() => closeDialog()}>
				<DialogContent className='min-w-[1000px] max-h-[98vh] ' onOpenAutoFocus={e => e.preventDefault()}>
					<DialogHeader>
						<DialogTitle>Thêm chức vụ</DialogTitle>
						<DialogDescription>Vui lòng nhập đầy đủ thông tin để thêm chức vụ mới vào hệ thống.</DialogDescription>
					</DialogHeader>
					<div className='grid grid-cols-3 gap-4'>
						<div>
							<label htmlFor='role-name' className='w-full text-sm mb-1 text-start font-semibold'>
								Tên chức vụ
							</label>
							<Input
								id='role-name'
								type='text'
								className='w-full'
								{...register('roleName', {
									required: 'Vui lòng tên chức vụ',
									minLength: {
										value: 3,
										message: 'Tên chức vụ phải có ít nhất 3 ký tự'
									}
								})}
							/>
							{errors.roleName && <p className='text-red-500 text-sm'>{errors.roleName.message}</p>}
						</div>
						<div>
							<label htmlFor='allowance' className='w-full text-sm mb-1 text-start font-semibold'>
								Phụ cấp
							</label>
							<Select
								value={formData?.allowanceId !== undefined ? formData.allowanceId.toString() : undefined}
								onValueChange={value => {
									setValue('allowanceId', parseInt(value));
								}}
								{...register('allowanceId', { required: 'Vui lòng chọn phụ cấp' })}
							>
								<SelectTrigger className='w-full' id='allowance'>
									<SelectValue placeholder='Chọn phụ cấp' />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{allowances.map((item, index) => {
											return (
												<SelectItem key={index} value={`${item.id}`}>
													{item.allowance} VNĐ
												</SelectItem>
											);
										})}
									</SelectGroup>
								</SelectContent>
							</Select>
							{errors.allowanceId && <p className='text-red-500 text-sm'>{errors.allowanceId.message}</p>}
						</div>
						<div>
							<label htmlFor='status' className='w-full text-sm mb-1 text-start font-semibold'>
								Trạng thái
							</label>
							<Select
								value={`2`}
								// onValueChange={value => {
								// 	setValue('status', parseInt(value));
								// }}
								// {...register('status', { required: 'Vui lòng chọn trạng thái' })}
							>
								<SelectTrigger className='w-full' disabled id='status'>
									<SelectValue placeholder='Chọn trạng thái' />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value={`1`}>Hoạt động</SelectItem>
										<SelectItem value={`2`}>Chưa kích hoạt</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							{errors.status && <p className='text-red-500 text-sm'>{errors.status.message}</p>}
						</div>
					</div>
					<div className='grid grid-cols-1'>
						<div>
							<label htmlFor='role-description' className='w-full text-sm mb-1 text-start font-semibold'>
								Mô tả
							</label>
							<Input
								id='role-description'
								type='text'
								className='w-full'
								{...register('description', {
									required: 'Vui lòng nhập mô tả',
									minLength: {
										value: 3,
										message: 'Mô tả phải có ít nhất 3 ký tự'
									}
								})}
							/>
							{errors.description && <p className='text-red-500 text-sm'>{errors.description.message}</p>}
						</div>
					</div>
					<div className='flex items-center justify-end gap-2'>
						<div className='flex justify-end gap-2'>
							<button
								className='px-4 py-2 border bg-white text-black rounded-md hover:bg-gray-100 transition'
								onClick={() => closeDialog()}
							>
								Thoát
							</button>
						</div>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<button className='px-4 py-2 border w-[80px] float-end bg-black text-white rounded-md hover:bg-gray-600 transition '>
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
									<AlertDialogAction onClick={handleAddRole}>Xác nhận</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

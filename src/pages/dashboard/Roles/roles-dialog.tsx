import { useEffect } from 'react';
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
import { useForm } from 'react-hook-form';
import LevelsTable from '@/pages/dashboard/Levels/levels-table';
import { updateRole } from '@/services/roleService';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { fetchRoles } from '@/redux/slices/rolesSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { useSelector } from 'react-redux';

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
	description: string;
	resSeniority: ResSeniority[];
};

type RolesDialogProps = {
	isOpen: boolean;
	selectedRole: Role | null;
	mode: string;
	onClose: () => void;
};

type FormValues = {
	roleName: string;
	description: string;
	allowance: number;
};

export default function RolesDialog({ isOpen, selectedRole, onClose, mode }: RolesDialogProps) {
	const dispatch = useAppDispatch();
	const { allowances } = useSelector((state: RootState) => state.allowances);

	console.log(allowances);

	const {
		register,
		formState: { errors },
		reset,
		watch,
		trigger
	} = useForm<FormValues>({
		defaultValues: {
			roleName: '',
			description: ''
		}
	});

	const formData = watch();

	useEffect(() => {
		if (selectedRole) {
			reset({
				roleName: selectedRole.name,
				description: selectedRole.description
			});
		}
	}, [selectedRole, reset]);

	const handleUpdateRole = async () => {
		try {
			const fieldsToValidate = ['roleName', 'description'] as const;
			const isValid = await trigger(fieldsToValidate);
			if (isValid && selectedRole) {
				const roleId = selectedRole.id;
				const roleData = {
					name: formData.roleName,
					description: formData.description
				};
				const res = await updateRole(roleId, roleData);
				console.log(res);
				// @ts-expect-error - exception success attr
				if (res.success) {
					toast.success('Thêm thông tin cấp bậc thành công!');
					dispatch(fetchRoles());
					onClose();
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
		<>
			<Dialog open={isOpen} onOpenChange={() => onClose()}>
				<DialogContent className='min-w-[1000px] max-h-[98vh] ' onOpenAutoFocus={e => e.preventDefault()}>
					<DialogHeader>
						<DialogTitle>{selectedRole ? selectedRole.name : 'Role Details'}</DialogTitle>
						<DialogDescription>{selectedRole ? selectedRole.description : 'No role selected'}</DialogDescription>
					</DialogHeader>
					<div className='grid grid-cols-3 gap-4'>
						<div>
							<label htmlFor='role-id' className='w-full text-sm mb-1 text-start font-semibold'>
								ID
							</label>
							<Input
								id='role-id'
								type='text'
								value={selectedRole ? selectedRole.idString : 'N/A'}
								className='w-full'
								disabled
							/>
						</div>
						<div>
							<label htmlFor='role-name' className='w-full text-sm mb-1 text-start font-semibold'>
								Tên chức vụ
							</label>
							<Input
								id='role-name'
								type='text'
								className='w-full'
								disabled={mode !== 'edit'}
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
							<Select>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Chọn phụ cấp' />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value='apple'>Apple</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							{errors.allowance && <p className='text-red-500 text-sm'>{errors.allowance.message}</p>}
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
								disabled={mode !== 'edit'}
								{...register('description', {
									required: 'Vui lòng mô tả',
									minLength: {
										value: 3,
										message: 'Mô tả phải có ít nhất 3 ký tự'
									}
								})}
							/>
							{errors.description && <p className='text-red-500 text-sm'>{errors.description.message}</p>}
						</div>
					</div>
					{mode === 'edit' && (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<button className='px-4 py-2 border w-[80px] ml-auto float-end bg-black text-white rounded-md hover:bg-gray-600 transition '>
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
									<AlertDialogAction onClick={handleUpdateRole}>Xác nhận</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}
					<LevelsTable selectedRole={selectedRole} mode={mode} />
					<div className='flex justify-end gap-2'>
						<button
							className='px-4 py-2 border bg-white text-black rounded-md hover:bg-gray-100 transition'
							onClick={() => onClose()}
						>
							Thoát
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

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
import { updateRole, deleteRole } from '@/services/roleService';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { fetchRoles } from '@/redux/slices/rolesSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';

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

type RolesDialogProps = {
	isOpen: boolean;
	selectedRole: Role | null;
	mode: string;
	onClose: () => void;
};

type FormValues = {
	roleName: string;
	description: string;
	allowanceId: number;
	status: number;
};

export default function RolesDialog({ isOpen, selectedRole, onClose, mode }: RolesDialogProps) {
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
			allowanceId: undefined,
			status: undefined
		}
	});

	const formData = watch();

	useEffect(() => {
		if (selectedRole) {
			reset({
				roleName: selectedRole.name,
				description: selectedRole.description,
				allowanceId: selectedRole.allowanceId ?? undefined,
				status: selectedRole.status ?? undefined
			});
		}
	}, [selectedRole, reset]);

	const handleUpdateRole = async () => {
		try {
			const fieldsToValidate = ['roleName', 'description', 'allowanceId', 'status'] as const;
			const isValid = await trigger(fieldsToValidate);
			if (isValid && selectedRole) {
				const roleId = selectedRole.id;
				const roleData = {
					name: formData.roleName,
					description: formData.description,
					allowanceId: formData.allowanceId,
					status: formData.status
				};

				const res = await updateRole(roleId, roleData);
				// @ts-expect-error - exception success attr
				if (res.success) {
					toast.success('Cập nhật thông tin cấp bậc thành công!');
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

	const handleDeleteRole = async () => {
		try {
			if (selectedRole) {
				const roleId = selectedRole.id;
				const res = await deleteRole(roleId);
				// @ts-expect-error - exception success attr
				if (res.success) {
					toast.success('Xóa cấp bậc thành công!');
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
				<DialogContent className='max-h-[98vh] min-w-[1000px]' onOpenAutoFocus={e => e.preventDefault()}>
					<DialogHeader>
						<DialogTitle>{selectedRole ? selectedRole.name : 'Role Details'}</DialogTitle>
						<DialogDescription>{selectedRole ? selectedRole.description : 'No role selected'}</DialogDescription>
					</DialogHeader>
					<div className='grid grid-cols-4 gap-4'>
						<div>
							<label htmlFor='role-id' className='mb-1 w-full text-start text-sm font-semibold'>
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
							<label htmlFor='role-name' className='mb-1 w-full text-start text-sm font-semibold'>
								Tên chức vụ
							</label>
							<Input
								id='role-name'
								type='text'
								className='w-full'
								disabled={mode !== 'edit' || selectedRole?.status === 1}
								{...register('roleName', {
									required: 'Vui lòng tên chức vụ',
									minLength: {
										value: 3,
										message: 'Tên chức vụ phải có ít nhất 3 ký tự'
									}
								})}
							/>
							{errors.roleName && <p className='text-sm text-red-500'>{errors.roleName.message}</p>}
						</div>
						<div>
							<label htmlFor='allowance' className='mb-1 w-full text-start text-sm font-semibold'>
								Phụ cấp
							</label>
							<Select
								value={formData?.allowanceId !== undefined ? formData.allowanceId.toString() : undefined}
								onValueChange={value => {
									setValue('allowanceId', parseInt(value));
								}}
								{...register('allowanceId', { required: 'Vui lòng chọn phụ cấp' })}
							>
								<SelectTrigger
									className='w-full'
									id='allowance'
									disabled={mode !== 'edit' || selectedRole?.status === 1}
								>
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
							{errors.allowanceId && <p className='text-sm text-red-500'>{errors.allowanceId.message}</p>}
						</div>
						<div>
							<label htmlFor='status' className='mb-1 w-full text-start text-sm font-semibold'>
								Trạng thái
							</label>
							<Select
								value={formData?.status !== undefined ? formData.status.toString() : undefined}
								onValueChange={value => {
									setValue('status', parseInt(value));
								}}
								{...register('status', { required: 'Vui lòng chọn trạng thái' })}
							>
								<SelectTrigger className='w-full' id='status' disabled={mode !== 'edit' || selectedRole?.status === 1}>
									<SelectValue placeholder='Chọn trạng thái' />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value={`1`}>Hoạt động</SelectItem>
										<SelectItem value={`2`}>Chưa kích hoạt</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							{errors.status && <p className='text-sm text-red-500'>{errors.status.message}</p>}
						</div>
					</div>
					<div className='grid grid-cols-1'>
						<div>
							<label htmlFor='role-description' className='mb-1 w-full text-start text-sm font-semibold'>
								Mô tả
							</label>
							<Input
								id='role-description'
								type='text'
								className='w-full'
								disabled={mode !== 'edit' || selectedRole?.status === 1}
								{...register('description', {
									required: 'Vui lòng nhập mô tả',
									minLength: {
										value: 3,
										message: 'Mô tả phải có ít nhất 3 ký tự'
									}
								})}
							/>
							{errors.description && <p className='text-sm text-red-500'>{errors.description.message}</p>}
						</div>
					</div>
					{mode === 'edit' && selectedRole?.status === 2 && (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<button className='float-end ml-auto w-[80px] rounded-md border bg-black px-4 py-2 text-white transition hover:bg-gray-600'>
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

					{mode === 'delete' && (
						<div className='flex items-center justify-between'>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<button className='flex items-center justify-center gap-1 rounded-md border bg-red-500 px-4 py-2 text-white transition hover:bg-red-600'>
										<Trash2 />
										Xóa
									</button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
										<AlertDialogDescription>Bạn có chắc chắn muốn xóa chức vụ này không?</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Thoát</AlertDialogCancel>
										<AlertDialogAction onClick={handleDeleteRole}>Xác nhận</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
							<div className='flex justify-end gap-2'>
								<button
									className='rounded-md border bg-white px-4 py-2 text-black transition hover:bg-gray-100'
									onClick={() => onClose()}
								>
									Thoát
								</button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}

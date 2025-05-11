import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
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
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut
} from '@/components/ui/command';
import { RootState, useAppDispatch } from '@/redux/store';
import { fetchUsers } from '@/redux/slices/usersSlice';
import { fetchRoles } from '@/redux/slices/rolesSlice';
import { addContract } from '@/services/contractService';
import { fetchContracts } from '@/redux/slices/contractsSlice';

interface UserFormData {
	fullname: string;
	phone: string;
	gender: number | null;
	email: string;
	date_of_birth: string;
	address: string;
	username: string;
	password: string;
	base_salary: string;
	role_id: number | null;
	role_name: string;
	level_name: string;
	level_id: number | null;
	salary_coefficient: number;
	start_date: string;
	end_date: string;
}

type Employee = {
	id: number;
	idString: string;
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
	username: string;
	password: string;
};

export default function ContractCreateNew() {
	const [isOpen, setIsOpen] = useState(false);
	const [isNumberStep, setIsNumberStep] = useState(1);
	const dispatch = useAppDispatch();
	const { users } = useSelector((state: RootState) => state.users);
	const { roles } = useSelector((state: RootState) => state.roles);
	const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
	const [isShowErrorChooseUser, setIsShowErrorChooseUser] = useState(false);
	const lastItemRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (isNumberStep === 2 && roles.length === 0) {
			dispatch(fetchRoles());
		}

		if (users.length === 0) {
			dispatch(fetchUsers());
		}
	}, [isNumberStep, roles.length, dispatch]);

	const {
		register,
		formState: { errors },
		setValue,
		getValues,
		trigger,
		watch,
		reset,
		setError
	} = useForm<UserFormData>({
		defaultValues: {
			base_salary: '',
			role_id: null as number | null,
			role_name: '',
			level_name: '',
			level_id: null as number | null,
			salary_coefficient: 1,
			start_date: '',
			end_date: ''
		}
	});

	const formData = watch();

	const openDialog = () => {
		reset();
		setSelectedUser(null);
		setIsOpen(true);
		setIsNumberStep(1);
	};
	const closeDialog = () => setIsOpen(false);

	const formatSalary = (value: string) => {
		const rawValue = value.replace(/,/g, '');
		if (!/^\d*$/.test(rawValue)) return;
		const formattedValue = new Intl.NumberFormat('en-US').format(Number(rawValue));
		setValue('base_salary', formattedValue, { shouldValidate: true });
	};

	const handleLevelChange = (levelId: string) => {
		const selectedRole = roles?.find(item => item.id === formData.role_id);
		const selectedLevel = selectedRole?.resSeniority.find(level => level.id === Number(levelId));

		if (selectedLevel) {
			setValue('level_id', selectedLevel.id);
			setValue('level_name', selectedLevel.levelName);
			setValue('salary_coefficient', selectedLevel.salaryCoefficient);
		}
	};

	const handleRoleChange = (roleId: string) => {
		const selectedRole = roles?.find(item => item.id.toString() === roleId);

		if (selectedRole) {
			setValue('role_id', selectedRole.id);
			setValue('role_name', selectedRole.name);

			if (selectedRole?.resSeniority?.length > 0) {
				const firstLevel = selectedRole.resSeniority[0];
				setValue('level_id', firstLevel.id);
				setValue('level_name', firstLevel.levelName);
				setValue('salary_coefficient', firstLevel.salaryCoefficient);
			} else {
				setValue('level_id', null);
				setValue('level_name', '');
				setValue('salary_coefficient', 1);
			}
		}
	};

	// Person information
	const personalInfo = [
		{ label: 'Họ và tên', value: selectedUser?.full_name },
		{ label: 'Số điện thoại', value: selectedUser?.phone },
		{ label: 'Giới tính', value: selectedUser?.gender ? 'Nam' : 'Nữ' },
		{ label: 'Email', value: selectedUser?.email },
		{ label: 'Ngày sinh', value: selectedUser?.date_of_birth },
		{ label: 'Địa chỉ', value: selectedUser?.address }
	];

	// Review & Submit
	const contractInfo = [
		{ label: 'Lương cơ bản', value: formData.base_salary },
		{ label: 'Chức vụ', value: formData.role_name },
		{ label: 'Cấp bậc', value: formData.level_name },
		{ label: 'Hệ số lương', value: formData.salary_coefficient },
		{ label: 'Ngày bắt đầu', value: formData.start_date },
		{ label: 'Ngày kết thúc', value: formData.end_date }
	];

	const handleNextClick = async () => {
		if (isNumberStep === 1) {
			if (selectedUser?.id) {
				setIsNumberStep(prev => Math.min(3, prev + 1));
				setIsShowErrorChooseUser(false);
			} else {
				setIsShowErrorChooseUser(true);
			}
		} else if (isNumberStep === 2) {
			const fieldsToValidate = [
				'role_id',
				'role_name',
				'level_name',
				'level_id',
				'base_salary',
				'salary_coefficient',
				'start_date',
				'end_date'
			] as const;

			const isValid = await trigger(fieldsToValidate);
			if (isValid) {
				setIsNumberStep(prev => Math.min(3, prev + 1));
			}
		}
	};

	const handleSubmitClick = async (data: UserFormData, selectedUser: Employee) => {
		const contractData = {
			baseSalary: Number(data.base_salary.replace(/,/g, '')),
			startDate: data.start_date,
			endDate: data.end_date,
			expiryDate: data.end_date,
			seniorityId: data.level_id,
			userId: selectedUser.id
		};

		try {
			await addContract(contractData);
			toast.success('Thêm hợp đồng cho nhân viên thành công!');
			dispatch(fetchContracts());
			setIsOpen(false);
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error(
					(err.response.data as { message?: string }).message || 'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
				);
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy hợp đồng.');
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

			{/* Dialog */}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className='w-full max-w-2xl mx-auto p-6 space-y-4' onOpenAutoFocus={e => e.preventDefault()}>
					<DialogHeader>
						<DialogTitle className='text-2xl font-bold text-center'>Tạo hợp đồng mới</DialogTitle>
						<DialogDescription className='text-center text-gray-500'>
							Chọn thông tin nhân viên và tạo hợp đồng mới
						</DialogDescription>
					</DialogHeader>

					<div className='flex items-center justify-center '>
						<div className='flex items-centers '>
							<Button className='p-2 outline-none border border-solid border-black text-black rounded-3xl bg-white hover:bg-* hover:text-* cursor-default'>
								<span className='border border-solid border-black h-6 w-6 flex text-center justify-center rounded-full'>
									1
								</span>
								General Info
							</Button>
						</div>
						<div>
							<div
								className={`${isNumberStep > 1 ? 'w-0' : 'w-16 h-px border border-solid border-gray-300'} transition duration-800 ease-in-out`}
							></div>
							<div
								className={`${isNumberStep > 1 ? 'w-16 h-px border border-solid border-black' : 'w-0 '} transition duration-800 ease-in-out`}
							></div>
						</div>
						<div className='flex items-center'>
							<Button
								disabled={isNumberStep < 2}
								className={`p-2 outline-none border border-solid ${isNumberStep > 1 ? 'border-black' : 'border-gray-300'} text-black rounded-3xl bg-white hover:bg-* hover:text-* cursor-default`}
							>
								<span
									className={`border border-solid ${isNumberStep > 1 ? 'border-black' : 'border-gray-300'} h-6 w-6 flex text-center justify-center rounded-full`}
								>
									2
								</span>{' '}
								Contract Info
							</Button>
						</div>
						<div>
							<div
								className={`${isNumberStep > 2 ? 'w-0' : 'w-16 h-px border border-solid border-gray-300'}  transition duration-800 ease-in-out`}
							></div>
							<div
								className={`${isNumberStep > 2 ? 'w-16 h-px border border-solid border-black' : 'w-0 '} transition duration-800 ease-in-out`}
							></div>
						</div>
						<div className='flex items-center'>
							<Button
								disabled={isNumberStep < 3}
								className={`p-2 outline-none border border-solid ${isNumberStep > 2 ? 'border-black' : 'border-gray-300'} text-black rounded-3xl bg-white hover:bg-* hover:text-* cursor-default`}
							>
								<span
									className={`border border-solid ${isNumberStep > 2 ? 'border-black' : 'border-gray-300'} h-6 w-6 flex text-center justify-center rounded-full`}
								>
									3
								</span>{' '}
								Review & Submit
							</Button>
						</div>
					</div>

					{/* Start: Main content */}
					{/* Start: General Info */}
					<div className='space-y-4'>
						{isNumberStep === 1 && (
							<div className='overflow-y-auto max-h-[55vh] pl-1'>
								<div className='pb-4 border-b border-solid border-b-gray-300 mb-4 mr-2'>
									<h3 className='text-gray-500 font-bold text-sm'>Bước 1</h3>
									<h2 className='text-black font-bold text-lg'>Thông tin cá nhân</h2>
									<Command>
										<CommandInput placeholder='Tìm kiếm nhân viên ở đây...' />
										<CommandList>
											<CommandEmpty>Không tìm thấy nhân viên cần thêm.</CommandEmpty>
											<CommandGroup heading='Kết quả'>
												<div className='max-h-[96px] overflow-y-auto'>
													{users.map((item, index) => {
														if (!item.role && !item.level && item.username.toLowerCase() !== 'admin') {
															return (
																<CommandItem
																	key={index}
																	onSelect={() => {
																		if (lastItemRef.current) {
																			lastItemRef.current.scrollIntoView({ behavior: 'smooth' });
																		}
																		setIsShowErrorChooseUser(false);
																		setSelectedUser(item);
																	}}
																>
																	({item.idString}) {item.full_name}
																</CommandItem>
															);
														}
													})}
												</div>
											</CommandGroup>
											<CommandSeparator />
										</CommandList>
										{isShowErrorChooseUser && (
											<p className='text-red-500 text-sm mt-2'>
												Vui lòng chọn nhân viên, nếu không có hãy tạo nhân viên mới nhé.
											</p>
										)}
									</Command>
								</div>

								<div className='mr-2'>
									<h2 className='mb-2 border-solid border-b border-gray-300 inline-block'>Personal Infomation</h2>
									<div className='grid grid-cols-2 gap-4 mb-2'>
										<div>
											<label className='text-sm' htmlFor='fullname'>
												<strong>Họ và tên</strong>
											</label>
											<Input
												id='fullname'
												type='text'
												className='mt-1'
												value={selectedUser?.full_name || ''}
												readOnly
												disabled
											/>
										</div>
										<div>
											<label className='text-sm' htmlFor='phone'>
												<strong>Số điện thoại</strong>
											</label>
											<Input
												id='phone'
												type='text'
												className='mt-1'
												value={selectedUser?.phone || ''}
												readOnly
												disabled
											/>
										</div>
									</div>
									<div className='grid grid-cols-2 gap-4 mb-2'>
										<div>
											<label className='text-sm' htmlFor='email'>
												<strong>Email</strong>
											</label>
											<Input id='email' type='email' value={selectedUser?.email || ''} readOnly disabled />
										</div>
										<div className='grid grid-cols-2 gap-4'>
											<div>
												<div>
													<label className='text-sm' htmlFor='date_of_birth'>
														<strong>Ngày sinh</strong>
													</label>
													<Input
														id='date_of_birth'
														type='date'
														className='mt-1 block'
														value={selectedUser?.date_of_birth || ''}
														readOnly
														disabled
													/>
												</div>
											</div>
											<div>
												<div>
													<label className='text-sm' htmlFor='gender'>
														<strong>Giới tính</strong>
													</label>
													<Select value={selectedUser?.gender ? 'male' : 'female'} disabled>
														<SelectTrigger className='mt-1' id='gender'>
															<SelectValue placeholder='Giới tính' />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value='male'>Nam</SelectItem>
															<SelectItem value='female'>Nữ</SelectItem>
														</SelectContent>
													</Select>
												</div>
											</div>
										</div>
									</div>
									<div className='grid grid-cols-1 mb-2'>
										<div ref={lastItemRef}>
											<label className='text-sm' htmlFor='address'>
												<strong>Địa chỉ</strong>
											</label>
											<Input
												id='address'
												type='text'
												className='mt-1'
												value={selectedUser?.address || ''}
												readOnly
												disabled
											/>
										</div>
									</div>
								</div>
							</div>
						)}
						{/* End: General Info */}

						{/* Start: Contract Info */}
						{isNumberStep === 2 && (
							<>
								<div className='pb-4 border-b border-solid border-b-gray-300'>
									<h3 className='text-gray-500 font-bold text-sm'>Bước 2</h3>
									<h2 className='text-black font-bold text-lg'>Thông tin hợp đồng</h2>
								</div>

								<div>
									<h2 className='mb-2 border-solid border-b border-gray-300 inline-block'>Contract Infomation</h2>
									<div className='grid grid-cols-2 gap-4 mb-2'>
										<div>
											<label className='text-sm' htmlFor='role'>
												<strong>Vai trò</strong>
											</label>
											<Select
												{...register('role_id', { required: 'Vui lòng chọn vai trò' })}
												value={formData.role_id ? String(formData.role_id) : undefined}
												onValueChange={handleRoleChange}
											>
												<SelectTrigger className='mt-1' id='role'>
													<SelectValue placeholder='Chọn vai trò' />
												</SelectTrigger>
												<SelectContent>
													{roles
														?.filter(
															item => item.status === 1 && item.resSeniority?.filter(s => s.status === 1).length > 0
														)
														?.map((item, index) => {
															if (item.name.toLowerCase() === 'admin'.toLowerCase()) return;

															return (
																<SelectItem value={String(item.id)} key={index}>
																	{item.name}
																</SelectItem>
															);
														})}
												</SelectContent>
											</Select>
											{errors.role_id && <p className='text-red-500 text-sm'>{errors.role_id.message}</p>}
										</div>
										<div>
											<label className='text-sm' htmlFor='level'>
												<strong>Cấp bậc</strong>
											</label>
											<Select
												{...register('level_id', { required: 'Vui lòng chọn cấp bậc' })}
												value={watch('level_id') ? String(watch('level_id')) : undefined}
												onValueChange={handleLevelChange}
												disabled={formData.role_id ? false : true}
											>
												<SelectTrigger className='mt-1' id='level'>
													<SelectValue placeholder='Chọn cấp bậc' />
												</SelectTrigger>
												<SelectContent>
													{roles
														?.find(role => role.id === formData.role_id)
														?.resSeniority.map(item => (
															<SelectItem value={String(item.id)} key={item.id}>
																{item.levelName}
															</SelectItem>
														))}
												</SelectContent>
											</Select>
											{errors.level_id && <p className='text-red-500 text-sm'>{errors.level_id.message}</p>}{' '}
										</div>
									</div>
									<div className='grid grid-cols-2 gap-4 mb-2'>
										<div>
											<label className='text-sm' htmlFor='base_salary'>
												<strong>Lương cơ bản</strong>
											</label>
											<Input
												id='base_salary'
												type='text'
												className='mt-1'
												{...register('base_salary', {
													required: 'Vui lòng nhập lương cơ bản',
													validate: value => {
														const numericValue = Number(value.replace(/,/g, ''));
														return numericValue > 0 || 'Lương cơ bản phải lớn hơn 0';
													}
												})}
												onChange={e => formatSalary(e.target.value)}
											/>
											{errors.base_salary && <p className='text-red-500 text-sm'>{errors.base_salary.message}</p>}{' '}
										</div>
										<div className='grid grid-cols-1 gap-4'>
											<div>
												<label className='text-sm' htmlFor=''>
													<strong>Hệ số lương</strong>
												</label>
												<Input type='number' className='mt-1' value={formData.salary_coefficient} readOnly disabled />
											</div>
										</div>
									</div>
								</div>
								<div className='grid grid-cols-2 gap-4 mb-2'>
									<div>
										<label className='text-sm' htmlFor='start_date'>
											<strong>Ngày bắt đầu</strong>
										</label>
										<Input
											id='start_date'
											type='date'
											className='mt-1 block'
											{...register('start_date', {
												required: 'Vui lòng chọn ngày bắt đầu',
												validate: value => {
													const today = new Date();
													const selectedDate = new Date(value);

													// End date must be on 10th
													if (selectedDate.getDate() !== 1) {
														return 'Ngày bắt đầu phải là ngày đầu của tháng trong tương lai';
													}

													if (selectedDate < today) {
														return `Ngày bắt đầu phải là ngày đầu của tháng trong tương lai`;
													}

													return true;
												}
											})}
										/>
										{errors.start_date && <p className='text-red-500 text-sm'>{errors.start_date.message}</p>}
									</div>
									<div>
										<label className='text-sm' htmlFor='end_date'>
											<strong>Ngày kết thúc</strong>
										</label>
										<Input
											id='end_date'
											type='date'
											className='mt-1 block'
											{...register('end_date', {
												required: 'Vui lòng chọn ngày kết thúc',
												validate: value => {
													const startDate = new Date(getValues('start_date'));
													const endDate = new Date(value);

													if (isNaN(startDate.getTime())) {
														return 'Vui lòng chọn ngày bắt đầu trước';
													}

													// Min 1 month from start_date
													const minEndDate = new Date(startDate);
													minEndDate.setMonth(minEndDate.getMonth() + 1);

													if (endDate < minEndDate) {
														return `Ngày kết thúc phải từ ${minEndDate.toLocaleDateString('en-CA')} trở đi`;
													}

													// End date must be on 10th
													if (endDate.getDate() !== 1) {
														return 'Ngày kết thúc phải vào ngày đầu của tháng';
													}

													return true;
												}
											})}
										/>
										{errors.end_date && <p className='text-red-500 text-sm'>{errors.end_date.message}</p>}
									</div>
								</div>
							</>
						)}
						{/* End: Contract Info */}

						{/* Start: Review & Submit */}
						{isNumberStep === 3 && (
							<>
								<div className='pb-4 border-b border-solid border-b-gray-300'>
									<h3 className='text-gray-500 font-bold text-sm'>Bước 3</h3>
									<h2 className='text-black font-bold text-lg'>Xem và xác nhận</h2>
								</div>
								<div>
									<div className='grid grid-cols-2 gap-4 mb-2'>
										<div>
											<h2 className='mb-2 border-solid border-b border-gray-300 inline-block'>Thông tin cá nhân</h2>
											{personalInfo.map((item, index) => (
												<label key={index} className='text-sm flex items-center gap-1 mt-1'>
													<strong>{item.label}:</strong>
													<p>{item.value || 'Chưa có dữ liệu'}</p>
												</label>
											))}
										</div>
										<div>
											<h2 className='mb-2 border-solid border-b border-gray-300 inline-block'>Thông tin hợp đồng</h2>
											{contractInfo.map((item, index) => (
												<label key={index} className='text-sm flex items-center gap-1 mt-1'>
													<strong>{item.label}:</strong>
													<p>{item.value || 'Chưa có dữ liệu'}</p>
												</label>
											))}
										</div>
									</div>
								</div>
							</>
						)}

						{/* End: Review & Submit */}
						{/* End: Main content */}

						{/* Start: Actions */}
						<div className={`flex ${isNumberStep === 1 ? 'justify-end' : 'justify-between'} pt-4`}>
							{isNumberStep !== 1 && (
								<div>
									<Button
										type='button'
										className='px-4 py-2 border bg-black text-white rounded-md hover:bg-gray-600 transition'
										onClick={() => setIsNumberStep(prev => Math.max(1, prev - 1))}
									>
										Trở về
									</Button>
								</div>
							)}
							<div className='space-x-2'>
								<Button
									type='button'
									onClick={closeDialog}
									className='px-4 py-2 border bg-white text-black rounded-md hover:bg-gray-100 transition'
								>
									Thoát
								</Button>
								{isNumberStep < 3 ? (
									<Button
										type='button'
										className='px-4 py-2 border bg-black text-white rounded-md hover:bg-gray-600 transition'
										// onClick={() => setIsNumberStep(prev => Math.min(3, prev + 1))}
										onClick={handleNextClick}
									>
										Tiếp
									</Button>
								) : (
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<button className='px-4 py-2 border bg-black text-white rounded-md hover:bg-gray-600 transition'>
												Tạo
											</button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Xác nhận thêm nhân viên</AlertDialogTitle>
												<AlertDialogDescription>
													Bạn có chắc chắn muốn thêm nhân viên này vào hệ thống? Các thông tin sẽ được lưu trữ và không
													thể thay đổi sau khi xác nhận.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => {
														if (selectedUser) {
															handleSubmitClick(formData, selectedUser);
														} else {
															toast.error('Có vẻ bạn chưa chọn nhân viên, vui lòng thử lại!');
														}
													}}
												>
													Xác nhận
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								)}
							</div>
						</div>
						{/* End: Actions */}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

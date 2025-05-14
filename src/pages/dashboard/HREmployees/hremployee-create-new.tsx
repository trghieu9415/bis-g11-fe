import { useState, useEffect } from 'react';
import { useForm, UseFormSetError } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

import { addUser } from '@/services/userService';
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
import { RootState, useAppDispatch } from '@/redux/store';
import { fetchUsers } from '@/redux/slices/usersSlice';
import { fetchRoles } from '@/redux/slices/rolesSlice';

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
	standard_working_days: number;
	start_date: string;
	end_date: string;
}

export default function EmployeeCreateNew() {
	const [isOpen, setIsOpen] = useState(false);
	const [isNumberStep, setIsNumberStep] = useState(1);
	const dispatch = useAppDispatch();
	const { users } = useSelector((state: RootState) => state.users);
	const { roles } = useSelector((state: RootState) => state.roles);

	useEffect(() => {
		if (isNumberStep === 2 && roles.length === 0) {
			dispatch(fetchRoles());
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
			fullname: '',
			phone: '',
			gender: null as number | null,
			email: '',
			date_of_birth: '',
			address: '',
			username: '',
			password: '',
			base_salary: '',
			role_id: null as number | null,
			role_name: '',
			level_name: '',
			level_id: null as number | null,
			salary_coefficient: 1,
			standard_working_days: 20,
			start_date: '',
			end_date: ''
		}
	});

	const formData = watch();

	const openDialog = () => {
		reset();
		setIsOpen(true);
		setIsNumberStep(1);
	};
	const closeDialog = () => setIsOpen(false);

	// Personal Info
	const generatePassword = () => {
		const uppercase: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const lowercase: string = 'abcdefghijklmnopqrstuvwxyz';
		const numbers: string = '0123456789';
		const specialChars: string = '!@#$%^&*';

		const getRandomChar = (charset: string): string => charset.charAt(Math.floor(Math.random() * charset.length));

		let passwordArray: string[] = [
			getRandomChar(uppercase),
			getRandomChar(lowercase),
			getRandomChar(numbers),
			getRandomChar(specialChars)
		];

		const allChars: string = uppercase + lowercase + numbers + specialChars;
		while (passwordArray.length < 12) {
			passwordArray.push(getRandomChar(allChars));
		}

		passwordArray = passwordArray.sort(() => Math.random() - 0.5);
		const password: string = passwordArray.join('');

		const email = watch('email') || '';
		const newUsername = email.split('@')[0] || '';

		setValue('password', password);
		setValue('username', newUsername);
	};

	const checkUserExistence = (
		email: string,
		phone: string,
		username: string,
		setError: UseFormSetError<UserFormData>
	) => {
		const existingEmail = users.find(user => user.email === email);
		const existingPhone = users.find(user => user.phone === phone);
		const existingUsername = users.find(user => user.username === username);

		if (existingEmail) {
			setError('email', { type: 'manual', message: 'Email đã tồn tại' });
		}
		if (existingPhone) {
			setError('phone', { type: 'manual', message: 'Số điện thoại đã tồn tại' });
		}
		if (existingUsername) {
			setError('username', { type: 'manual', message: 'Tên đăng nhập đã tồn tại' });
		}

		if (existingEmail || existingPhone || existingUsername) {
			return true;
		}

		return false;
	};

	// Contract info
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

	// Review & Submit
	const personalInfo = [
		{ label: 'Họ và tên', value: formData.fullname },
		{ label: 'Số điện thoại', value: formData.phone },
		{ label: 'Giới tính', value: formData.gender === 1 ? 'Nam' : 'Nữ' },
		{ label: 'Email', value: formData.email },
		{ label: 'Ngày sinh', value: formData.date_of_birth },
		{ label: 'Địa chỉ', value: formData.address }
	];

	const accountInfo = [
		{ label: 'Tên đăng nhập', value: formData.username },
		{ label: 'Mật khẩu', value: formData.password }
	];

	const contractInfo = [
		{ label: 'Lương cơ bản', value: formData.base_salary },
		{ label: 'Chức vụ', value: formData.role_name },
		{ label: 'Cấp bậc', value: formData.level_name },
		{ label: 'Hệ số lương', value: formData.salary_coefficient },
		// { label: 'Ngày công chuẩn', value: formData.standard_working_days },
		{ label: 'Ngày bắt đầu', value: formData.start_date },
		{ label: 'Ngày kết thúc', value: formData.end_date }
	];

	const handleNextClick = async () => {
		if (isNumberStep === 1) {
			const fieldsToValidate = [
				'fullname',
				'phone',
				'email',
				'date_of_birth',
				'gender',
				'address',
				'username',
				'password'
			] as const;

			const isValid = await trigger(fieldsToValidate);

			const email = getValues('email');
			const phone = getValues('phone');
			const username = getValues('username');

			const isExist = checkUserExistence(email, phone, username, setError);

			if (isValid && !isExist) {
				setIsNumberStep(prev => Math.min(3, prev + 1));
			}
		} else if (isNumberStep === 2) {
			const fieldsToValidate = [
				'role_id',
				'role_name',
				'level_name',
				'level_id',
				'base_salary',
				'salary_coefficient',
				'standard_working_days',
				'start_date',
				'end_date'
			] as const;

			const isValid = await trigger(fieldsToValidate);
			if (isValid) {
				setIsNumberStep(prev => Math.min(3, prev + 1));
			}
		}
	};

	const handleSubmitClick = async (data: UserFormData) => {
		const userData = {
			fullName: data.fullname,
			phoneNumber: data.phone,
			email: data.email,
			dateOfBirth: data.date_of_birth,
			address: data.address,
			gender: data.gender ? 'MALE' : 'FEMALE',
			username: data.username,
			password: data.password,
			reqContract: {
				baseSalary: Number(data.base_salary.replace(/,/g, '')),
				standardWorkingDay: data.standard_working_days,
				startDate: data.start_date,
				endDate: data.end_date,
				expiryDate: data.end_date,
				seniorityId: data.level_id
			}
		};

		try {
			await addUser(userData);
			toast.success('Thêm thông tin nhân viên thành công!');
			dispatch(fetchUsers());
			setIsOpen(false);
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error(
					(err.response.data as { message?: string }).message || 'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
				);
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy nhân viên.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	return (
		<div className='mb-4 text-end'>
			<Button className='bg-green-800 hover:bg-green-900' onClick={openDialog}>
				<Plus />
				Thêm
			</Button>

			{/* Dialog */}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className='mx-auto w-full max-w-2xl space-y-4 p-6' onOpenAutoFocus={e => e.preventDefault()}>
					<DialogHeader>
						<DialogTitle className='text-center text-2xl font-bold'>Tạo nhân viên & hợp đồng mới</DialogTitle>
						<DialogDescription className='text-center text-gray-500'>
							Điền thông tin để tạo nhân viên và hợp đồng mới
						</DialogDescription>
					</DialogHeader>

					<div className='flex items-center justify-center'>
						<div className='items-centers flex'>
							<Button className='hover:bg-* hover:text-* cursor-default rounded-3xl border border-solid border-black bg-white p-2 text-black outline-none'>
								<span className='flex h-6 w-6 justify-center rounded-full border border-solid border-black text-center'>
									1
								</span>
								General Info
							</Button>
						</div>
						<div>
							<div
								className={`${isNumberStep > 1 ? 'w-0' : 'h-px w-16 border border-solid border-gray-300'} duration-800 transition ease-in-out`}
							></div>
							<div
								className={`${isNumberStep > 1 ? 'h-px w-16 border border-solid border-black' : 'w-0'} duration-800 transition ease-in-out`}
							></div>
						</div>
						<div className='flex items-center'>
							<Button
								disabled={isNumberStep < 2}
								className={`border border-solid p-2 outline-none ${isNumberStep > 1 ? 'border-black' : 'border-gray-300'} hover:bg-* hover:text-* cursor-default rounded-3xl bg-white text-black`}
							>
								<span
									className={`border border-solid ${isNumberStep > 1 ? 'border-black' : 'border-gray-300'} flex h-6 w-6 justify-center rounded-full text-center`}
								>
									2
								</span>{' '}
								Contract Info
							</Button>
						</div>
						<div>
							<div
								className={`${isNumberStep > 2 ? 'w-0' : 'h-px w-16 border border-solid border-gray-300'} duration-800 transition ease-in-out`}
							></div>
							<div
								className={`${isNumberStep > 2 ? 'h-px w-16 border border-solid border-black' : 'w-0'} duration-800 transition ease-in-out`}
							></div>
						</div>
						<div className='flex items-center'>
							<Button
								disabled={isNumberStep < 3}
								className={`border border-solid p-2 outline-none ${isNumberStep > 2 ? 'border-black' : 'border-gray-300'} hover:bg-* hover:text-* cursor-default rounded-3xl bg-white text-black`}
							>
								<span
									className={`border border-solid ${isNumberStep > 2 ? 'border-black' : 'border-gray-300'} flex h-6 w-6 justify-center rounded-full text-center`}
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
							<div className='max-h-[55vh] overflow-y-auto pl-1'>
								<div className='mb-4 mr-2 border-b border-solid border-b-gray-300 pb-4'>
									<h3 className='text-sm font-bold text-gray-500'>Bước 1</h3>
									<h2 className='text-lg font-bold text-black'>Thông tin cá nhân</h2>
								</div>

								<div className='mr-2'>
									<h2 className='mb-2 inline-block border-b border-solid border-gray-300'>Personal Infomation</h2>
									<div className='mb-2 grid grid-cols-2 gap-4'>
										<div>
											<label className='text-sm' htmlFor='fullname'>
												<strong>Họ và tên</strong>
											</label>
											<Input
												id='fullname'
												type='text'
												className='mt-1'
												{...register('fullname', {
													required: 'Vui lòng nhập họ và tên',
													minLength: {
														value: 3,
														message: 'Họ và tên phải có ít nhất 3 ký tự'
													}
												})}
											/>
											{errors.fullname && <p className='text-sm text-red-500'>{errors.fullname.message}</p>}
										</div>
										<div>
											<label className='text-sm' htmlFor='phone'>
												<strong>Số điện thoại</strong>
											</label>
											<Input
												id='phone'
												type='text'
												className='mt-1'
												{...register('phone', {
													required: 'Vui lòng nhập số điện thoại',
													pattern: {
														value: /^0\d{9}$/,
														message: 'Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng 0'
													}
												})}
											/>
											{errors.phone && <p className='text-sm text-red-500'>{errors.phone.message}</p>}{' '}
										</div>
									</div>
									<div className='mb-2 grid grid-cols-2 gap-4'>
										<div>
											<label className='text-sm' htmlFor='email'>
												<strong>Email</strong>
											</label>
											<Input
												id='email'
												type='email'
												className='mt-1'
												{...register('email', {
													required: 'Vui lòng nhập email',
													pattern: {
														value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
														message: 'Email không hợp lệ'
													}
												})}
											/>
											{errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}{' '}
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
														{...register('date_of_birth', {
															required: 'Vui lòng chọn ngày sinh',
															validate: value => {
																if (!value) return 'Ngày sinh không hợp lệ';

																const birthDate = new Date(value);
																const today = new Date();

																if (birthDate > today) return 'Ngày sinh không thể ở tương lai';

																const age = today.getFullYear() - birthDate.getFullYear();
																const monthDiff = today.getMonth() - birthDate.getMonth();
																const dayDiff = today.getDate() - birthDate.getDate();

																if (age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
																	return 'Ngày sinh phải trên 18 tuổi';
																}

																return true;
															}
														})}
													/>
													{errors.date_of_birth && (
														<p className='text-sm text-red-500'>{errors.date_of_birth.message}</p>
													)}
												</div>
											</div>
											<div>
												<div>
													<label className='text-sm' htmlFor='gender'>
														<strong>Giới tính</strong>
													</label>
													<Select
														{...register('gender', { required: 'Vui lòng chọn giới tính' })}
														onValueChange={value => setValue('gender', value === 'male' ? 1 : 0)}
														value={watch('gender') === 1 ? 'male' : watch('gender') === 0 ? 'female' : undefined}
													>
														<SelectTrigger className='mt-1' id='gender'>
															<SelectValue placeholder='Giới tính' />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value='male'>Nam</SelectItem>
															<SelectItem value='female'>Nữ</SelectItem>
														</SelectContent>
													</Select>
													{errors.gender && <p className='text-sm text-red-500'>{errors.gender.message}</p>}
												</div>
											</div>
										</div>
									</div>
									<div className='mb-2 grid grid-cols-1'>
										<div>
											<label className='text-sm' htmlFor='address'>
												<strong>Địa chỉ</strong>
											</label>
											<Input
												id='address'
												type='text'
												className='mt-1'
												{...register('address', {
													required: 'Vui lòng nhập địa chỉ',
													minLength: {
														value: 3,
														message: 'Địa chỉ phải có ít nhất 10 ký tự'
													}
												})}
											/>
											{errors.address && <p className='text-sm text-red-500'>{errors.address.message}</p>}
										</div>
									</div>
								</div>
								<div className='mr-2'>
									<h2 className='mb-2 inline-block border-b border-solid border-gray-300'>Account Info</h2>
									<div className='mb-2 grid grid-cols-2 gap-4'>
										<div>
											<label className='text-sm' htmlFor='username'>
												<strong>Tên đăng nhập</strong>
											</label>
											<Input
												id='username'
												type='text'
												className='mt-1'
												{...register('username', {
													required: 'Vui lòng nhập tên đăng nhập',
													pattern: {
														value: /^(?![_.])[a-zA-Z0-9._]{6,20}(?<![_.])$/,
														message:
															'Tên đăng nhập chỉ chứa chữ, số, dấu chấm hoặc gạch dưới, không bắt đầu/kết thúc bằng dấu chấm/gạch dưới'
													}
												})}
											/>
											{errors.username && <p className='text-sm text-red-500'>{errors.username.message}</p>}
										</div>
										<div>
											<label className='text-sm' htmlFor='password'>
												<strong>Mật khẩu</strong>
											</label>
											<div className='flex gap-2'>
												<div>
													<Input
														id='password'
														type='text'
														className='mt-1'
														value={formData.password}
														{...register('password', {
															required: 'Vui lòng nhập mật khẩu',
															pattern: {
																value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
																message:
																	'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
															}
														})}
													/>
													{errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
												</div>

												<Button type='button' className='mt-1' onClick={generatePassword}>
													Generate
												</Button>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
						{/* End: General Info */}

						{/* Start: Contract Info */}
						{isNumberStep === 2 && (
							<>
								<div className='border-b border-solid border-b-gray-300 pb-4'>
									<h3 className='text-sm font-bold text-gray-500'>Bước 2</h3>
									<h2 className='text-lg font-bold text-black'>Thông tin hợp đồng</h2>
								</div>

								<div>
									<h2 className='mb-2 inline-block border-b border-solid border-gray-300'>Contract Infomation</h2>
									<div className='mb-2 grid grid-cols-2 gap-4'>
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
											{errors.role_id && <p className='text-sm text-red-500'>{errors.role_id.message}</p>}
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
											{errors.level_id && <p className='text-sm text-red-500'>{errors.level_id.message}</p>}{' '}
										</div>
									</div>
									<div className='mb-2 grid grid-cols-2 gap-4'>
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
											{errors.base_salary && <p className='text-sm text-red-500'>{errors.base_salary.message}</p>}{' '}
										</div>
										<div className='grid grid-cols-1'>
											<div>
												<label className='text-sm' htmlFor=''>
													<strong>Hệ số lương</strong>
												</label>
												<Input type='number' className='mt-1' value={formData.salary_coefficient} readOnly disabled />
											</div>
											{/* <div>
												<label className='text-sm' htmlFor=''>
													<strong>Ngày công chuẩn</strong>
												</label>
												<Input type='number' className='mt-1' value={20} readOnly disabled />
											</div> */}
										</div>
									</div>
								</div>
								<div className='mb-2 grid grid-cols-2 gap-4'>
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
										{errors.start_date && <p className='text-sm text-red-500'>{errors.start_date.message}</p>}
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
										{errors.end_date && <p className='text-sm text-red-500'>{errors.end_date.message}</p>}
									</div>
								</div>
							</>
						)}
						{/* End: Contract Info */}

						{/* Start: Review & Submit */}
						{isNumberStep === 3 && (
							<>
								<div className='border-b border-solid border-b-gray-300 pb-4'>
									<h3 className='text-sm font-bold text-gray-500'>Bước 3</h3>
									<h2 className='text-lg font-bold text-black'>Xem và xác nhận</h2>
								</div>
								<div>
									<div className='mb-2 grid grid-cols-2 gap-4'>
										<div>
											<h2 className='mb-2 inline-block border-b border-solid border-gray-300'>Thông tin cá nhân</h2>
											{personalInfo.map((item, index) => (
												<label key={index} className='mt-1 flex items-center gap-1 text-sm'>
													<strong>{item.label}:</strong>
													<p>{item.value || 'Chưa có dữ liệu'}</p>
												</label>
											))}

											<h2 className='mb-2 mt-4 inline-block border-b border-solid border-gray-300'>
												Thông tin tài khoản
											</h2>
											{accountInfo.map((item, index) => (
												<label key={index} className='mt-1 flex items-center gap-1 text-sm'>
													<strong>{item.label}:</strong>
													<p>{item.value || 'Chưa có dữ liệu'}</p>
												</label>
											))}
										</div>
										<div>
											<h2 className='mb-2 inline-block border-b border-solid border-gray-300'>Thông tin hợp đồng</h2>
											{contractInfo.map((item, index) => (
												<label key={index} className='mt-1 flex items-center gap-1 text-sm'>
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
										className='rounded-md border bg-black px-4 py-2 text-white transition hover:bg-gray-600'
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
									className='rounded-md border bg-white px-4 py-2 text-black transition hover:bg-gray-100'
								>
									Thoát
								</Button>
								{isNumberStep < 3 ? (
									<Button
										type='button'
										className='rounded-md border bg-black px-4 py-2 text-white transition hover:bg-gray-600'
										// onClick={() => setIsNumberStep(prev => Math.min(3, prev + 1))}
										onClick={handleNextClick}
									>
										Tiếp
									</Button>
								) : (
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<button className='rounded-md border bg-black px-4 py-2 text-white transition hover:bg-gray-600'>
												Xác nhận
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
												<AlertDialogCancel>Thoát</AlertDialogCancel>
												<AlertDialogAction onClick={() => handleSubmitClick(formData)}>Xác nhận</AlertDialogAction>
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

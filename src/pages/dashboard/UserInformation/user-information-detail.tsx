import { fetchProfile } from '@/redux/slices/profileSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { useEffect } from 'react';
import { useForm, UseFormSetError } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateUser } from '@/services/userService';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

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

type Employee = {
	fullName: string;
	gender: string;
	email: string;
	phoneNumber: string;
	dateOfBirth: string;
	address: string;
	username: string;
	password: string | null;
};

export default function UserInformationDetail() {
	const dispatch = useAppDispatch();
	// const { user } = useSelector((state: RootState) => state.user);
	const { users } = useSelector((state: RootState) => state.users);
	const { profile } = useSelector((state: RootState) => state.profile);
	const {
		register,
		reset,
		watch,
		trigger,
		setValue,
		getValues,
		setError,
		formState: { errors }
	} = useForm<Employee>({
		defaultValues: {
			fullName: profile?.fullName,
			gender: profile?.gender,
			email: profile?.email,
			phoneNumber: profile?.phoneNumber,
			dateOfBirth: profile?.dateOfBirth,
			address: profile?.address,
			username: profile?.username,
			password: ''
		}
	});

	const formData = watch();

	useEffect(() => {
		if (profile) {
			reset({
				fullName: profile?.fullName,
				gender: profile?.gender,
				email: profile?.email,
				phoneNumber: profile?.phoneNumber,
				dateOfBirth: profile?.dateOfBirth,
				address: profile?.address,
				username: profile?.username,
				password: ''
			});
		}
	}, [profile, reset]);

	const handleResetClick = () => {
		reset({
			fullName: profile?.fullName,
			gender: profile?.gender,
			email: profile?.email,
			phoneNumber: profile?.phoneNumber,
			dateOfBirth: profile?.dateOfBirth,
			address: profile?.address,
			username: profile?.username,
			password: ''
		});
	};

	const checkUserExistence = (email: string, phone: string, setError: UseFormSetError<Employee>) => {
		const existingEmail = users.find(user => user.email === email && user.id !== profile?.id);
		const existingPhone = users.find(user => user.phone === phone && user.id !== profile?.id);

		if (existingEmail !== profile?.email)

		if (existingEmail || email === 'an.nguyen@example.com') {
			setError('email', { type: 'manual', message: 'Email đã tồn tại' });
		}
		if (existingPhone || phone === '0987654321') {
			setError('phoneNumber', { type: 'manual', message: 'Số điện thoại đã tồn tại' });
		}

		if (existingEmail || email === 'an.nguyen@example.com' || existingPhone || phone === '0987654321') {
			return true;
		}

		return false;
	};

	const handleSubmitClick = async () => {
		const fieldsToValidate = [
			'fullName',
			'gender',
			'email',
			'phoneNumber',
			'dateOfBirth',
			'address',
			'username',
			'password'
		] as const;

		const isValid = await trigger(fieldsToValidate);

		const email = getValues('email');
		const phone = getValues('phoneNumber');
		let isExist = true;

		if (profile?.id) {
			isExist = checkUserExistence(email, phone, setError);
		}

		console.log(isExist);

		if (isValid && !isExist && profile?.id) {
			try {
				const updatedUserData = {
					fullName: formData.fullName,
					phoneNumber: formData.phoneNumber,
					email: formData.email,
					dateOfBirth: formData.dateOfBirth,
					address: formData.address,
					gender: formData.gender,
					username: formData.username,
					password: formData.password || ''
				};

				await updateUser(profile?.id, updatedUserData);
				toast.success('Cập nhật thông tin nhân viên thành công!');

				dispatch(fetchProfile());
			} catch (error) {
				const err = error as AxiosError;

				if (err.response?.status === 400) {
					toast.error('Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
				} else if (err.response?.status === 404) {
					toast.error('Lỗi 404: Không tìm thấy nhân viên.');
				} else if (err.response?.status === 500) {
					toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
				} else {
					toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
				}
			}
		}
	};

	return (
		profile?.id && (
			<div className='h-full max-w-[50vw] rounded-md border border-solid border-gray-200 bg-white px-4 py-6'>
				<h1 className='text-center text-lg font-bold uppercase'>Chào mừng đến với thông tin tài khoản</h1>
				<p className='text-center'>Quản lý thông tin cá nhân, cập nhật hồ sơ và thiết lập tài khoản của bạn tại đây.</p>
				<div className='mt-6 overflow-auto p-4'>
					<span className='mb-5 block border-b-2 border-solid border-gray-200 pb-[2px] text-lg font-bold'>
						<h2>Thông tin cá nhân</h2>
					</span>
					<div className='grid grid-cols-2 gap-4'>
						<div className='grid grid-cols-4 gap-4'>
							<div className='col-span-1'>
								<label htmlFor='id' className='mb-1 block text-sm'>
									<strong>Mã ID</strong>
								</label>
								<Input type='text' id='id' readOnly value={`${profile?.idString}`} disabled />
							</div>
							<div className='col-span-3'>
								<label htmlFor='fullname' className='mb-1 block text-sm'>
									<strong>Họ và tên</strong>
								</label>
								<Input
									type='text'
									id='fullname'
									{...register('fullName', {
										required: 'Vui lòng nhập họ và tên',
										minLength: {
											value: 3,
											message: 'Họ và tên phải có ít nhất 3 ký tự'
										}
									})}
								/>
								{errors.fullName && <p className='text-sm text-red-500'>{errors.fullName.message}</p>}
							</div>
						</div>
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<label htmlFor='gender' className='mb-1 block text-sm'>
									<strong>Giới tính</strong>
								</label>
								<Select
									value={watch('gender')}
									onValueChange={value => setValue('gender', value)}
									{...register('gender', { required: 'Vui lòng chọn giới tính' })}
								>
									<SelectTrigger id='gender' className='w-full rounded-md border p-2 text-sm'>
										<SelectValue placeholder='Chọn giới tính' />
									</SelectTrigger>
									<SelectContent className='z-10 w-full rounded-md border border-gray-300 bg-white shadow-lg'>
										<SelectItem value='MALE' className='w-full flex-1'>
											Nam
										</SelectItem>
										<SelectItem value='FEMALE' className='w-full flex-1'>
											Nữ
										</SelectItem>
									</SelectContent>
								</Select>
								{errors.gender && <p className='text-sm text-red-500'>{errors.gender.message}</p>}
							</div>
							<div>
								<label htmlFor='date_of_birth' className='mb-1 block text-sm'>
									<strong>Ngày sinh</strong>
								</label>
								<Input
									type='date'
									className='block w-full text-sm'
									id='date_of_birth'
									{...register('dateOfBirth', {
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
								{errors.dateOfBirth && <p className='text-sm text-red-500'>{errors.dateOfBirth.message}</p>}
							</div>
						</div>
					</div>

					<div className='mt-4 grid grid-cols-2 gap-4'>
						<div>
							<label htmlFor='email' className='mb-1 block text-sm'>
								<strong>Email</strong>
							</label>
							<Input
								type='email'
								className='block w-full text-sm'
								id='email'
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
						<div>
							<label htmlFor='phone' className='mb-1 block text-sm'>
								<strong>Số điện thoại</strong>
							</label>
							<Input
								type='number'
								className='block w-full text-sm'
								id='phone'
								{...register('phoneNumber', {
									required: 'Vui lòng nhập số điện thoại',
									pattern: {
										value: /^0\d{9}$/,
										message: 'Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng 0'
									}
								})}
							/>
							{errors.phoneNumber && <p className='text-sm text-red-500'>{errors.phoneNumber.message}</p>}{' '}
						</div>
					</div>

					<div className='mt-4 grid grid-cols-1 gap-4'>
						<div>
							<label htmlFor='address' className='mb-1 block text-sm'>
								<strong>Địa chỉ</strong>
							</label>
							<Input
								type='text'
								className='block w-full'
								id='address'
								{...register('address', {
									required: 'Vui lòng nhập địa chỉ',
									minLength: {
										value: 3,
										message: 'Địa chỉ phải có ít nhất 10 ký tự'
									}
									// pattern: {
									// 	value:
									// 		/^\d+\s[\p{L}0-9\s]+,\s(?:Phường|Xã)\s[\p{L}0-9\s]+,\s(?:Quận|Huyện)\s[\p{L}0-9\s]+,\s[\p{L}\s.]+$/u,
									// 	message: 'Địa chỉ không hợp lệ. Ví dụ: 273 An Dương Vương, Phường 3, Quận 5, TP.HCM'
									// }
								})}
							/>
							{errors.address && <p className='text-sm text-red-500'>{errors.address.message}</p>}
						</div>
					</div>

					<span className='mb-5 mt-8 block border-b-2 border-solid border-gray-200 pb-[2px] text-lg font-bold'>
						<h2>Thông tin tài khoản</h2>
					</span>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label htmlFor='username' className='mb-1 block text-sm'>
								<strong>Tên tài khoản</strong>
							</label>
							<Input type='text' className='block w-full' id='username' disabled value={profile?.username} />
						</div>
						<div>
							<label htmlFor='password' className='mb-1 block text-sm'>
								<strong>Mật khẩu (Để trống để giữ nguyên)</strong>
							</label>
							<Input
								type='text'
								className='block w-full'
								id='password'
								{...register('password', {
									pattern: {
										value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
										message: 'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
									}
								})}
							/>
							{errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
						</div>
					</div>
				</div>

				<div className='float-end mt-4 flex items-center justify-center gap-2'>
					<Button
						className='rounded-md border bg-white px-4 py-2 text-black transition hover:bg-gray-100'
						onClick={handleResetClick}
					>
						Reset
					</Button>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button>Thay đổi</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Xác nhận thay đổi thông tin cá nhân</AlertDialogTitle>
								<AlertDialogDescription>Vui lòng kiểm tra lại thông tin trước khi xác nhận.</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Thoát</AlertDialogCancel>
								<AlertDialogAction onClick={handleSubmitClick}>Xác nhận</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		)
	);
}

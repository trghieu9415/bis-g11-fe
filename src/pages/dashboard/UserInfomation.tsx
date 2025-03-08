import { useEffect } from 'react';
import { RootState, useAppDispatch } from '@/redux/store';
import { useSelector } from 'react-redux';
import { fetchUserDetail } from '@/redux/slices/userDetailSlice';
import { fetchUsers } from '@/redux/slices/usersSlice';
import { useForm, UseFormSetError } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, XCircle } from 'lucide-react';

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

export default function UserInfomation() {
	const dispatch = useAppDispatch();
	const { user } = useSelector((state: RootState) => state.user);
	const { users } = useSelector((state: RootState) => state.users);

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
			fullName: user.fullName,
			gender: user.gender,
			email: user.email,
			phoneNumber: user.phoneNumber,
			dateOfBirth: user.dateOfBirth,
			address: user.address,
			username: user.username,
			password: ''
		}
	});

	const formData = watch();

	useEffect(() => {
		if (!user.id) {
			dispatch(fetchUserDetail(2));
		} else {
			reset({
				fullName: user.fullName,
				gender: user.gender,
				email: user.email,
				phoneNumber: user.phoneNumber,
				dateOfBirth: user.dateOfBirth,
				address: user.address,
				username: user.username,
				password: ''
			});
		}

		if (users.length === 0) {
			dispatch(fetchUsers());
		}
	}, [dispatch, user]);

	const handleResetClick = () => {
		reset();
	};

	const checkUserExistence = (userId: number, email: string, phone: string, setError: UseFormSetError<Employee>) => {
		const existingEmail = users.find(user => user.email === email && user.id !== userId);
		const existingPhone = users.find(user => user.phone === phone && user.id !== userId);

		if (existingEmail) {
			setError('email', { type: 'manual', message: 'Email đã tồn tại' });
		}
		if (existingPhone) {
			setError('phoneNumber', { type: 'manual', message: 'Số điện thoại đã tồn tại' });
		}

		if (existingEmail || existingPhone) {
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
		const isExist = checkUserExistence(user.id, email, phone, setError);

		if (isValid && !isExist) {
			console.log(formData);
		}
	};

	// console.log(user);

	return (
		<div className='flex items-start justify-between w-full max-h-[100vh] mb-2 gap-4'>
			<div className='px-4 py-6 border-gray-200 border-solid border rounded-md h-full max-w-[50vw]'>
				<h1 className='text-lg font-bold uppercase text-center'>Chào mừng đến với thông tin tài khoản</h1>
				<p className='text-center'>Quản lý thông tin cá nhân, cập nhật hồ sơ và thiết lập tài khoản của bạn tại đây.</p>
				<div className='mt-6 p-4 overflow-auto'>
					<span className='mb-5 pb-[2px] block font-bold text-lg border-solid border-b-2 border-gray-200'>
						<h2>Thông tin cá nhân</h2>
					</span>
					<div className='grid grid-cols-2 gap-4'>
						<div className='grid grid-cols-4 gap-4'>
							<div className='col-span-1'>
								<label htmlFor='id' className='text-sm mb-1 block'>
									<strong>Mã ID</strong>
								</label>
								<Input type='text' id='id' readOnly value={2} disabled />
							</div>
							<div className='col-span-3'>
								<label htmlFor='fullname' className='text-sm mb-1 block'>
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
								{errors.fullName && <p className='text-red-500 text-sm'>{errors.fullName.message}</p>}
							</div>
						</div>
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<label htmlFor='gender' className='text-sm mb-1 block'>
									<strong>Giới tính</strong>
								</label>
								<Select
									value={watch('gender')}
									onValueChange={value => setValue('gender', value)}
									{...register('gender', { required: 'Vui lòng chọn giới tính' })}
								>
									<SelectTrigger id='gender' className='text-sm w-full border p-2 rounded-md'>
										<SelectValue placeholder='Chọn giới tính' />
									</SelectTrigger>
									<SelectContent className='bg-white border border-gray-300 shadow-lg rounded-md z-10 w-full'>
										<SelectItem value='MALE' className='w-full flex-1'>
											Nam
										</SelectItem>
										<SelectItem value='FEMALE' className='w-full flex-1'>
											Nữ
										</SelectItem>
									</SelectContent>
								</Select>
								{errors.gender && <p className='text-red-500 text-sm'>{errors.gender.message}</p>}
							</div>
							<div>
								<label htmlFor='date_of_birth' className='text-sm mb-1 block'>
									<strong>Ngày sinh</strong>
								</label>
								<Input
									type='date'
									className='text-sm block w-full'
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
								{errors.dateOfBirth && <p className='text-red-500 text-sm'>{errors.dateOfBirth.message}</p>}
							</div>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4 mt-4'>
						<div>
							<label htmlFor='email' className='text-sm mb-1 block'>
								<strong>Email</strong>
							</label>
							<Input
								type='email'
								className='text-sm block w-full'
								id='email'
								{...register('email', {
									required: 'Vui lòng nhập email',
									pattern: {
										value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
										message: 'Email không hợp lệ'
									}
								})}
							/>
							{errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}{' '}
						</div>
						<div>
							<label htmlFor='phone' className='text-sm mb-1 block'>
								<strong>Số điện thoại</strong>
							</label>
							<Input
								type='number'
								className='text-sm block w-full'
								id='phone'
								{...register('phoneNumber', {
									required: 'Vui lòng nhập số điện thoại',
									pattern: {
										value: /^0\d{9}$/,
										message: 'Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng 0'
									}
								})}
							/>
							{errors.phoneNumber && <p className='text-red-500 text-sm'>{errors.phoneNumber.message}</p>}{' '}
						</div>
					</div>

					<div className='grid grid-cols-1 gap-4 mt-4'>
						<div>
							<label htmlFor='address' className='text-sm mb-1 block'>
								<strong>Địa chỉ</strong>
							</label>
							<Input
								type='text'
								className='block w-full'
								id='address'
								{...register('address', {
									required: 'Vui lòng nhập địa chỉ',
									pattern: {
										value:
											/^\d+\s[\p{L}0-9\s]+,\s(?:Phường|Xã)\s[\p{L}0-9\s]+,\s(?:Quận|Huyện)\s[\p{L}0-9\s]+,\s[\p{L}\s.]+$/u,
										message: 'Địa chỉ không hợp lệ. Ví dụ: 273 An Dương Vương, Phường 3, Quận 5, TP.HCM'
									}
								})}
							/>
							{errors.address && <p className='text-red-500 text-sm'>{errors.address.message}</p>}
						</div>
					</div>

					<span className='mt-8 mb-5 pb-[2px] block font-bold text-lg border-solid border-b-2 border-gray-200'>
						<h2>Thông tin tài khoản</h2>
					</span>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label htmlFor='username' className='text-sm mb-1 block'>
								<strong>Tên tài khoản</strong>
							</label>
							<Input type='text' className='block w-full' id='username' disabled value={user.username} />
						</div>
						<div>
							<label htmlFor='password' className='text-sm mb-1 block'>
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
							{errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
						</div>
					</div>
				</div>

				<div className='mt-4 flex justify-center items-center gap-2 float-end'>
					<Button
						className='px-4 py-2 border bg-white text-black rounded-md hover:bg-gray-100 transition'
						onClick={handleResetClick}
					>
						Reset
					</Button>
					<Button onClick={handleSubmitClick}>Submit</Button>
				</div>
			</div>

			<div className='px-4 py-6 flex-1 border-gray-200 border-solid border rounded-md h-full overflow-y-auto max-h-[calc(100vh-60px)]'>
				<h1 className='text-lg font-bold uppercase text-center'>Lịch sử hợp đồng</h1>
				<Input className='mt-2 mb-4' placeholder='Tìm hợp đồng ở đây...' />
				<Accordion type='single' collapsible className='w-full'>
					<AccordionItem value='item-1'>
						<AccordionTrigger>
							CTR-1 - Nhân viên -{' '}
							{new Date('2024-03-05').toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}{' '}
							-{' '}
							{new Date('2026-12-31').toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}
						</AccordionTrigger>
						<AccordionContent>
							<p>
								<strong>Chức vụ:</strong> Nhân viên
							</p>
							<p>
								<strong>Lương cơ bản:</strong> 10,000,000 VND
							</p>
							<p>
								<strong>Hệ số lương:</strong> 1.2
							</p>
							<p>
								<strong>Ngày làm tiêu chuẩn:</strong> 20 ngày/tháng
							</p>
							<p className='flex gap-1'>
								<strong>Trạng thái:</strong>{' '}
								<span className='flex items-center text-green-600 font-bold'>
									<CheckCircle className='w-4 h-4 text-green-600 mr-1' /> Còn hiệu lực
								</span>
								<span className='flex items-center text-red-500 font-bold'>
									<XCircle className='w-4 h-4 text-red-500 mr-1' /> Hết hạn
								</span>
							</p>
							<p>
								<strong>Ngày bắt đầu:</strong>{' '}
								{new Date('2024-03-05').toLocaleDateString('vi-VN', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}{' '}
							</p>
							<p>
								<strong>Ngày kết thúc:</strong>{' '}
								{new Date('2026-12-31').toLocaleDateString('vi-VN', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	);
}

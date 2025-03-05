import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

import fake_data_for_contract from '@/pages/dashboard/hremployees/fake_data_for_contract.json';

export default function EmployeeCreateNew() {
	const [isOpen, setIsOpen] = useState(false);
	const [isNumberStep, setIsNumberStep] = useState(1);

	const {
		register,
		formState: { errors },
		setValue,
		getValues,
		trigger,
		watch,
		reset
	} = useForm({
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

	// Contract info
	const formatSalary = (value: string) => {
		const rawValue = value.replace(/,/g, '');
		if (!/^\d*$/.test(rawValue)) return;
		const formattedValue = new Intl.NumberFormat('en-US').format(Number(rawValue));
		setValue('base_salary', formattedValue, { shouldValidate: true });
	};

	const handleLevelChange = (levelId: string) => {
		const selectedLevel = fake_data_for_contract?.level.find(item => item.id.toString() === levelId);
		if (selectedLevel) {
			setValue('level_id', selectedLevel.id);
			setValue('level_name', selectedLevel.level_name);
			setValue('salary_coefficient', selectedLevel.salary_coefficient);
		}
	};

	const handleRoleChange = (roleId: string) => {
		const selectedRole = fake_data_for_contract?.role.find(item => item.id.toString() === roleId);
		if (selectedRole) {
			setValue('role_id', selectedRole.id);
			setValue('role_name', selectedRole.role_name);
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
		{ label: 'Ngày công chuẩn', value: formData.standard_working_days },
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
			if (isValid) {
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

	const handleSubmitClick = async () => {
		alert('VIẾT THÊM LOGIC GỌI API ĐI!!');
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
						<DialogTitle className='text-2xl font-bold text-center'>Tạo nhân viên & hợp đồng mới</DialogTitle>
						<DialogDescription className='text-center text-gray-500'>
							Điền thông tin để tạo nhân viên và hợp đồng mới
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
												{...register('fullname', {
													required: 'Vui lòng nhập họ và tên',
													minLength: {
														value: 3,
														message: 'Họ và tên phải có ít nhất 3 ký tự'
													}
												})}
											/>
											{errors.fullname && <p className='text-red-500 text-sm'>{errors.fullname.message}</p>}
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
											{errors.phone && <p className='text-red-500 text-sm'>{errors.phone.message}</p>}{' '}
										</div>
									</div>
									<div className='grid grid-cols-2 gap-4 mb-2'>
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
											{errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}{' '}
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
														<p className='text-red-500 text-sm'>{errors.date_of_birth.message}</p>
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
													{errors.gender && <p className='text-red-500 text-sm'>{errors.gender.message}</p>}
												</div>
											</div>
										</div>
									</div>
									<div className='grid grid-cols-1 mb-2'>
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
								</div>
								<div className='mr-2'>
									<h2 className='mb-2 border-solid border-b border-gray-300 inline-block'>Account Info</h2>
									<div className='grid grid-cols-2 gap-4 mb-2'>
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
											{errors.username && <p className='text-red-500 text-sm'>{errors.username.message}</p>}
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
															required: 'Vui lòng nhập tên đăng nhập',
															pattern: {
																value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
																message:
																	'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
															}
														})}
													/>
													{errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
												</div>

												<Button type='button' className='mt-1' onClick={generatePassword}>
													Generate
												</Button>
											</div>
											{/* <p className='text-red-500 text-sm'>Vui lòng nhập họ và tên</p> */}
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
													{fake_data_for_contract?.role.map((item, index) => {
														return (
															<SelectItem value={String(item.id)} key={index}>
																{item.role_name}
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
											>
												<SelectTrigger className='mt-1' id='level'>
													<SelectValue placeholder='Chọn cấp bậc' />
												</SelectTrigger>
												<SelectContent>
													{fake_data_for_contract?.level.map((item, index) => {
														return (
															<SelectItem value={String(item.id)} key={index}>
																{item.level_name}
															</SelectItem>
														);
													})}
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
													required: 'Vui lòng nhập lương cơ bản'
												})}
												onChange={e => formatSalary(e.target.value)}
											/>
											{errors.base_salary && <p className='text-red-500 text-sm'>{errors.base_salary.message}</p>}{' '}
										</div>
										<div className='grid grid-cols-2 gap-4'>
											<div>
												<label className='text-sm' htmlFor=''>
													<strong>Hệ số lương</strong>
												</label>
												<Input type='number' className='mt-1' value={formData.salary_coefficient} readOnly disabled />
											</div>
											<div>
												<label className='text-sm' htmlFor=''>
													<strong>Ngày công chuẩn</strong>
												</label>
												<Input type='number' className='mt-1' value={20} readOnly disabled />
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
													if (selectedDate.getDate() !== 10) {
														return 'Ngày bắt đầu phải là ngày 10 của tháng trong tương lai';
													}

													if (selectedDate < today) {
														return `Ngày bắt đầu phải là ngày 10 của tháng trong tương lai`;
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
													if (endDate.getDate() !== 10) {
														return 'Ngày kết thúc phải vào ngày 10 của tháng';
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

											<h2 className='mb-2 mt-4 border-solid border-b border-gray-300 inline-block'>
												Thông tin tài khoản
											</h2>
											{accountInfo.map((item, index) => (
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
										Prev
									</Button>
								</div>
							)}
							<div className='space-x-2'>
								<Button
									type='button'
									onClick={closeDialog}
									className='px-4 py-2 border bg-white text-black rounded-md hover:bg-gray-100 transition'
								>
									Cancel
								</Button>
								{isNumberStep < 3 ? (
									<Button
										type='button'
										className='px-4 py-2 border bg-black text-white rounded-md hover:bg-gray-600 transition'
										// onClick={() => setIsNumberStep(prev => Math.min(3, prev + 1))}
										onClick={handleNextClick}
									>
										Next
									</Button>
								) : (
									<Button
										type='button'
										className='px-4 py-2 border bg-green-800 text-white rounded-md hover:bg-green-900 transition'
										onClick={handleSubmitClick}
									>
										Submit
									</Button>
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

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import fake_data_for_contract from '@/pages/dashboard/employees/fake_data_for_contract.json';

export default function EmployeeCreateNew() {
	const [isOpen, setIsOpen] = useState(false);
	const [isNumberStep, setIsNumberStep] = useState(1);
	const [formData, setFormData] = useState({
		fullname: '',
		phone: '',
		gender: -1,
		email: '',
		date_of_birth: '',
		address: '',
		username: '',
		password: '',
		base_salary: '',
		role_id: 0,
		role_name: '',
		level_name: '',
		level_id: 0,
		salary_coefficient: 1,
		standard_working_days: 20,
		start_date: '',
		end_date: ''
	});

	// Personal Info
	const generatePassword = () => {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
		const newPassword = Array.from(crypto.getRandomValues(new Uint32Array(12)))
			.map(x => chars[x % chars.length])
			.join('');

		const newUsername = formData?.email.split('@')[0] || '';

		setFormData(prev => ({
			...prev,
			password: newPassword,
			username: newUsername
		}));
	};

	const openDialog = () => {
		setIsOpen(true);
		setIsNumberStep(1);
	};
	const closeDialog = () => setIsOpen(false);

	// Contract info
	const formatSalary = (value: string) => {
		const rawValue = value.replace(/,/g, '');
		if (!/^\d*$/.test(rawValue)) return;
		const formattedValue = new Intl.NumberFormat('en-US').format(Number(rawValue));
		setFormData(prev => ({
			...prev,
			base_salary: formattedValue
		}));
	};

	const handleLevelChange = (levelId: string) => {
		const selectedLevel = fake_data_for_contract?.level.find(item => item.id.toString() === levelId);
		if (selectedLevel) {
			setFormData(prev => ({
				...prev,
				level_id: selectedLevel.id,
				salary_coefficient: selectedLevel.salary_coefficient,
				level_name: selectedLevel.level_name
			}));
		}
	};

	const handleRoleChange = (roleId: string) => {
		const selectedRole = fake_data_for_contract?.role.find(item => item.id.toString() === roleId);
		if (selectedRole) {
			setFormData(prev => ({
				...prev,
				role_id: selectedRole.id,
				role_name: selectedRole.role_name
			}));
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

	console.log(formData);

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
					<form className='space-y-4'>
						{isNumberStep === 1 && (
							<>
								<div className='pb-4 border-b border-solid border-b-gray-300'>
									<h3 className='text-gray-500 font-bold text-sm'>Bước 1</h3>
									<h2 className='text-black font-bold text-lg'>Thông tin cá nhân</h2>
								</div>

								<div>
									<h2 className='mb-2 border-solid border-b border-gray-300 inline-block'>Personal Infomation</h2>
									<div className='grid grid-cols-2 gap-4 mb-2'>
										<div>
											<label className='text-sm' htmlFor=''>
												<strong>Họ và tên</strong>
											</label>
											<Input
												type='text'
												className='mt-1'
												value={formData.fullname}
												onChange={e => setFormData({ ...formData, fullname: e.target.value })}
											/>
										</div>
										<div>
											<label className='text-sm' htmlFor=''>
												<strong>Số điện thoại</strong>
											</label>
											<Input
												type='text'
												className='mt-1'
												value={formData.phone}
												onChange={e => setFormData({ ...formData, phone: e.target.value })}
											/>
										</div>
									</div>
									<div className='grid grid-cols-2 gap-4 mb-2'>
										<div>
											<label className='text-sm' htmlFor=''>
												<strong>Email</strong>
											</label>
											<Input
												type='email'
												className='mt-1'
												value={formData.email}
												onChange={e => setFormData({ ...formData, email: e.target.value })}
											/>
										</div>
										<div className='grid grid-cols-2 gap-4'>
											<div>
												<div>
													<label className='text-sm' htmlFor=''>
														<strong>Ngày sinh</strong>
													</label>
													<Input
														type='date'
														className='mt-1 block'
														value={formData.date_of_birth}
														onChange={e => setFormData({ ...formData, date_of_birth: e.target.value })}
													/>
												</div>
											</div>
											<div>
												<div>
													<label className='text-sm' htmlFor=''>
														<strong>Giới tính</strong>
													</label>
													<Select
														value={formData.gender === 1 ? 'male' : formData.gender === 0 ? 'female' : undefined}
														onValueChange={value => setFormData({ ...formData, gender: value === 'male' ? 1 : 0 })}
													>
														<SelectTrigger className='mt-1'>
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
										<div>
											<label className='text-sm' htmlFor=''>
												<strong>Address</strong>
											</label>
											<Input
												type='text'
												className='mt-1'
												value={formData.address}
												onChange={e => setFormData({ ...formData, address: e.target.value })}
											/>
										</div>
									</div>
								</div>
								<div>
									<h2 className='mb-2 border-solid border-b border-gray-300 inline-block'>Account Info</h2>
									<div className='grid grid-cols-2 gap-4 mb-2'>
										<div>
											<label className='text-sm' htmlFor=''>
												<strong>Tên đăng nhập</strong>
											</label>
											<Input
												type='text'
												className='mt-1'
												value={formData.username}
												onChange={e => setFormData({ ...formData, username: e.target.value })}
											/>
										</div>
										<div>
											<label className='text-sm' htmlFor=''>
												<strong>Mật khẩu</strong>
											</label>
											<div className='flex gap-2'>
												<Input
													type='text'
													value={formData.password}
													onChange={e => setFormData({ ...formData, password: e.target.value })}
													className='mt-1'
												/>
												<Button type='button' className='mt-1' onClick={generatePassword}>
													Generate
												</Button>
											</div>
										</div>
									</div>
								</div>
							</>
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
											<label className='text-sm' htmlFor=''>
												<strong>Vai trò</strong>
											</label>
											<Select
												value={formData.role_id ? String(formData.role_id) : undefined}
												onValueChange={handleRoleChange}
											>
												<SelectTrigger className='mt-1'>
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
										</div>
										<div>
											<label className='text-sm' htmlFor=''>
												<strong>Cấp bậc</strong>
											</label>
											<Select
												value={formData?.level_id ? String(formData?.level_id) : undefined}
												onValueChange={handleLevelChange}
											>
												<SelectTrigger className='mt-1'>
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
										</div>
									</div>
									<div className='grid grid-cols-2 gap-4 mb-2'>
										<div>
											<label className='text-sm' htmlFor=''>
												<strong>Lương cơ bản</strong>
											</label>
											<Input
												type='text'
												className='mt-1'
												value={formData.base_salary}
												onChange={e => formatSalary(e.target.value)}
											/>
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
										<label className='text-sm' htmlFor=''>
											<strong>Ngày bắt đầu</strong>
										</label>
										<Input
											type='date'
											className='mt-1 block'
											value={formData.start_date}
											onChange={e => setFormData({ ...formData, start_date: e.target.value })}
										/>
									</div>
									<div>
										<label className='text-sm' htmlFor=''>
											<strong>Ngày kết thúc</strong>
										</label>
										<Input
											type='date'
											className='mt-1 block'
											value={formData.end_date}
											onChange={e => setFormData({ ...formData, end_date: e.target.value })}
										/>
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
										onClick={() => setIsNumberStep(prev => Math.min(3, prev + 1))}
									>
										Next
									</Button>
								) : (
									<Button
										type='button'
										className='px-4 py-2 border bg-green-800 text-white rounded-md hover:bg-green-900 transition'
										onClick={() => setIsNumberStep(prev => Math.min(3, prev + 1))}
									>
										Submit
									</Button>
								)}
							</div>
						</div>
						{/* End: Actions */}
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}

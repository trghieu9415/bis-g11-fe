import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RootState, useAppDispatch } from '@/redux/store';
import { useSelector } from 'react-redux';
import { fetchUserDetail } from '@/redux/slices/userDetailSlice';
import { fetchAllLeaveRequestsByUserId } from '@/redux/slices/leaveRequestByUserIDSlice';
import { addLeaveRequest } from '@/services/leaveRequestService';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export default function EmployeeLeaveRequest() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const today = new Date();
	const date = today.getDate();
	const month = today.getMonth() + 1;
	const year = today.getFullYear();

	const dispatch = useAppDispatch();
	// const { user } = useSelector((state: RootState) => state.user);
	const user = JSON.parse(localStorage.getItem('profile') || '{}');

	const {
		register,
		watch,
		setValue,
		trigger,
		getValues,
		reset,
		formState: { errors }
	} = useForm({
		defaultValues: {
			title: '',
			description: '',
			startDate: '',
			endDate: '',
			typeLeave: ''
		}
	});

	const formData = watch();

	useEffect(() => {
		if (isDialogOpen) {
			reset();
		}
	}, [isDialogOpen]);

	useEffect(() => {
		// if (!user.id) {
		// 	dispatch(fetchUserDetail(2));
		// }

		if (!formData.startDate) {
			setValue('endDate', '');
		}
	}, [dispatch, formData.startDate]);

	const getMaxLeaveDays = () => {
		switch (formData.typeLeave) {
			case 'PAID_LEAVE':
				return 1;
			case 'MATERNITY_LEAVE':
				if (user.gender === 'MALE') {
					return 7;
				}
				return 180;
			case 'SICK_LEAVE':
				return 7;
			default:
				return 0;
		}
	};

	const handleSubmitClick = async () => {
		const fieldsToValidate = ['title', 'description', 'startDate', 'endDate', 'typeLeave'] as const;

		const isValid = await trigger(fieldsToValidate);
		if (isValid) {
			try {
				const leaveReqObject = {
					title: formData.title,
					startDate: formData.startDate,
					endDate: formData.endDate,
					description: formData.description,
					leaveReason: formData.typeLeave,
					userId: user.id
				};
				const res = await addLeaveRequest(leaveReqObject);
				if (res?.data) {
					dispatch(fetchAllLeaveRequestsByUserId(user.id));
					toast.success('Thêm đơn xin nghỉ phép thành công!');
					setIsDialogOpen(false);
				}
			} catch (error) {
				const err = error as AxiosError;

				if (err.response?.status === 400) {
					toast.error(
						(err.response.data as { message?: string }).message ||
							'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
					);
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
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' className='h-[32px] w-full items-center justify-start border-none px-[8px] py-[6px]'>
					<BadgeCheck />
					Xin nghỉ phép
				</Button>
			</DialogTrigger>
			<DialogContent className='!h-[90vh] !w-[50vw] !max-w-none' onOpenAutoFocus={e => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle>Đơn xin nghỉ phép</DialogTitle>
					<DialogDescription>
						Vui lòng điền đầy đủ thông tin vào đơn xin nghỉ việc để công ty có thể xử lý yêu cầu của bạn một cách nhanh
						chóng và thuận tiện. Đảm bảo rằng bạn tuân thủ thời gian báo trước theo quy định của công ty.
					</DialogDescription>
				</DialogHeader>
				<div className='flex flex-col gap-2'>
					<span className='text-base'>
						<strong>Nội dung đơn</strong>
					</span>
					<div>
						<div className='max-h-[500px] overflow-x-auto rounded-sm border border-solid border-gray-200 p-4'>
							<input
								type='text'
								className='mx-auto my-3 block w-full border-none text-center font-bold outline-none'
								placeholder='Nhập tiêu đề ở đây...'
								{...register('title', {
									required: 'Vui lòng nhập tiêu đề'
								})}
							/>
							{errors.title && <p className='mb-2 text-center text-sm text-red-500'>{errors.title.message}</p>}
							<p className='text-gray-900'>
								<strong className='italic underline'>Kính gửi:</strong> Trưởng phòng Nhân sự
							</p>
							<p className='text-gray-900'>
								<strong>Tên tôi là:</strong> {user.fullName}
							</p>
							<p className='text-gray-900'>
								<strong>Chức vụ:</strong> {user.resContractDTO?.roleName}
							</p>
							<div className='flex items-center justify-start gap-2'>
								<strong className='text-base text-gray-900'>Loại nghỉ phép: </strong>
								<Select
									{...register('typeLeave', { required: 'Vui lòng chọn loại nghỉ' })}
									onValueChange={value => setValue('typeLeave', value)}
								>
									<SelectTrigger id='typeLeave' className='h-[24px] max-w-[250px] text-base'>
										<SelectValue placeholder='Chọn loại nghỉ phép' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='PAID_LEAVE'>Nghỉ phép</SelectItem>
										<SelectItem value='MATERNITY_LEAVE'>Nghỉ thai sản</SelectItem>
										<SelectItem value='SICK_LEAVE'>Nghỉ bệnh</SelectItem>
									</SelectContent>
								</Select>
								{errors.typeLeave && <p className='text-sm text-red-500'>({errors.typeLeave.message})</p>}
							</div>
							<div className='mt-4 text-black'>
								<div>
									{date} tháng {month}, {year}. Nay tôi làm đơn này, kính xin Trường phòng Nhân sự cho tôi xin nghỉ phép
									từ ngày{' '}
									<input
										type='date'
										id='startDate'
										className='mr-1 h-[24px] w-[140px] rounded-sm border border-gray-200 p-1'
										disabled={!formData.typeLeave}
										{...register('startDate', {
											required: 'Vui lòng chọn ngày bắt đầu',
											validate: value => {
												const today = new Date();
												today.setHours(0, 0, 0, 0);
												const selectedDate = new Date(value);
												selectedDate.setHours(0, 0, 0, 0);

												return selectedDate >= today || 'Ngày bắt đầu phải là ngày hôm nay hoặc sau hôm nay';
											}
										})}
									/>
									{errors.startDate && (
										<p className='mr-1 inline-block text-sm text-red-500'>({errors.startDate.message})</p>
									)}
									đến ngày{' '}
									<input
										type='date'
										className='mr-1 h-[24px] w-[140px] rounded-sm border border-gray-200 p-1'
										id='endDate'
										disabled={!formData.startDate}
										{...register('endDate', {
											required: 'Vui lòng chọn ngày kết thúc',
											validate: value => {
												if (!formData.startDate || value < formData.startDate) {
													return 'Ngày kết thúc phải sau ngày bắt đầu';
												} else {
													if (formData.startDate && formData.typeLeave) {
														const maxDays = getMaxLeaveDays();
														const start = new Date(formData.startDate);
														const end = new Date(value);

														const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
														// Day offs = Start date - End Date + 1
														if (diffDays + 1 > maxDays) return `Bạn chỉ được nghỉ tối đa ${maxDays} ngày`;
													}
												}
											}
										})}
									/>
									{errors.endDate && (
										<p className='mr-1 inline-block text-sm text-red-500'>({errors.endDate.message})</p>
									)}
								</div>
								<div className='mt-3'>
									<Textarea
										className='min-h-[150px] resize-none'
										placeholder='Mô tả chi tiết nội dung ở đây...'
										{...register('description', {
											required: 'Vui lòng nhập mô tả chi tiết nội dung'
										})}
									/>
									{errors.description && <p className='text-sm text-red-500'>{errors.description.message}</p>}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='flex items-center justify-end gap-2'>
					<Button
						onClick={() => setIsDialogOpen(false)}
						className='rounded-md border bg-white px-4 py-2 text-black transition hover:bg-gray-100'
					>
						Cancel
					</Button>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button className='rounded-md border bg-black px-4 py-2 text-white transition hover:bg-gray-600'>
								Submit
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Xác nhận nộp đơn xin nghỉ phép</AlertDialogTitle>
								<AlertDialogDescription>
									Vui lòng kiểm tra lại thông tin trước khi xác nhận. Sau khi nộp, đơn sẽ được lưu và không thể chỉnh
									sửa.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleSubmitClick}>Confirm</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</DialogContent>
		</Dialog>
	);
}

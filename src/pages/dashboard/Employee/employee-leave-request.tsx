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
	const { user } = useSelector((state: RootState) => state.user);

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
		if (!user.id) {
			dispatch(fetchUserDetail(2));
		}

		if (!formData.startDate) {
			setValue('endDate', '');
		}
	}, [dispatch, formData.startDate]);

	const getMaxLeaveDays = () => {
		switch (formData.typeLeave) {
			case 'PAID_LEAVE':
				return 12;
			case 'MATERNITY_LEAVE':
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
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' className='border-none h-[32px] py-[6px] px-[8px] w-full justify-start items-center'>
					<BadgeCheck />
					Xin nghỉ phép
				</Button>
			</DialogTrigger>
			<DialogContent className='!w-[50vw] !max-w-none !h-[90vh]' onOpenAutoFocus={e => e.preventDefault()}>
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
						<div className='p-4 max-h-[500px] overflow-x-auto border border-solid border-gray-200 rounded-sm'>
							<input
								type='text'
								className='outline-none border-none font-bold w-full text-center mx-auto my-3 block'
								placeholder='Nhập tiêu đề ở đây...'
								{...register('title', {
									required: 'Vui lòng nhập tiêu đề'
								})}
							/>
							{errors.title && <p className='text-red-500 text-sm text-center mb-2'>{errors.title.message}</p>}
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
								<strong className='text-gray-900 text-base'>Loại nghỉ phép: </strong>
								<Select
									{...register('typeLeave', { required: 'Vui lòng chọn loại nghỉ' })}
									onValueChange={value => setValue('typeLeave', value)}
								>
									<SelectTrigger id='typeLeave' className='max-w-[250px] h-[24px] text-base'>
										<SelectValue placeholder='Chọn loại nghỉ phép' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='PAID_LEAVE'>Nghỉ phép</SelectItem>
										<SelectItem value='MATERNITY_LEAVE'>Nghỉ thai sản</SelectItem>
										<SelectItem value='SICK_LEAVE'>Nghỉ ốm</SelectItem>
									</SelectContent>
								</Select>
								{errors.typeLeave && <p className='text-red-500 text-sm'>({errors.typeLeave.message})</p>}
							</div>
							<div className='text-black mt-4'>
								<div>
									{date} tháng {month}, {year}. Nay tôi làm đơn này, kính xin Trường phòng Nhân sự cho tôi xin nghỉ phép
									từ ngày{' '}
									<input
										type='date'
										id='startDate'
										className='w-[140px] border border-gray-200 rounded-sm p-1 mr-1 h-[24px]'
										disabled={!formData.typeLeave}
										{...register('startDate', {
											required: 'Vui lòng chọn ngày bắt đầu',
											validate: value => {
												const today = new Date();
												today.setHours(0, 0, 0, 0);
												const selectedDate = new Date(value);
												selectedDate.setHours(0, 0, 0, 0);

												return selectedDate > today || 'Ngày bắt đầu phải sau hôm nay';
											}
										})}
									/>
									{errors.startDate && (
										<p className='text-red-500 text-sm inline-block mr-1'>({errors.startDate.message})</p>
									)}
									đến ngày{' '}
									<input
										type='date'
										className='w-[140px] border border-gray-200 rounded-sm p-1 mr-1 h-[24px]'
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
														if (diffDays > maxDays) return `(Bạn chỉ được nghỉ tối đa ${maxDays} ngày)`;
													}
												}
											}
										})}
									/>
									{errors.endDate && (
										<p className='text-red-500 text-sm inline-block mr-1'>({errors.endDate.message})</p>
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
									{errors.description && <p className='text-red-500 text-sm'>{errors.description.message}</p>}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='flex items-center justify-end gap-2'>
					<Button
						onClick={() => setIsDialogOpen(false)}
						className='px-4 py-2 border bg-white text-black rounded-md hover:bg-gray-100 transition'
					>
						Cancel
					</Button>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button className='px-4 py-2 border bg-black text-white rounded-md hover:bg-gray-600 transition'>
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

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

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
import { fetchHolidays } from '@/redux/slices/holidaysSlice';
import { useAppDispatch } from '@/redux/store';
import { addHoliday } from '@/services/holidayService';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface HolidayFormData {
	name: string;
	startDate: string;
	endDate: string;
	description: string;
}

interface EventType {
	end: string;
	id: number;
	start: string;
	title: string;
	description: string;
}

interface HolidayCreateNewProps {
	onCreateSuccess: (newHoliday: EventType) => void;
}

export default function HolidayCreateNew({ onCreateSuccess }: HolidayCreateNewProps) {
	const handleCreateNew = (newHoliday: EventType) => {
		onCreateSuccess(newHoliday);
	};

	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useAppDispatch();

	const {
		register,
		formState: { errors },
		trigger,
		watch,
		reset
	} = useForm<HolidayFormData>({
		defaultValues: {
			name: '',
			startDate: '',
			endDate: '',
			description: ''
		}
	});

	const formData = watch();

	const openDialog = () => {
		reset();
		setIsOpen(true);
	};
	const closeDialog = () => setIsOpen(false);

	const handleSubmitClick = async (data: HolidayFormData) => {
		const fieldsToValidate = ['name', 'description', 'startDate', 'endDate'] as const;

		const isValid = await trigger(fieldsToValidate);
		if (isValid) {
			const holidayData = {
				name: data.name,
				startDate: data.startDate,
				endDate: data.endDate,
				description: data.description
			};

			try {
				const res = await addHoliday(holidayData);
				toast.success('Thêm lịch nghỉ lễ thành công thành công!');
				dispatch(fetchHolidays());
				setIsOpen(false);

				// Return data to holidays component
				const eventTypeDate = {
					calendarId: res?.data?.idString,
					end: res?.data?.endDate,
					id: res?.data?.id,
					start: res?.data?.startDate,
					description: res?.data?.description,
					title: res?.data?.name
				};
				handleCreateNew(eventTypeDate);
			} catch (error) {
				const err = error as AxiosError;
				if (err.response?.status === 400) {
					toast.error(
						(err.response.data as { message?: string }).message ||
							'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
					);
				} else if (err.response?.status === 404) {
					toast.error('Lỗi 404: Không tìm thấy lịch nghỉ lễ.');
				} else if (err.response?.status === 500) {
					toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
				} else {
					toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
				}
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
						<DialogTitle className='text-2xl font-bold text-center'>Tạo lịch nghỉ lễ mới</DialogTitle>
						<DialogDescription className='text-center text-gray-500'>Điền thông tin lịch nghỉ lễ mới</DialogDescription>
					</DialogHeader>

					{/* Start: Main content */}
					<div className='space-y-4'>
						<div className='overflow-y-auto max-h-[55vh] pl-1'>
							<div className='mr-2'>
								<div className='grid grid-cols-1 gap-4 mb-2'>
									<div>
										<label className='text-sm' htmlFor='name'>
											<strong>Tên ngày lễ</strong>
										</label>
										<Input
											id='name'
											type='text'
											className='mt-1'
											{...register('name', {
												required: 'Vui lòng nhập tên ngày lễ',
												minLength: {
													value: 3,
													message: 'Tên ngày lễ phải có ít nhất 3 ký tự'
												}
											})}
										/>
										{errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
									</div>
								</div>
								<div className='grid grid-cols-2 gap-4 mb-2'>
									<div>
										<label className='text-sm' htmlFor='startDate'>
											<strong>Ngày bắt đầu</strong>
										</label>
										<Input
											id='startDate'
											type='date'
											className='mt-1 block'
											{...register('startDate', {
												required: 'Vui lòng chọn ngày bắt đầu',
												validate: value => {
													const today = new Date();
													const selectedDate = new Date(value);
													if (selectedDate <= today) {
														return 'Ngày bắt đầu phải lớn hơn ngày hôm nay';
													}
													return true;
												}
											})}
										/>
										{errors.startDate && <p className='text-red-500 text-sm'>{errors.startDate.message}</p>}
									</div>
									<div>
										<label className='text-sm' htmlFor='endDate'>
											<strong>Ngày kết thúc</strong>
										</label>
										<Input
											id='endDate'
											type='date'
											className='mt-1 block'
											{...register('endDate', {
												required: 'Vui lòng chọn ngày kết thúc',
												validate: value => {
													if (formData?.startDate) {
														const startDate = new Date(formData.startDate);
														const endDate = new Date(value);

														if (startDate > endDate) {
															return 'Ngày kết thúc phải lớn hơn hoặc ngày bắt đầu';
														}
														return true;
													}
												}
											})}
										/>
										{errors.endDate && <p className='text-red-500 text-sm'>{errors.endDate.message}</p>}
									</div>
								</div>
								<div className='grid grid-cols-1 gap-4 mb-2'>
									<div>
										<label className='text-sm' htmlFor='fullname'>
											<strong>Mô tả</strong>
										</label>
										<Textarea
											className='min-h-[150px] resize-none'
											placeholder='Mô tả chi tiết ngày nghĩ lễ ở đây...'
											{...register('description', {
												required: 'Vui lòng nhập mô tả chi tiết ngày nghĩ lễ'
											})}
										/>
										{errors.description && <p className='text-red-500 text-sm'>{errors.description.message}</p>}
									</div>
								</div>
							</div>
						</div>
						<div className={`flex justify-end pt-4`}>
							<div className='space-x-2'>
								<Button
									type='button'
									onClick={closeDialog}
									className='px-4 py-2 border bg-white text-black rounded-md hover:bg-gray-100 transition'
								>
									Thoát
								</Button>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<button className='px-4 py-2 border bg-black text-white rounded-md hover:bg-gray-600 transition'>
											Xác nhận
										</button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Xác nhận thêm lịch nghỉ lễ</AlertDialogTitle>
											<AlertDialogDescription>
												Bạn có chắc chắn muốn thêm lịch nghĩ lễ này vào hệ thống? Các thông tin sẽ được lưu trữ và không
												thể thay đổi khi ngày nghỉ lễ bắt đầu.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Thoát</AlertDialogCancel>
											<AlertDialogAction onClick={() => handleSubmitClick(formData)}>Xác nhận</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</div>
						{/* End: Actions */}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

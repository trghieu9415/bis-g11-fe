import { RootState, useAppDispatch } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AxiosError } from 'axios';
import { CheckCircle, Clock, HelpCircle, Info, ListRestart, Trash2, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

import { fetchAllLeaveRequestsByUserId } from '@/redux/slices/leaveRequestByUserIDSlice';
import { deleteLeaveRequest } from '@/services/leaveRequestService';
import { useForm } from 'react-hook-form';

interface ApiResponse {
	id: number;
	idString: string;
	title: string;
	startDate: string;
	endDate: string;
	sendDate: string;
	description: string;
	leaveReason: number;
	updatedAt: string;
	status: number;
	userId: number;
}

export default function UserInformationLeaveRequestsHistory() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [filteredLeaveRequests, setFilteredLeaveRequests] = useState<ApiResponse[]>([]);
	const [openItem, setOpenItem] = useState('');

	const dispatch = useAppDispatch();
	// const { user } = useSelector((state: RootState) => state.user);
	const { leaveRequests } = useSelector((state: RootState) => state.leaveRequestByUserID);
	const { profile } = useSelector((state: RootState) => state.profile);

	const {
		register,
		handleSubmit,
		watch,
		setError,
		clearErrors,
		setValue,
		reset,
		trigger,
		formState: { errors }
	} = useForm({
		defaultValues: {
			startDate: '',
			endDate: ''
		}
	});

	const formData = watch();

	useEffect(() => {
		if (leaveRequests?.length == 0 && profile?.id) {
			dispatch(fetchAllLeaveRequestsByUserId(profile.id));
		}
	}, [dispatch, profile]);

	useEffect(() => {
		if (leaveRequests && leaveRequests.length > 0) {
			setFilteredLeaveRequests(leaveRequests);
		}
	}, [leaveRequests]);

	useEffect(() => {
		if (filteredLeaveRequests.length > 0) {
			setOpenItem(`item-${filteredLeaveRequests[0].id}`);
		}
	}, [filteredLeaveRequests]);

	const handleSearch = async () => {
		const fieldsToValidate = ['startDate', 'endDate'] as const;
		const isValid = await trigger(fieldsToValidate);

		if (isValid) {
			const filteredRequests = leaveRequests.filter(item => {
				const itemStartDate = new Date(item.startDate);
				const itemEndDate = new Date(item.endDate);
				const filterStartDate = formData.startDate ? new Date(formData.startDate) : null;
				const filterEndDate = formData.endDate ? new Date(formData.endDate) : null;

				return (
					(!filterStartDate || itemStartDate >= filterStartDate) && (!filterEndDate || itemEndDate <= filterEndDate)
				);
			});

			setFilteredLeaveRequests(filteredRequests);
		}
	};

	const handleReset = () => {
		reset();
		setFilteredLeaveRequests(leaveRequests);
	};

	const handleDeleteClick = async (leaveRequestID: number) => {
		try {
			if (!profile?.id) {
				toast.error('Không tìm thấy thông tin người dùng.');
				return;
			}
			await deleteLeaveRequest(leaveRequestID);
			dispatch(fetchAllLeaveRequestsByUserId(profile?.id));
			toast.success('Hủy đơn xin nghỉ phép thành công!');
			setIsDialogOpen(false);
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
	};

	return (
		<div className='relative h-full max-h-[100%] w-full flex-1 overflow-hidden rounded-md border border-solid border-gray-200 bg-white px-4 py-6'>
			<h1 className='text-center text-lg font-bold uppercase'>Lịch sử đơn xin nghỉ phép</h1>
			<div className='mt-2 flex items-center justify-center gap-2'>
				<div className='mb-4 flex gap-2'>
					<div>
						<Input
							type='date'
							placeholder='Từ ngày'
							{...register('startDate', { required: 'Vui lòng chọn ngày bắt đầu' })}
						/>
						{errors.startDate && <p className='mb-2 text-start text-sm text-red-500'>{errors.startDate.message}</p>}
					</div>

					<div>
						<Input
							type='date'
							placeholder='Đến ngày'
							disabled={!formData.startDate}
							{...register('endDate', {
								validate: value => {
									const startDate = watch('startDate');

									if (!startDate || !value || value >= startDate) {
										return true;
									}

									return 'Ngày kết thúc phải sau ngày bắt đầu';
								}
							})}
						/>
						{errors.endDate && <p className='mb-2 text-start text-sm text-red-500'>{errors.endDate.message}</p>}
					</div>
					<Button variant='outline' onClick={handleReset}>
						<ListRestart />
					</Button>
					<Button onClick={handleSearch}>Tìm kiếm</Button>
				</div>
			</div>
			<Accordion
				type='single'
				collapsible
				className='absolute left-4 h-[64%] w-[calc(100%-20px)] overflow-y-auto pr-4'
				value={openItem}
				onValueChange={value => setOpenItem(value)}
			>
				{filteredLeaveRequests.length > 0 && profile?.resContractDTO?.roleName !== 'ADMIN' ? (
					filteredLeaveRequests.map((item, index) => {
						return (
							<AccordionItem value={`item-${item.id}`} key={index}>
								<AccordionTrigger>
									{/* {`${item.idString} - ${item.leaveReason === 1 ? 'Nghỉ bệnh' : item.leaveReason === 2 ? 'Nghỉ phép' : 'Nghỉ thai sản'} - `} */}
									{`${item.idString} - `}
									{new Date(item.startDate).toLocaleDateString('vi-VN', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric'
									})}
									{' đến '}
									{new Date(item.endDate).toLocaleDateString('vi-VN', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric'
									})}
									{item.status === 1 ? (
										<span className='float-end mr-2 flex flex-1 items-center justify-end font-bold text-green-600'>
											<CheckCircle className='mr-1 h-4 w-4 text-green-600' /> Đã duyệt
										</span>
									) : item.status === 2 ? (
										<span className='float-end mr-2 flex flex-1 items-center justify-end font-bold text-yellow-500'>
											<Clock className='mr-1 h-4 w-4 text-yellow-500' /> Đang chờ duyệt
										</span>
									) : item.status === 3 ? (
										<span className='float-end mr-2 flex flex-1 items-center justify-end font-bold text-red-500'>
											<XCircle className='mr-1 h-4 w-4 text-red-500' /> Bị từ chối
										</span>
									) : item.status === 0 ? (
										<span className='float-end mr-2 flex flex-1 items-center justify-end font-bold text-gray-400'>
											<XCircle className='mr-1 h-4 w-4 text-gray-400' /> Đã hủy
										</span>
									) : (
										<span className='float-end mr-2 flex flex-1 items-center justify-end font-bold text-gray-400'>
											<HelpCircle className='mr-1 h-4 w-4 text-gray-400' /> Không xác định
										</span>
									)}
								</AccordionTrigger>
								<AccordionContent>
									<p>
										<strong>Tiêu đề:</strong> {item.title}
									</p>
									<p>
										<strong>Loại nghỉ phép:</strong>{' '}
										{item.leaveReason === 1 ? 'Nghỉ bệnh' : item.leaveReason === 2 ? 'Nghỉ phép' : 'Nghỉ thai sản'}
									</p>
									{/* <p>
									<strong>Mô tả:</strong> {item.description}
								</p> */}
									<p>
										<strong>Ngày gửi đơn:</strong>{' '}
										{new Date(item.sendDate).toLocaleDateString('vi-VN', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric'
										})}
									</p>
									{/* <p>
									<strong>Ngày bắt đầu:</strong>{' '}
									{new Date(item.startDate).toLocaleDateString('vi-VN', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric'
									})}
								</p>
								<p>
									<strong>Ngày kết thúc:</strong>{' '}
									{new Date(item.endDate).toLocaleDateString('vi-VN', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric'
									})}
								</p> */}
									{/* <p className='flex gap-1'>
									<strong>Trạng thái:</strong>{' '}
									{item.status === 1 ? (
										<span className='flex items-center text-green-600 font-bold'>
											<CheckCircle className='w-4 h-4 text-green-600 mr-1' /> Đã duyệt
										</span>
									) : item.status === 2 ? (
										<span className='flex items-center text-yellow-500 font-bold'>
											<Clock className='w-4 h-4 text-yellow-500 mr-1' /> Đang chờ duyệt
										</span>
									) : item.status === 3 ? (
										<span className='flex items-center text-red-500 font-bold'>
											<XCircle className='w-4 h-4 text-red-500 mr-1' /> Bị từ chối
										</span>
									) : (
										<span className='flex items-center text-gray-400 font-bold'>
											<HelpCircle className='w-4 h-4 text-gray-400 mr-1' /> Không xác định
										</span>
									)}
								</p> */}
									<div className='mt-4 flex items-center justify-end gap-1'>
										<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
											<DialogTrigger asChild>
												<Button className='h-[32px] w-full items-center justify-start border-none bg-gray-100 px-[8px] py-[6px] text-black hover:bg-gray-200'>
													<Info /> Chi tiết
												</Button>
											</DialogTrigger>
											<DialogContent
												className='h-[570px] !max-h-[90vh] !w-[50vw] !max-w-none'
												onOpenAutoFocus={e => e.preventDefault()}
											>
												<DialogHeader>
													<DialogTitle>Nội dung đơn xin nghỉ phép</DialogTitle>
													<DialogDescription>
														Chi tiết về đơn xin nghỉ phép của bạn, bao gồm thời gian nghỉ, lý do và trạng thái phê
														duyệt.
													</DialogDescription>
												</DialogHeader>
												<div className='flex max-h-[50vh] flex-col gap-2'>
													<div className='h-full'>
														<div className='h-full max-w-[690px] rounded-sm border border-solid border-gray-200 p-4'>
															<div className='float-end text-sm'>
																{item.status === 1 ? (
																	<span className='flex items-center font-bold text-green-600'>
																		<CheckCircle className='mr-1 h-4 w-4 text-green-600' /> Đã duyệt
																	</span>
																) : item.status === 2 ? (
																	<span className='flex items-center font-bold text-yellow-500'>
																		<Clock className='mr-1 h-4 w-4 text-yellow-500' /> Đang chờ duyệt
																	</span>
																) : item.status === 3 ? (
																	<span className='flex items-center font-bold text-red-500'>
																		<XCircle className='mr-1 h-4 w-4 text-red-500' /> Bị từ chối
																	</span>
																) : item.status === 0 ? (
																	<span className='float-end mr-2 flex flex-1 items-center justify-end font-bold text-gray-400'>
																		<XCircle className='mr-1 h-4 w-4 text-gray-400' /> Đã hủy
																	</span>
																) : (
																	<span className='flex items-center font-bold text-gray-400'>
																		<HelpCircle className='mr-1 h-4 w-4 text-gray-400' /> Không xác định
																	</span>
																)}
															</div>
															<input
																type='text'
																className='mx-auto my-3 block w-full border-none text-center font-bold outline-none'
																value={item.title}
															/>

															<div className='max-h-[calc(100%-55px)] overflow-y-auto pl-2'>
																<p className='text-gray-900'>
																	<strong className='italic underline'>Kính gửi:</strong> Trưởng phòng Nhân sự
																</p>
																<p className='text-gray-900'>
																	<strong>Tên tôi là:</strong> {profile?.fullName}
																</p>
																<p className='text-gray-900'>
																	<strong>Chức vụ:</strong> {profile?.resContractDTO?.roleName}
																</p>
																<div className='flex items-center justify-start gap-2'>
																	<strong className='text-base text-gray-900'>Loại nghỉ phép: </strong>
																	{`${item.leaveReason === 1 ? 'Nghỉ bệnh' : item.leaveReason === 2 ? 'Nghỉ phép' : 'Nghỉ thai sản'}`}
																</div>
																<div className='mt-4 text-black'>
																	<div>
																		{new Date(item.sendDate).toLocaleDateString('vi-VN', {
																			day: 'numeric',
																			month: 'long',
																			year: 'numeric'
																		})}
																		. Nay tôi làm đơn này, kính xin Trường phòng Nhân sự cho tôi xin nghỉ phép từ ngày{' '}
																		{new Date(item.startDate).toLocaleDateString('vi-VN', {
																			day: 'numeric',
																			month: 'long',
																			year: 'numeric'
																		})}{' '}
																		đến ngày{' '}
																		{new Date(item.endDate).toLocaleDateString('vi-VN', {
																			day: 'numeric',
																			month: 'long',
																			year: 'numeric'
																		})}
																	</div>
																	<div className='mt-3'>
																		<p className='min-h-[100px] overflow-hidden whitespace-pre-wrap break-words'>
																			{item.description}
																		</p>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div
													className={`flex items-center ${item.status === 2 ? 'justify-between' : 'justify-end'} gap-2`}
												>
													{item.status === 2 && (
														<AlertDialog>
															<AlertDialogTrigger asChild>
																<Button className='rounded-md border bg-red-500 px-4 py-2 text-white transition hover:bg-red-600'>
																	<Trash2 />
																	Hủy
																</Button>
															</AlertDialogTrigger>
															<AlertDialogContent>
																<AlertDialogHeader>
																	<AlertDialogTitle>Xác nhận hủy đơn xin nghỉ phép</AlertDialogTitle>
																	<AlertDialogDescription>
																		Vui lòng kiểm tra lại thông tin trước khi xác nhận. Sau khi hủy, đơn sẽ được hủy bỏ
																		và không thể phục hồi!
																	</AlertDialogDescription>
																</AlertDialogHeader>
																<AlertDialogFooter>
																	<AlertDialogCancel>Thoát</AlertDialogCancel>
																	<AlertDialogAction
																		onClick={() => {
																			handleDeleteClick(item.id);
																		}}
																	>
																		Xác nhận
																	</AlertDialogAction>
																</AlertDialogFooter>
															</AlertDialogContent>
														</AlertDialog>
													)}
													<Button
														onClick={() => setIsDialogOpen(false)}
														className='rounded-md border bg-black px-4 py-2 text-white transition hover:bg-gray-800'
													>
														Thoát
													</Button>
												</div>
											</DialogContent>
										</Dialog>
									</div>
								</AccordionContent>
							</AccordionItem>
						);
					})
				) : (
					<p className='py-4 text-center text-gray-500'>Không có đơn xin nghỉ phép</p>
				)}
			</Accordion>
		</div>
	);
}

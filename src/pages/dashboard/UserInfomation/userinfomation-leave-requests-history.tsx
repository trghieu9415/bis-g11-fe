import { RootState, useAppDispatch } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Clock, HelpCircle, Info, Trash2, XCircle, ListRestart } from 'lucide-react';
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
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

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

export default function UserInfomationLeaveRequestsHistory() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [filteredLeaveRequests, setFilteredLeaveRequests] = useState<ApiResponse[]>([]);

	const dispatch = useAppDispatch();
	const { user } = useSelector((state: RootState) => state.user);
	const { leaveRequests } = useSelector((state: RootState) => state.leaveRequestByUserID);

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
		if (leaveRequests?.length == 0 && user?.id) {
			dispatch(fetchAllLeaveRequestsByUserId(user.id));
		}
	}, [dispatch, user]);

	useEffect(() => {
		if (leaveRequests && leaveRequests.length > 0) {
			setFilteredLeaveRequests(leaveRequests);
		}
	}, [leaveRequests]);

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

	const handleDeleleClick = async (leaveRequestID: number) => {
		try {
			await deleteLeaveRequest(leaveRequestID);
			dispatch(fetchAllLeaveRequestsByUserId(user.id));
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
		<div className='px-4 py-6 flex-1 w-full border-gray-200 border-solid border rounded-md h-full max-h-[50%] overflow-hidden relative'>
			<h1 className='text-lg font-bold uppercase text-center '>Lịch sử đơn xin nghỉ phép</h1>
			<div className='flex justify-center items-center gap-2 mt-2 '>
				<div className='flex gap-2 mb-4'>
					<div>
						<Input
							type='date'
							placeholder='Từ ngày'
							{...register('startDate', { required: 'Vui lòng chọn ngày bắt đầu' })}
						/>
						{errors.startDate && <p className='text-red-500 text-sm text-start mb-2'>{errors.startDate.message}</p>}
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
						{errors.endDate && <p className='text-red-500 text-sm text-start mb-2'>{errors.endDate.message}</p>}
					</div>
					<Button variant='outline' onClick={handleReset}>
						<ListRestart />
					</Button>
					<Button onClick={handleSearch}>Tìm kiếm</Button>
				</div>
			</div>
			<Accordion type='single' collapsible className='absolute w-[calc(100%-20px)] h-[64%] pr-4 overflow-y-auto left-4'>
				{filteredLeaveRequests.map((item, index) => {
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
									<span className='flex items-center text-green-600 font-bold flex-1 justify-end mr-2 float-end'>
										<CheckCircle className='w-4 h-4 text-green-600 mr-1' /> Đã duyệt
									</span>
								) : item.status === 2 ? (
									<span className='flex items-center text-yellow-500 font-bold flex-1 justify-end mr-2 float-end'>
										<Clock className='w-4 h-4 text-yellow-500 mr-1' /> Đang chờ duyệt
									</span>
								) : item.status === 3 ? (
									<span className='flex items-center text-red-500 font-bold flex-1 justify-end mr-2 float-end'>
										<XCircle className='w-4 h-4 text-red-500 mr-1' /> Bị từ chối
									</span>
								) : (
									<span className='flex items-center text-gray-400 font-bold flex-1 justify-end mr-2 float-end'>
										<HelpCircle className='w-4 h-4 text-gray-400 mr-1' /> Không xác định
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
								<div className='flex items-center justify-end gap-1 mt-4'>
									<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
										<DialogTrigger asChild>
											<Button className='border-none h-[32px] py-[6px] px-[8px] w-full justify-start items-center bg-gray-100 text-black hover:bg-gray-200'>
												<Info /> Chi tiết
											</Button>
										</DialogTrigger>
										<DialogContent
											className='!w-[50vw] !max-w-none !max-h-[90vh] h-[570px]'
											onOpenAutoFocus={e => e.preventDefault()}
										>
											<DialogHeader>
												<DialogTitle>Nội dung đơn xin nghỉ phép</DialogTitle>
												<DialogDescription>
													Chi tiết về đơn xin nghỉ phép của bạn, bao gồm thời gian nghỉ, lý do và trạng thái phê duyệt.
												</DialogDescription>
											</DialogHeader>
											<div className='flex flex-col gap-2 max-h-[50vh]'>
												<div className='h-full'>
													<div className='p-4 h-full max-w-[690px] border border-solid border-gray-200 rounded-sm'>
														<div className='float-end text-sm'>
															{item.status === 1 ? (
																<span className='flex items-center  text-green-600 font-bold'>
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
														</div>
														<input
															type='text'
															className='outline-none border-none font-bold w-full text-center mx-auto my-3 block'
															value={item.title}
														/>

														<div className='overflow-y-auto max-h-[calc(100%-55px)] pl-2'>
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
																{`${item.leaveReason === 1 ? 'Nghỉ bệnh' : item.leaveReason === 2 ? 'Nghỉ phép' : 'Nghỉ thai sản'}`}
															</div>
															<div className='text-black mt-4'>
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
																	<p className='min-h-[100px] break-words whitespace-pre-wrap overflow-hidden'>
																		{item.description}
																	</p>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div
												className={`flex items-center ${item.status === 2 ? 'justify-between' : 'justify-end'}  gap-2`}
											>
												{item.status === 2 && (
													<AlertDialog>
														<AlertDialogTrigger asChild>
															<Button className='px-4 py-2 border bg-red-500 text-white rounded-md hover:bg-red-600 transition'>
																<Trash2 />
																Hủy
															</Button>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>Xác nhận hủy đơn xin nghỉ phép</AlertDialogTitle>
																<AlertDialogDescription>
																	Vui lòng kiểm tra lại thông tin trước khi xác nhận. Sau khi hủy, đơn sẽ được hủy bỏ và
																	không thể phục hồi!
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Thoát</AlertDialogCancel>
																<AlertDialogAction
																	onClick={() => {
																		handleDeleleClick(item.id);
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
													className='px-4 py-2 border bg-black text-white rounded-md hover:bg-gray-800 transition '
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
				})}
			</Accordion>
		</div>
	);
}

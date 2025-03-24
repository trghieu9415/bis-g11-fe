import CustomTable from '@/components/custom-table';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, CheckCircle, Clock, HelpCircle, Trash2, XCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { fetchAllLeaveRequests } from '@/redux/slices/leaveRequestsSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { approveLeaveRequest, rejectLeaveRequest } from '@/services/leaveRequestService';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

type leaveRequests = {
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
	roleName: string;
	fullName: string;
};

export default function AllLeaveRequestsTable() {
	const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<leaveRequests | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const dispatch = useAppDispatch();
	const { leaveRequests } = useSelector((state: RootState) => state.leaveRequests);

	useEffect(() => {
		if (leaveRequests?.length === 0) {
			dispatch(fetchAllLeaveRequests());
		}
	}, [dispatch]);

	const columns: ColumnDef<leaveRequests>[] = [
		{
			accessorKey: 'idString',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-16'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					ID <ArrowUpDown />
				</Button>
			),
			enableHiding: false
		},
		{
			accessorKey: 'title',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-40'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Tiêu đề <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <span className='flex items-center'>{row.getValue('title')}</span>,
			enableHiding: false
		},
		{
			accessorKey: 'leaveReason',
			header: ({ column }) => (
				<Select
					onValueChange={value => {
						const newValue = value === 'all' ? undefined : Number(value);
						column.setFilterValue(newValue);
					}}
				>
					<SelectTrigger className='w-40 text-white bg-bg-green-800 ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0'>
						<SelectValue placeholder='Loại nghỉ phép' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Loại nghỉ phép</SelectItem>
						<SelectItem value='0'>Nghỉ bệnh</SelectItem>
						<SelectItem value='1'>Nghỉ phép</SelectItem>
						<SelectItem value='2'>Nghỉ thai sản</SelectItem>
					</SelectContent>
				</Select>
			),
			cell: ({ row }) => {
				const value = row.getValue('leaveReason');
				return (
					<span>
						{value === 0 ? 'Nghỉ bệnh' : value === 1 ? 'Nghỉ phép' : value === 2 ? 'Nghỉ thai sản' : 'Không rõ'}
					</span>
				);
			},
			filterFn: (row, columnId, filterValue) => {
				if (filterValue === undefined) return true;
				return row.getValue(columnId) === filterValue;
			}
		},
		{
			accessorKey: 'status',
			header: ({ column }) => (
				<Select
					onValueChange={value => {
						column.setFilterValue(value === 'all' ? undefined : Number(value));
					}}
				>
					<SelectTrigger className='w-40 text-white bg-bg-green-800 ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0'>
						<SelectValue placeholder='Trạng thái' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Trạng thái</SelectItem>
						<SelectItem value='1'>Đã duyệt</SelectItem>
						<SelectItem value='2'>Chờ duyệt</SelectItem>
						<SelectItem value='3'>Từ chối</SelectItem>
					</SelectContent>
				</Select>
			),
			cell: ({ row }) => (
				<span className='flex justify-center gap-2'>
					{row.getValue('status') === 1 ? (
						<p className='text-white flex items-center gap-1 justify-center w-[80%] bg-green-500 rounded-sm p-1'>
							<CheckCircle className='w-4 h-4 mr-1' stroke='white' />
							Đã duyệt
						</p>
					) : row.getValue('status') === 2 ? (
						<p className='text-white flex items-center gap-1 justify-center w-[80%] bg-yellow-500 rounded-sm p-1'>
							<Clock className='w-4 h-4 mr-1' stroke='white' /> Chờ duyệt
						</p>
					) : row.getValue('status') === 3 ? (
						<p className='text-white flex items-center gap-1 justify-center w-[80%] bg-red-500 rounded-sm p-1'>
							<XCircle className='w-4 h-4 mr-1' stroke='white' /> Đã từ chối
						</p>
					) : (
						<p className='text-white flex items-center gap-1 justify-center w-[80%] bg-gray-500 rounded-sm p-1'>
							<HelpCircle className='w-4 h-4 mr-1' stroke='white' /> Không xác định
						</p>
					)}
				</span>
			),
			filterFn: (row, columnId, filterValue) => {
				if (filterValue === undefined) return true;
				return row.getValue(columnId) === filterValue;
			}
		},
		{
			accessorKey: 'sendDate',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Ngày gửi <ArrowUpDown />
				</Button>
			)
		},

		{
			accessorKey: 'startDate',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Ngày bắt đầu <ArrowUpDown />
				</Button>
			)
		},
		{
			accessorKey: 'endDate',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Ngày kết thúc <ArrowUpDown />
				</Button>
			)
		},
		{
			id: 'actions',
			header: 'Thao tác',
			cell: ({ row }) => (
				<Button
					className='bg-transparent text-black p-2 hover:bg-gray-200'
					onClick={() => handleOpenDialog(row.original)}
				>
					<Info />
				</Button>
			)
		}
	];

	const handleOpenDialog = (leaveRequest: leaveRequests) => {
		setSelectedLeaveRequest(leaveRequest);
		setIsDialogOpen(true);
	};

	const handleApproveLeaveRequest = async (leaveRequest: leaveRequests) => {
		const leaveRequestID = leaveRequest.id;

		try {
			await approveLeaveRequest(leaveRequestID);
			toast.success('Duyệt đơn xin nghỉ phép thành công!');
			dispatch(fetchAllLeaveRequests());
			setIsDialogOpen(false);
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error(
					`${(err.response?.data as { message?: string })?.message || 'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'}`
				);
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy đơn nghỉ phép.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	const handleRejectLeaveRequest = async (leaveRequest: leaveRequests) => {
		const leaveRequestID = leaveRequest.id;

		try {
			await rejectLeaveRequest(leaveRequestID);
			toast.success('Từ chối đơn xin nghỉ phép thành công!');
			dispatch(fetchAllLeaveRequests());
			setIsDialogOpen(false);
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error(
					(err.response.data as { message?: string }).message || 'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
				);
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy đơn nghỉ phép.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	return (
		<div>
			<CustomTable columns={columns} data={leaveRequests} />
			{selectedLeaveRequest && (
				<div className='flex items-center justify-end gap-1 mt-4'>
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
											{selectedLeaveRequest.status === 1 ? (
												<span className='flex items-center  text-green-600 font-bold'>
													<CheckCircle className='w-4 h-4 text-green-600 mr-1' /> Đã duyệt
												</span>
											) : selectedLeaveRequest.status === 2 ? (
												<span className='flex items-center text-yellow-500 font-bold'>
													<Clock className='w-4 h-4 text-yellow-500 mr-1' /> Đang chờ duyệt
												</span>
											) : selectedLeaveRequest.status === 3 ? (
												<span className='flex items-center text-red-500 font-bold'>
													<XCircle className='w-4 h-4 text-red-500 mr-1' /> Đã từ chối
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
											readOnly
											value={selectedLeaveRequest.title}
										/>

										<div className='overflow-y-auto max-h-[calc(100%-55px)] pl-2'>
											<p className='text-gray-900'>
												<strong className='italic underline'>Kính gửi:</strong> Trưởng phòng Nhân sự
											</p>
											<p className='text-gray-900'>
												<strong>Tên tôi là:</strong> {selectedLeaveRequest.fullName}
											</p>
											<p className='text-gray-900'>
												<strong>Chức vụ:</strong> {selectedLeaveRequest.roleName}
											</p>
											<div className='flex items-center justify-start gap-2'>
												<strong className='text-gray-900 text-base'>Loại nghỉ phép: </strong>
												{`${selectedLeaveRequest.leaveReason === 0 ? 'Nghỉ bệnh' : selectedLeaveRequest.leaveReason === 1 ? 'Nghỉ phép' : selectedLeaveRequest.leaveReason === 2 ? 'Nghỉ thai sản' : 'Không xác định'}`}
											</div>
											<div className='text-black mt-4'>
												<div>
													{new Date(selectedLeaveRequest.sendDate).toLocaleDateString('vi-VN', {
														day: 'numeric',
														month: 'long',
														year: 'numeric'
													})}
													. Nay tôi làm đơn này, kính xin Trường phòng Nhân sự cho tôi xin nghỉ phép từ ngày{' '}
													{new Date(selectedLeaveRequest.startDate).toLocaleDateString('vi-VN', {
														day: 'numeric',
														month: 'long',
														year: 'numeric'
													})}{' '}
													đến ngày{' '}
													{new Date(selectedLeaveRequest.endDate).toLocaleDateString('vi-VN', {
														day: 'numeric',
														month: 'long',
														year: 'numeric'
													})}
												</div>
												<div className='mt-3'>
													<p className='min-h-[100px] break-words whitespace-pre-wrap overflow-hidden'>
														{selectedLeaveRequest.description}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								className={`flex items-center ${selectedLeaveRequest.status === 2 ? 'justify-between' : 'justify-end'}  gap-2`}
							>
								<div className='flex items-center justify-center gap-2'>
									{selectedLeaveRequest.status === 2 && (
										<>
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button className='px-4 py-2 border bg-red-500 text-white rounded-md hover:bg-red-600 transition'>
														<Trash2 />
														Từ chối
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
														<AlertDialogAction onClick={() => handleRejectLeaveRequest(selectedLeaveRequest)}>
															Xác nhận
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button className='px-4 py-2 border bg-green-500 text-white rounded-md hover:bg-green-600 transition'>
														<CheckCircle />
														Duyệt
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>Xác nhận duyệt đơn xin nghỉ phép</AlertDialogTitle>
														<AlertDialogDescription>
															Vui lòng kiểm tra lại thông tin trước khi xác nhận. Sau khi duyệt, đơn sẽ được duyệt và
															không thể phục hồi!
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Thoát</AlertDialogCancel>
														<AlertDialogAction onClick={() => handleApproveLeaveRequest(selectedLeaveRequest)}>
															Xác nhận
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</>
									)}
								</div>
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
			)}
		</div>
	);
}

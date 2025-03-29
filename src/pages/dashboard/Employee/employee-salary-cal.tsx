import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { fetchUserDetail } from '@/redux/slices/userDetailSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { BadgeDollarSign, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Input } from '@/components/ui/input';

export default function EmployeeSalaryCal() {
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
			typeSalary: ''
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

	const getMaxSalaryDays = () => {
		switch (formData.typeSalary) {
			case 'FULL_TIME':
				return 30;
			case 'PART_TIME':
				return 15;
			default:
				return 0;
		}
	};

	// const handleSubmitClick = async () => {
	// 	const fieldsToValidate = ['title', 'description', 'startDate', 'endDate', 'typeSalary'] as const;

	// 	const isValid = await trigger(fieldsToValidate);
	// 	if (isValid) {
	// 		try {
	// 			const salaryReqObject = {
	// 				title: formData.title,
	// 				startDate: formData.startDate,
	// 				endDate: formData.endDate,
	// 				description: formData.description,
	// 				salaryReason: formData.typeSalary,
	// 				userId: user.id
	// 			};
	// 			const res = await addSalaryRequest(salaryReqObject);
	// 			if (res?.data) {
	// 				dispatch(fetchAllSalaryRequestsByUserId(user.id));
	// 				toast.success('Thêm yêu cầu tính lương thành công!');
	// 				setIsDialogOpen(false);
	// 			}
	// 		} catch (error) {
	// 			const err = error as AxiosError;

	// 			if (err.response?.status === 400) {
	// 				toast.error(
	// 					(err.response.data as { message?: string }).message ||
	// 						'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
	// 				);
	// 			} else if (err.response?.status === 404) {
	// 				toast.error('Lỗi 404: Không tìm thấy nhân viên.');
	// 			} else if (err.response?.status === 500) {
	// 				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
	// 			} else {
	// 				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
	// 			}
	// 		}
	// 	}
	// };

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' className='border-none h-[32px] py-[6px] px-[8px] w-full justify-start items-center'>
					<BadgeDollarSign />
					Tính lương
				</Button>
			</DialogTrigger>
			<DialogContent
				className='!w-[50vw] !max-w-none !h-[98vh] flex flex-col'
				onOpenAutoFocus={e => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle></DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<div className='flex-1 mb-4'>
					<div>
						<div className='max-w-4xl mx-auto bg-white px-4 rounded-lg'>
							<h1 className='text-lg font-bold text-center mb-1'>Công ty Inverse</h1>

							<p className='text-center text-sm mb-4'>
								Địa chỉ: 273 An Dương Vương, Phường 3, Quận 5, Thành phố Hồ Chí Minh
							</p>
							<h2 className='text-md font-semibold text-center mb-2'>PHIẾU LƯƠNG</h2>
							<div className=' flex justify-center items-center mb-4'>
								<label htmlFor='monthYear' className=' mr-2 text-md font-medium'>
									Kỳ lương
								</label>
								<Input
									type='month'
									id='monthYear'
									className='border rounded-md p-2 block w-[160px] h-[30px]'
									onChange={e => {
										// Xử lý việc chọn tháng và năm
									}}
								/>
							</div>
						</div>
						<div className='overflow-y-auto px-4 max-h-[430px] pb-2'>
							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Mã Nhân Viên:</strong> NV-3
								</p>
								<p className='mb-2 text-xs'>
									<strong>Ngày công đi làm:</strong> 17
								</p>
							</div>
							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Họ và tên:</strong> Lữ Quang Minh
								</p>
								<p className='mb-2 text-xs'>
									<strong>Ngày nghỉ lễ:</strong> 5
								</p>
							</div>

							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Chức danh:</strong> EMPLOYEE
								</p>
								<p className='mb-2 text-xs'>
									<strong>Ngày nghỉ phép:</strong> 1
								</p>
							</div>

							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Lương cơ bản:</strong> 8,000,000 VNĐ
								</p>
								<p className='mb-2 text-xs'>
									<strong>Ngày nghỉ ốm:</strong> 1
								</p>
							</div>

							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Hệ số lương:</strong> 1.0
								</p>
								<p className='mb-2 text-xs'>
									<strong>Nghỉ thai sản:</strong> 0
								</p>
							</div>

							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Ngày công chuẩn:</strong> 18
								</p>
								<p className='mb-2 text-xs'>
									<strong>Nghỉ không phép:</strong> 0
								</p>
							</div>

							<table className='min-w-full border border-gray-300 mt-4 text-xs'>
								<thead className='bg-gray-200'>
									<tr>
										<th className='border border-gray-300 p-2 w-1/12'>STT</th>
										<th className='border border-gray-300 p-2 w-7/12'>Các Khoản Thu Nhập</th>
										<th className='border border-gray-300 p-2 w-4/12'>Số tiền</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className='border border-gray-300 p-2'>1</td>
										<td className='border border-gray-300 p-2'>Lương chính thức</td>
										<td className='border border-gray-300 p-2 text-right'>3,000,000.00</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'>2</td>
										<td className='border border-gray-300 p-2'>Lương phụ cấp</td>
										<td className='border border-gray-300 p-2 text-right'>830,000.00</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2 text-right font-bold' colSpan={2}>
											Tổng cộng:
										</td>
										<td className='border border-gray-300 p-2 font-bold text-right'>3,830,000.00</td>
									</tr>
								</tbody>
							</table>

							<table className='min-w-full border border-gray-300 mt-4 text-xs'>
								<thead className='bg-gray-200'>
									<tr>
										<th className='border border-gray-300 p-2 w-1/12'>STT</th>
										<th className='border border-gray-300 p-2 w-7/12'>Các Khoản Trừ Vào Lương</th>
										<th className='border border-gray-300 p-2 w-4/12'>Số tiền</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className='border border-gray-300 p-2'>1</td>
										<td className='border border-gray-300 p-2 text-left font-bold' colSpan={2}>
											Bảo hiểm bắt buộc
										</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'></td>
										<td className='border border-gray-300 p-2'>1.1. Bảo hiểm xã hội (8%)</td>
										<td className='border border-gray-300 p-2 text-right'>644,000.00</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'></td>
										<td className='border border-gray-300 p-2'>1.2. Bảo hiểm y tế (1.5%)</td>
										<td className='border border-gray-300 p-2 text-right'>1,245,000.00</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'></td>
										<td className='border border-gray-300 p-2'>1.3. Bảo hiểm thất nghiệp (1%)</td>
										<td className='border border-gray-300 p-2 text-right'>83,000.00</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'>2</td>
										<td className='border border-gray-300 p-2'>Thuế TNCN</td>
										<td className='border border-gray-300 p-2 text-right'>0.00</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'>3</td>
										<td className='border border-gray-300 p-2'>Phạt</td>
										<td className='border border-gray-300 p-2 text-right'>0.00</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'>4</td>
										<td className='border border-gray-300 p-2'>Khác</td>
										<td className='border border-gray-300 p-2 text-right'>0.00</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2 text-right font-bold' colSpan={2}>
											Tổng cộng:
										</td>
										<td className='border border-gray-300 p-2 font-bold text-right'>871,500.00</td>
									</tr>
								</tbody>
							</table>
							<table className='min-w-full border border-gray-300 mt-4 text-xs'>
								<thead className='bg-gray-200'>
									<tr>
										<th className='border border-gray-300 p-2 w-1/12'>STT</th>
										<th className='border border-gray-300 p-2 w-7/12'>Các Khoản Phụ Cấp BHXH</th>
										<th className='border border-gray-300 p-2 w-4/12'>Số tiền</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className='border border-gray-300 p-2'>1</td>
										<td className='border border-gray-300 p-2'>Phụ cấp thai sản</td>
										<td className='border border-gray-300 p-2 text-right'>0.00</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'>2</td>
										<td className='border border-gray-300 p-2'>Phụ cấp nghỉ bệnh</td>
										<td className='border border-gray-300 p-2 text-right'>0.00</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2 text-right font-bold' colSpan={2}>
											Tổng cộng:
										</td>
										<td className='border border-gray-300 p-2 font-bold text-right'>0.00</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div className='px-6'>
							<table className='min-w-full mt-4 text-xs'>
								<tbody>
									<tr>
										<td className='border border-gray-300 p-2 w-8/12 text-right font-bold' colSpan={2}>
											Tổng Số Tiền Lương Thực Nhận:
										</td>
										<td
											className='border border-gray-300 p-2 w-4/12 font-bold text-right text-green-600'
											style={{ fontWeight: 'bold' }}
										>
											7,425,000.00
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div className='flex items-center w-full justify-end gap-2'>
					<Button className='w-full' onClick={() => setIsDialogOpen(false)}>
						Đóng
					</Button>
					<Button className='w-full bg-red-500 hover:bg-red-600 hover:text-white text-white' variant='outline'>
						<FileText />
						Xuất PDF
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

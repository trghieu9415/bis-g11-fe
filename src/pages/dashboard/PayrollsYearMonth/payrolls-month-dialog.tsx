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

type Payroll = {
	id: number;
	idString: string;
	standardWorkingDays: number;
	maternityBenefit: string;
	sickBenefit: string;
	netSalary: string;
	grossSalary: string;
	tax: string;
	employeeBHXH: string;
	employeeBHYT: string;
	employeeBHTN: string;
	penalties: string;
	allowance: string;
	totalIncome: string;
	attendanceId: number;
	monthOfYear: string;
	userIdStr: string;
	fullName: string;
	roleName: string;
	salaryCoefficient: number;
	totalWorkingDays: number;
	totalSickLeaves: number;
	totalPaidLeaves: number;
	totalMaternityLeaves: number;
	totalUnpaidLeaves: number;
	totalHolidayLeaves: number;
	baseSalary: string;
	totalBaseSalary: string;
	totalBenefit: string;
	mainSalary: string;
	deductions: string;
};

type PayrollsMonthDialogProps = {
	isOpen: boolean;
	selectedPayroll: Payroll | null;
	onClose: () => void;
};

export default function PayrollsMonthDialog({ isOpen, selectedPayroll, onClose }: PayrollsMonthDialogProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setIsDialogOpen(true);
			// reset();
		} else {
			setIsDialogOpen(false);
		}
	}, [isOpen]);

	return (
		<Dialog open={isDialogOpen} onOpenChange={onClose}>
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
									Kỳ lương {selectedPayroll?.monthOfYear?.replace(/(\d{4})-(\d{2})/, 'tháng $2 năm $1')}
								</label>
							</div>
						</div>
						<div className='overflow-y-auto px-4 max-h-[430px] pb-2'>
							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Mã Nhân Viên:</strong> {selectedPayroll?.userIdStr}
								</p>
								<p className='mb-2 text-xs'>
									<strong>Ngày công đi làm:</strong> {selectedPayroll?.totalWorkingDays}
								</p>
							</div>
							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Họ và tên:</strong> {selectedPayroll?.fullName}
								</p>
								<p className='mb-2 text-xs'>
									<strong>Ngày nghỉ lễ:</strong> {selectedPayroll?.totalHolidayLeaves}
								</p>
							</div>

							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Chức danh:</strong> {selectedPayroll?.roleName}
								</p>
								<p className='mb-2 text-xs'>
									<strong>Ngày nghỉ phép:</strong> {selectedPayroll?.totalPaidLeaves}
								</p>
							</div>

							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Lương cơ bản:</strong> {selectedPayroll?.baseSalary}
								</p>
								<p className='mb-2 text-xs'>
									<strong>Ngày nghỉ bệnh:</strong> {selectedPayroll?.totalSickLeaves}
								</p>
							</div>

							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Hệ số lương:</strong> {selectedPayroll?.salaryCoefficient}
								</p>
								<p className='mb-2 text-xs'>
									<strong>Nghỉ thai sản:</strong> {selectedPayroll?.totalMaternityLeaves}
								</p>
							</div>

							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Ngày công chuẩn:</strong> {selectedPayroll?.standardWorkingDays}
								</p>
								<p className='mb-2 text-xs'>
									<strong>Nghỉ không phép:</strong> {selectedPayroll?.totalUnpaidLeaves}
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
										<td className='border border-gray-300 p-2 text-right'>{selectedPayroll?.mainSalary} VNĐ</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'>2</td>
										<td className='border border-gray-300 p-2'>Lương phụ cấp</td>
										<td className='border border-gray-300 p-2 text-right'>{selectedPayroll?.allowance}</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2 text-right font-bold' colSpan={2}>
											Tổng cộng:
										</td>
										<td className='border border-gray-300 p-2 font-bold text-right'>
											{selectedPayroll?.grossSalary} VNĐ
										</td>
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
										<td className='border border-gray-300 p-2 text-right'>- {selectedPayroll?.employeeBHXH} VNĐ</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'></td>
										<td className='border border-gray-300 p-2'>1.2. Bảo hiểm y tế (1.5%)</td>
										<td className='border border-gray-300 p-2 text-right'>- {selectedPayroll?.employeeBHYT} VNĐ</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'></td>
										<td className='border border-gray-300 p-2'>1.3. Bảo hiểm thất nghiệp (1%)</td>
										<td className='border border-gray-300 p-2 text-right'>- {selectedPayroll?.employeeBHTN} VNĐ</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'>2</td>
										<td className='border border-gray-300 p-2'>Thuế TNCN</td>
										<td className='border border-gray-300 p-2 text-right'>- {selectedPayroll?.tax} VNĐ</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'>3</td>
										<td className='border border-gray-300 p-2'>Phạt</td>
										<td className='border border-gray-300 p-2 text-right'>- {selectedPayroll?.penalties} VNĐ</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'>4</td>
										<td className='border border-gray-300 p-2'>Khác</td>
										<td className='border border-gray-300 p-2 text-right'>- 0 VNĐ</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2 text-right font-bold' colSpan={2}>
											Tổng cộng:
										</td>
										<td className='border border-gray-300 p-2 font-bold text-right'>- {selectedPayroll?.deductions}</td>
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
										<td className='border border-gray-300 p-2 text-right'>{selectedPayroll?.maternityBenefit} VNĐ</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'>2</td>
										<td className='border border-gray-300 p-2'>Phụ cấp nghỉ bệnh</td>
										<td className='border border-gray-300 p-2 text-right'>{selectedPayroll?.sickBenefit} VNĐ</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2 text-right font-bold' colSpan={2}>
											Tổng cộng:
										</td>
										<td className='border border-gray-300 p-2 font-bold text-right'>
											{selectedPayroll?.totalBenefit} VNĐ
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div className='px-6'>
							<table className='min-w-full mt-4 text-xs'>
								<tbody>
									<tr>
										<td className='border border-gray-300 p-2 w-8/12 text-right font-bold' colSpan={2}>
											Tổng số tiền lương thực nhận:
										</td>
										<td
											className='border border-gray-300 p-2 w-4/12 font-bold text-right text-green-600'
											style={{ fontWeight: 'bold' }}
										>
											{Math.floor(parseFloat(selectedPayroll?.netSalary || '0')).toLocaleString('en-US')} VNĐ
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div className='flex items-center w-full justify-end gap-2'>
					<Button
						className='w-full'
						onClick={() => {
							setIsDialogOpen(false);
							onClose();
						}}
					>
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

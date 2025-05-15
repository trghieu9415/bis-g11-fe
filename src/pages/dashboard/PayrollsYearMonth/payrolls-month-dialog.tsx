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
	DialogFooter
} from '@/components/ui/dialog';

import html2pdf from 'html2pdf.js';
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import removeAccents from 'remove-accents';

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

	const handleExportPayrollByMonth = () => {
		const companyNameElement = `<div class='max-w-4xl mx-auto bg-white px-4 rounded-lg'>
																	<h1 class='text-lg font-bold text-center mb-1'>CÔNG TY INKVERSE</h1>

																	<p class='text-center text-sm mb-4'>
																		Địa chỉ: 273 An Dương Vương, Phường 3, Quận 5, Thành phố Hồ Chí Minh
																	</p>
																</div>
																<div class='flex flex-col justify-center items-center mb-4 w-full' id='monthly-pay-period'>
																	<h2 class='text-base font-semibold text-center'>PHIẾU LƯƠNG</h2>
																	<label htmlFor='monthYear' class='text-md font-medium'>
																		Kỳ lương ${selectedPayroll?.monthOfYear?.replace(/(\d{4})-(\d{2})/, 'tháng $2 năm $1')}
																	</label>
																</div>`;

		const newNetSalaryElement = `<div class='px-6' id='net-salary'>
																		<table class='min-w-full mt-2 text-xs'>
																			<tbody>
																				<tr>
																					<td class='border border-gray-300 p-2 w-8/12 text-right font-bold' colSpan={2}>
																						Tổng Số Tiền Lương Thực Nhận:
																					</td>
																					<td
																						class='border border-gray-300 p-2 w-4/12 font-bold text-right text-green-600'
																						style={{ fontWeight: 'bold' }}
																					>
																						${selectedPayroll?.netSalary ? Math.floor(Number(selectedPayroll?.netSalary)).toLocaleString('en-US') : '0'} VNĐ
																					</td>
																				</tr>
																			</tbody>
																		</table>
																	</div>`;

		const signElement = `<div class='max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg'>
													<table class='w-full border border-gray-300 mt-10'>
														<tbody>
															<tr>
																<td class='border border-gray-300 px-4 pt-2 pb-20 text-center'>
																	<p class='font-semibold'>Người lập phiếu</p>
																	<p>(Ký và ghi rõ họ tên)</p>
																</td>
																<td class='border border-gray-300 px-4 pt-2 pb-20 text-center'>
																	<p class='font-semibold'>Người nhận tiền</p>
																	<p>(Ký và ghi rõ họ tên)</p>
																</td>
															</tr>
														</tbody>
													</table>
												</div>`;

		const element = document.getElementById('payroll-month');

		if (element) {
			const elementClone = element.cloneNode(true) as HTMLElement;

			const monthlyPayPeriodElement = elementClone.querySelector('#monthly-pay-period');
			if (monthlyPayPeriodElement) {
				monthlyPayPeriodElement.remove();
			}

			const selectedPayrollContentElement = elementClone.querySelector('#payroll-month-content');
			if (selectedPayrollContentElement) {
				selectedPayrollContentElement.classList.remove('overflow-y-auto');
				selectedPayrollContentElement.classList.remove('max-h-[430px]');
			}

			const netSalaryElement = elementClone.querySelector('#net-salary');
			if (netSalaryElement) {
				netSalaryElement.remove();
			}

			elementClone.insertAdjacentHTML('afterbegin', companyNameElement);
			elementClone.innerHTML +=
				newNetSalaryElement + `<div class="page-break" style="page-break-after: always;"></div>` + signElement;

			const nameSlug = removeAccents(selectedPayroll?.fullName ?? '').replace(/\s+/g, '_');
			const monthYearFormatted = selectedPayroll?.monthOfYear?.replace(/(\d{4})-(\d{2})/, '$2_$1');
			const options = {
				margin: 1,
				filename: `BTC_ThuNhap_${nameSlug}_${monthYearFormatted}.pdf`,
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: { scale: 4 },
				jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
			};

			html2pdf(elementClone, options);
		}
	};

	return (
		<>
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
						<div id='payroll-month'>
							<div className='max-w-4xl mx-auto bg-white px-4 rounded-lg' id='monthly-pay-period'>
								<h1 className='text-lg font-bold text-center mb-1'>Công ty INKVERSE</h1>

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
							<div className='overflow-y-auto px-4 max-h-[430px] pb-2' id='payroll-month-content'>
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
										<strong>Ngày công chuẩn:</strong> {selectedPayroll?.standardWorkingDays}
									</p>
									<p className='mb-2 text-xs'>
										<strong>Ngày nghỉ bệnh:</strong> {selectedPayroll?.totalSickLeaves}
									</p>
								</div>

								<div className='grid grid-col grid-cols-2'>
									<p className='mb-2 text-xs'>
										<strong></strong>
									</p>
									<p className='mb-2 text-xs'>
										<strong>Nghỉ thai sản:</strong> {selectedPayroll?.totalMaternityLeaves}
									</p>
								</div>

								<div className='grid grid-col grid-cols-2'>
									<p className='mb-2 text-xs'>
										<strong></strong>
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
											<td className='border border-gray-300 p-2'>Lương cơ bản</td>
											<td className='border border-gray-300 p-2 text-right'>{selectedPayroll?.baseSalary} VNĐ</td>
										</tr>
										<tr>
											<td className='border border-gray-300 p-2'>2</td>
											<td className='border border-gray-300 p-2'>Hệ số lương</td>
											<td className='border border-gray-300 p-2 text-right'>{selectedPayroll?.salaryCoefficient}</td>
										</tr>
										<tr>
											<td className='border border-gray-300 p-2'>3</td>
											<td className='border border-gray-300 p-2'>Lương Gross</td>
											<td className='border border-gray-300 p-2 text-right'>{selectedPayroll?.mainSalary} VNĐ</td>
										</tr>
										<tr>
											<td className='border border-gray-300 p-2'>4</td>
											<td className='border border-gray-300 p-2'>Phụ cấp</td>
											<td className='border border-gray-300 p-2 text-right'>{selectedPayroll?.allowance} VNĐ</td>
										</tr>
										<tr>
											<td className='border border-gray-300 p-2 text-right font-bold' colSpan={2}>
												Tổng cộng (3) + (4):
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
											<td className='border border-gray-300 p-2 font-bold text-right'>
												- {selectedPayroll?.deductions} VNĐ
											</td>
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

							<div className='px-6' id='net-salary'>
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
					<DialogFooter className='sm:justify-end'>
						<div className='flex justify-end gap-2'>
							<Button
								className='px-4 py-2 border bg-white text-black rounded-md hover:bg-gray-100 transition'
								onClick={() => {
									setIsDialogOpen(false);
									onClose();
								}}
							>
								Thoát
							</Button>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button className='w-full bg-red-500 hover:bg-red-600 hover:text-white text-white' variant='outline'>
										<FileText />
										Xuất PDF
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Xác nhận xuất PDF</AlertDialogTitle>
										<AlertDialogDescription>Bạn có chắc chắn muốn xuất PDF này không?</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Thoát</AlertDialogCancel>
										<AlertDialogAction onClick={handleExportPayrollByMonth}>Xác nhận</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</DialogFooter>
					{/* <div className='flex items-center w-full justify-end gap-2'>
						<Button
							className='w-full'
							onClick={() => {
								setIsDialogOpen(false);
								onClose();
							}}
						>
							Đóng
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button className='w-full bg-red-500 hover:bg-red-600 hover:text-white text-white' variant='outline'>
									<FileText />
									Xuất PDF
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Xác nhận xuất PDF</AlertDialogTitle>
									<AlertDialogDescription>Bạn có chắc chắn muốn xuất PDF này không?</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Thoát</AlertDialogCancel>
									<AlertDialogAction onClick={handleExportPayrollByMonth}>Xác nhận</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div> */}
				</DialogContent>
			</Dialog>
		</>
	);
}

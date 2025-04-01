import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchPayrollsYearByUserID } from '@/redux/slices/payrollsYearByUserIDSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { BadgeDollarSign, FileText, TextSearch } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import html2pdf from 'html2pdf.js';

interface Payroll {
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
}

export default function EmployeeSalaryCal() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [monthYear, setMonthYear] = useState({
		month: '',
		year: ''
	});
	const [year, setYear] = useState(monthYear.year);
	const [payrollMonth, setPayrollMonth] = useState<Payroll | null>(null);
	const [activeTab, setActiveTab] = useState<{ currentTab: string | null; netSalary: string | null }>({
		currentTab: null,
		netSalary: null
	});
	const [activeTabList, setActiveTabList] = useState('month');

	const dispatch = useAppDispatch();
	const { user } = useSelector((state: RootState) => state.user);
	const { payrollsYearByUserID } = useSelector((state: RootState) => state.payrollsYearByUserID);

	useEffect(() => {
		if (monthYear?.year && user) {
			dispatch(fetchPayrollsYearByUserID({ userId: 3, year: monthYear.year }));
		}
	}, [monthYear.year, dispatch]);

	useEffect(() => {
		const filteredByMonth = payrollsYearByUserID.filter(
			item => item.monthOfYear === `${monthYear.year}-${monthYear.month}`
		);
		console.log(filteredByMonth);
		setPayrollMonth(filteredByMonth.length > 0 ? filteredByMonth[0] : null);
	}, [monthYear, payrollsYearByUserID]);

	const handleTabChange = (value: string | null) => {
		if (!value) {
			setActiveTab(prev => ({ ...prev, currentTab: null, netSalary: null }));
			return;
		}

		const index = parseInt(value.replace('item-', ''), 10);
		const selectedItem = payrollsYearByUserID[index];

		if (selectedItem) {
			const netSalary = selectedItem.netSalary
				? Math.floor(Number(selectedItem.netSalary)).toLocaleString('en-US')
				: '0';

			setActiveTab({
				currentTab: value,
				netSalary: `$${netSalary}`
			});
		}
	};

	const handleExportPayrollByMonth = () => {
		const companyNameElement = `<div class='max-w-4xl mx-auto bg-white px-4 rounded-lg'>
																	<h1 class='text-lg font-bold text-center mb-1'>CÔNG TY INVERSE</h1>

																	<p class='text-center text-sm mb-4'>
																		Địa chỉ: 273 An Dương Vương, Phường 3, Quận 5, Thành phố Hồ Chí Minh
																	</p>
																</div>
																<div class='flex flex-col justify-center items-center mb-4 w-full' id='monthly-pay-period'>
																	<h2 class='text-base font-semibold text-center'>PHIẾU LƯƠNG</h2>
																	<label htmlFor='monthYear' class='text-md font-medium'>
																		Kỳ lương tháng ${monthYear.month} năm ${monthYear.year}
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
																						${payrollMonth?.netSalary ? Math.floor(Number(payrollMonth?.netSalary)).toLocaleString('en-US') : '0'} VNĐ
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

			const payrollMonthContentElement = elementClone.querySelector('#payroll-month-content');
			if (payrollMonthContentElement) {
				payrollMonthContentElement.classList.remove('overflow-y-auto');
				payrollMonthContentElement.classList.remove('max-h-[380px]');
			}

			const netSalaryElement = elementClone.querySelector('#net-salary');
			if (netSalaryElement) {
				netSalaryElement.remove();
			}

			elementClone.insertAdjacentHTML('afterbegin', companyNameElement);
			elementClone.innerHTML +=
				newNetSalaryElement + `<div class="page-break" style="page-break-after: always;"></div>` + signElement;

			const options = {
				margin: 1,
				filename: 'payroll_report.pdf',
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: { scale: 4 },
				jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
			};

			html2pdf(elementClone, options);
		}
	};

	const handleExportPayrollByYear = () => {
		const element = payrollsYearByUserID
			.map((item, index) => {
				const date = new Date(`${item?.monthOfYear}-01`);
				const formatted = date.toLocaleString('vi-VN', { month: '2-digit', year: 'numeric' });

				return ReactDOMServer.renderToStaticMarkup(
					<>
						{index === 0 && (
							<div className='max-w-4xl mx-auto mt-8 bg-white px-4 rounded-lg'>
								<h1 className='text-lg font-bold text-center mb-1'>CÔNG TY INVERSE</h1>

								<p className='text-center text-sm mb-4'>
									Địa chỉ: 273 An Dương Vương, Phường 3, Quận 5, Thành phố Hồ Chí Minh
								</p>
							</div>
						)}
						<div
							className={`flex flex-col justify-center items-center mb-4 w-full ${index > 0 && 'mt-10'}`}
							id='monthly-pay-period'
						>
							<h2 className='text-base font-semibold text-center'>PHIẾU LƯƠNG</h2>
							<label htmlFor='monthYear' className='text-md font-medium'>
								Kỳ lương {`${formatted.replace(',', ' năm ')}`}
							</label>
						</div>
						`;
						<div key={index} className='px-4 pb-2'>
							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Mã Nhân Viên:</strong> {item?.userIdStr}
								</p>
								<p className='mb-2 text-xs'>
									<strong>Ngày công đi làm:</strong> {item?.totalWorkingDays}
								</p>
							</div>
							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Họ và tên:</strong> {item?.fullName}
								</p>
								<p className='mb-2 text-xs'>
									<strong>Ngày nghỉ lễ:</strong> {item?.totalHolidayLeaves}
								</p>
							</div>

							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Chức danh:</strong> {item?.roleName}
								</p>
								<p className='mb-2 text-xs'>
									<strong>Ngày nghỉ phép:</strong> {item?.totalPaidLeaves}
								</p>
							</div>

							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Lương cơ bản:</strong> {item?.baseSalary}
								</p>
								<p className='mb-2 text-xs'>
									<strong>Ngày nghỉ bệnh:</strong> {item?.totalSickLeaves}
								</p>
							</div>

							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Hệ số lương:</strong> {item?.salaryCoefficient}
								</p>
								<p className='mb-2 text-xs'>
									<strong>Nghỉ thai sản:</strong> {item?.totalMaternityLeaves}
								</p>
							</div>

							<div className='grid grid-col grid-cols-2'>
								<p className='mb-2 text-xs'>
									<strong>Ngày công chuẩn:</strong> {item?.standardWorkingDays}
								</p>
								<p className='mb-2 text-xs'>
									<strong>Nghỉ không phép:</strong> {item?.totalUnpaidLeaves}
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
										<td className='border border-gray-300 p-2 text-right'>{item?.mainSalary} VNĐ</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'>2</td>
										<td className='border border-gray-300 p-2'>Lương phụ cấp</td>
										<td className='border border-gray-300 p-2 text-right'>{item?.allowance}</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2 text-right font-bold' colSpan={2}>
											Tổng cộng:
										</td>
										<td className='border border-gray-300 p-2 font-bold text-right'>{item?.grossSalary} VNĐ</td>
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
										<td className='border border-gray-300 p-2 text-right'>- {item?.employeeBHXH} VNĐ</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'></td>
										<td className='border border-gray-300 p-2'>1.2. Bảo hiểm y tế (1.5%)</td>
										<td className='border border-gray-300 p-2 text-right'>- {item?.employeeBHYT} VNĐ</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'></td>
										<td className='border border-gray-300 p-2'>1.3. Bảo hiểm thất nghiệp (1%)</td>
										<td className='border border-gray-300 p-2 text-right'>- {item?.employeeBHTN} VNĐ</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'>2</td>
										<td className='border border-gray-300 p-2'>Thuế TNCN</td>
										<td className='border border-gray-300 p-2 text-right'>- {item?.tax} VNĐ</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'>3</td>
										<td className='border border-gray-300 p-2'>Phạt</td>
										<td className='border border-gray-300 p-2 text-right'>- {item?.penalties} VNĐ</td>
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
										<td className='border border-gray-300 p-2 font-bold text-right'>- {item?.deductions} VNĐ</td>
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
										<td className='border border-gray-300 p-2 text-right'>{item?.maternityBenefit} VNĐ</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2'>2</td>
										<td className='border border-gray-300 p-2'>Phụ cấp nghỉ bệnh</td>
										<td className='border border-gray-300 p-2 text-right'>{item?.sickBenefit} VNĐ</td>
									</tr>
									<tr>
										<td className='border border-gray-300 p-2 text-right font-bold' colSpan={2}>
											Tổng cộng:
										</td>
										<td className='border border-gray-300 p-2 font-bold text-right'>{item?.totalBenefit} VNĐ</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className='px-6' id='net-salary'>
							<table className='min-w-full mt-2 text-xs'>
								<tbody>
									<tr>
										<td className='border border-gray-300 p-2 w-8/12 text-right font-bold' colSpan={2}>
											Tổng Số Tiền Lương Thực Nhận:
										</td>
										<td
											className='border border-gray-300 p-2 w-4/12 font-bold text-right text-green-600'
											style={{ fontWeight: 'bold' }}
										>
											${item?.netSalary ? Math.floor(Number(item?.netSalary)).toLocaleString('en-US') : '0'} VNĐ
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div style={{ pageBreakAfter: 'always' }} />
						{index === payrollsYearByUserID.length - 1 && (
							<div className='max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg'>
								<table className='w-full border border-gray-300 mt-10'>
									<tbody>
										<tr>
											<td className='border border-gray-300 px-4 pt-2 pb-20 text-center'>
												<p className='font-semibold'>Người lập phiếu</p>
												<p>(Ký và ghi rõ họ tên)</p>
											</td>
											<td className='border border-gray-300 px-4 pt-2 pb-20 text-center'>
												<p className='font-semibold'>Người nhận tiền</p>
												<p>(Ký và ghi rõ họ tên)</p>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						)}
					</>
				);
			})
			.join('');

		if (element) {
			const options = {
				margin: 1,
				filename: 'payroll_report.pdf',
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: { scale: 4 },
				jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
			};

			html2pdf(element, options);
		}
	};

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
						</div>
						<Tabs value={activeTabList} onValueChange={setActiveTabList} className='w-full'>
							<TabsList className='grid w-full grid-cols-2'>
								<TabsTrigger value='month'>Theo tháng</TabsTrigger>
								<TabsTrigger value='year'>Theo năm</TabsTrigger>
							</TabsList>
							<TabsContent value='month' id='payroll-month'>
								<div className='flex justify-center items-center mb-4 w-full' id='monthly-pay-period'>
									<label htmlFor='monthYear' className=' mr-2 text-md font-medium'>
										Kỳ lương
									</label>
									<Input
										type='month'
										id='monthYear'
										value={`${monthYear.year}-${monthYear.month}`}
										className='border rounded-md p-2 block w-[160px] h-[30px]'
										min='2020-01'
										max='2100-12'
										onChange={e => {
											const [year, month] = e.target.value.split('-');
											setMonthYear({ year, month });
										}}
									/>
								</div>
								{monthYear && payrollMonth ? (
									<div className='overflow-y-auto px-4 max-h-[380px] pb-2' id='payroll-month-content'>
										<div className='grid grid-col grid-cols-2'>
											<p className='mb-2 text-xs'>
												<strong>Mã Nhân Viên:</strong> {payrollMonth?.userIdStr}
											</p>
											<p className='mb-2 text-xs'>
												<strong>Ngày công đi làm:</strong> {payrollMonth?.totalWorkingDays}
											</p>
										</div>
										<div className='grid grid-col grid-cols-2'>
											<p className='mb-2 text-xs'>
												<strong>Họ và tên:</strong> {payrollMonth?.fullName}
											</p>
											<p className='mb-2 text-xs'>
												<strong>Ngày nghỉ lễ:</strong> {payrollMonth?.totalHolidayLeaves}
											</p>
										</div>

										<div className='grid grid-col grid-cols-2'>
											<p className='mb-2 text-xs'>
												<strong>Chức danh:</strong> {payrollMonth?.roleName}
											</p>
											<p className='mb-2 text-xs'>
												<strong>Ngày nghỉ phép:</strong> {payrollMonth?.totalPaidLeaves}
											</p>
										</div>

										<div className='grid grid-col grid-cols-2'>
											<p className='mb-2 text-xs'>
												<strong>Lương cơ bản:</strong> {payrollMonth?.baseSalary}
											</p>
											<p className='mb-2 text-xs'>
												<strong>Ngày nghỉ bệnh:</strong> {payrollMonth?.totalSickLeaves}
											</p>
										</div>

										<div className='grid grid-col grid-cols-2'>
											<p className='mb-2 text-xs'>
												<strong>Hệ số lương:</strong> {payrollMonth?.salaryCoefficient}
											</p>
											<p className='mb-2 text-xs'>
												<strong>Nghỉ thai sản:</strong> {payrollMonth?.totalMaternityLeaves}
											</p>
										</div>

										<div className='grid grid-col grid-cols-2'>
											<p className='mb-2 text-xs'>
												<strong>Ngày công chuẩn:</strong> {payrollMonth?.standardWorkingDays}
											</p>
											<p className='mb-2 text-xs'>
												<strong>Nghỉ không phép:</strong> {payrollMonth?.totalUnpaidLeaves}
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
													<td className='border border-gray-300 p-2 text-right'>{payrollMonth?.mainSalary} VNĐ</td>
												</tr>
												<tr>
													<td className='border border-gray-300 p-2'>2</td>
													<td className='border border-gray-300 p-2'>Lương phụ cấp</td>
													<td className='border border-gray-300 p-2 text-right'>{payrollMonth?.allowance} VNĐ</td>
												</tr>
												<tr>
													<td className='border border-gray-300 p-2 text-right font-bold' colSpan={2}>
														Tổng cộng:
													</td>
													<td className='border border-gray-300 p-2 font-bold text-right'>
														{payrollMonth?.grossSalary} VNĐ
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
													<td className='border border-gray-300 p-2 text-right'>- {payrollMonth?.employeeBHXH} VNĐ</td>
												</tr>
												<tr>
													<td className='border border-gray-300 p-2'></td>
													<td className='border border-gray-300 p-2'>1.2. Bảo hiểm y tế (1.5%)</td>
													<td className='border border-gray-300 p-2 text-right'>- {payrollMonth?.employeeBHYT} VNĐ</td>
												</tr>
												<tr>
													<td className='border border-gray-300 p-2'></td>
													<td className='border border-gray-300 p-2'>1.3. Bảo hiểm thất nghiệp (1%)</td>
													<td className='border border-gray-300 p-2 text-right'>- {payrollMonth?.employeeBHTN} VNĐ</td>
												</tr>
												<tr>
													<td className='border border-gray-300 p-2'>2</td>
													<td className='border border-gray-300 p-2'>Thuế TNCN</td>
													<td className='border border-gray-300 p-2 text-right'>- {payrollMonth?.tax} VNĐ</td>
												</tr>
												<tr>
													<td className='border border-gray-300 p-2'>3</td>
													<td className='border border-gray-300 p-2'>Phạt</td>
													<td className='border border-gray-300 p-2 text-right'>- {payrollMonth?.penalties} VNĐ</td>
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
														- {payrollMonth?.deductions} VNĐ
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
													<td className='border border-gray-300 p-2 text-right'>
														{payrollMonth?.maternityBenefit} VNĐ
													</td>
												</tr>
												<tr>
													<td className='border border-gray-300 p-2'>2</td>
													<td className='border border-gray-300 p-2'>Phụ cấp nghỉ bệnh</td>
													<td className='border border-gray-300 p-2 text-right'>{payrollMonth?.sickBenefit} VNĐ</td>
												</tr>
												<tr>
													<td className='border border-gray-300 p-2 text-right font-bold' colSpan={2}>
														Tổng cộng:
													</td>
													<td className='border border-gray-300 p-2 font-bold text-right'>
														{payrollMonth?.totalBenefit} VNĐ
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								) : (
									<div className='overflow-y-auto px-4 max-h-[430px] pb-2'>
										<p className='text-center text-sm'>Không có thông tin lương cho kỳ này.</p>
									</div>
								)}
								{monthYear && payrollMonth && (
									<div className='px-6' id='net-salary'>
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
														{payrollMonth?.netSalary
															? Math.floor(Number(payrollMonth?.netSalary)).toLocaleString('en-US')
															: '0'}{' '}
														VNĐ
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								)}
							</TabsContent>
							<TabsContent value='year' id='payroll-year'>
								<div className=' flex justify-center items-center mb-4 w-full ' id='yearly-pay-period'>
									<div className='flex justify-center items-center relative'>
										<label htmlFor='year' className=' mr-2 text-md font-medium'>
											Kỳ lương năm
										</label>
										<Input
											type='number'
											id='year'
											placeholder='YYYY'
											min='2020'
											max='2100'
											value={year}
											className='border rounded-sm p-2 block w-[90px] h-[30px] pr-[32px]'
											onChange={e => setYear(e.target.value)}
										/>
										<Button
											className='h-[30px] w-[30px] absolute right-0'
											onClick={() => {
												setMonthYear(prev => ({ ...prev, year: year, month: '01' }));
											}}
										>
											<TextSearch />
										</Button>
									</div>
								</div>

								{payrollsYearByUserID.length > 0 && monthYear.year ? (
									<div className='overflow-y-auto max-h-[380px]' id='payroll-year-content'>
										<Accordion
											type='single'
											collapsible
											value={activeTab?.currentTab || ''}
											className='w-full'
											onValueChange={handleTabChange}
										>
											{payrollsYearByUserID.map((item, index) => {
												const date = new Date(`${item?.monthOfYear}-01`);
												const formatted = date.toLocaleString('vi-VN', { month: '2-digit', year: 'numeric' });

												return (
													<AccordionItem value={`item-${index}`} key={index}>
														<AccordionTrigger>Kỳ lương {`${formatted.replace(',', ' năm ')}`}</AccordionTrigger>
														<AccordionContent>
															<div key={index} className='px-4 pb-2'>
																<div className='grid grid-col grid-cols-2'>
																	<p className='mb-2 text-xs'>
																		<strong>Mã Nhân Viên:</strong> {item?.userIdStr}
																	</p>
																	<p className='mb-2 text-xs'>
																		<strong>Ngày công đi làm:</strong> {item?.totalWorkingDays}
																	</p>
																</div>
																<div className='grid grid-col grid-cols-2'>
																	<p className='mb-2 text-xs'>
																		<strong>Họ và tên:</strong> {item?.fullName}
																	</p>
																	<p className='mb-2 text-xs'>
																		<strong>Ngày nghỉ lễ:</strong> {item?.totalHolidayLeaves}
																	</p>
																</div>

																<div className='grid grid-col grid-cols-2'>
																	<p className='mb-2 text-xs'>
																		<strong>Chức danh:</strong> {item?.roleName}
																	</p>
																	<p className='mb-2 text-xs'>
																		<strong>Ngày nghỉ phép:</strong> {item?.totalPaidLeaves}
																	</p>
																</div>

																<div className='grid grid-col grid-cols-2'>
																	<p className='mb-2 text-xs'>
																		<strong>Lương cơ bản:</strong> {item?.baseSalary}
																	</p>
																	<p className='mb-2 text-xs'>
																		<strong>Ngày nghỉ bệnh:</strong> {item?.totalSickLeaves}
																	</p>
																</div>

																<div className='grid grid-col grid-cols-2'>
																	<p className='mb-2 text-xs'>
																		<strong>Hệ số lương:</strong> {item?.salaryCoefficient}
																	</p>
																	<p className='mb-2 text-xs'>
																		<strong>Nghỉ thai sản:</strong> {item?.totalMaternityLeaves}
																	</p>
																</div>

																<div className='grid grid-col grid-cols-2'>
																	<p className='mb-2 text-xs'>
																		<strong>Ngày công chuẩn:</strong> {item?.standardWorkingDays}
																	</p>
																	<p className='mb-2 text-xs'>
																		<strong>Nghỉ không phép:</strong> {item?.totalUnpaidLeaves}
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
																			<td className='border border-gray-300 p-2 text-right'>{item?.mainSalary} VNĐ</td>
																		</tr>
																		<tr>
																			<td className='border border-gray-300 p-2'>2</td>
																			<td className='border border-gray-300 p-2'>Lương phụ cấp</td>
																			<td className='border border-gray-300 p-2 text-right'>{item?.allowance}</td>
																		</tr>
																		<tr>
																			<td className='border border-gray-300 p-2 text-right font-bold' colSpan={2}>
																				Tổng cộng:
																			</td>
																			<td className='border border-gray-300 p-2 font-bold text-right'>
																				{item?.grossSalary} VNĐ
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
																			<td className='border border-gray-300 p-2 text-right'>
																				- {item?.employeeBHXH} VNĐ
																			</td>
																		</tr>
																		<tr>
																			<td className='border border-gray-300 p-2'></td>
																			<td className='border border-gray-300 p-2'>1.2. Bảo hiểm y tế (1.5%)</td>
																			<td className='border border-gray-300 p-2 text-right'>
																				- {item?.employeeBHYT} VNĐ
																			</td>
																		</tr>
																		<tr>
																			<td className='border border-gray-300 p-2'></td>
																			<td className='border border-gray-300 p-2'>1.3. Bảo hiểm thất nghiệp (1%)</td>
																			<td className='border border-gray-300 p-2 text-right'>
																				- {item?.employeeBHTN} VNĐ
																			</td>
																		</tr>
																		<tr>
																			<td className='border border-gray-300 p-2'>2</td>
																			<td className='border border-gray-300 p-2'>Thuế TNCN</td>
																			<td className='border border-gray-300 p-2 text-right'>- {item?.tax} VNĐ</td>
																		</tr>
																		<tr>
																			<td className='border border-gray-300 p-2'>3</td>
																			<td className='border border-gray-300 p-2'>Phạt</td>
																			<td className='border border-gray-300 p-2 text-right'>- {item?.penalties} VNĐ</td>
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
																				- {item?.deductions} VNĐ
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
																			<td className='border border-gray-300 p-2 text-right'>
																				{item?.maternityBenefit} VNĐ
																			</td>
																		</tr>
																		<tr>
																			<td className='border border-gray-300 p-2'>2</td>
																			<td className='border border-gray-300 p-2'>Phụ cấp nghỉ bệnh</td>
																			<td className='border border-gray-300 p-2 text-right'>{item?.sickBenefit} VNĐ</td>
																		</tr>
																		<tr>
																			<td className='border border-gray-300 p-2 text-right font-bold' colSpan={2}>
																				Tổng cộng:
																			</td>
																			<td className='border border-gray-300 p-2 font-bold text-right'>
																				{item?.totalBenefit} VNĐ
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>
														</AccordionContent>
													</AccordionItem>
												);
											})}
										</Accordion>
									</div>
								) : (
									<div className='overflow-y-auto px-4 max-h-[430px] pb-2'>
										<p className='text-center text-sm'>Không có thông tin lương cho kỳ này.</p>
									</div>
								)}
								{activeTab.currentTab && (
									<div className='px-6' id='net-salary-year-tab'>
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
														{activeTab.netSalary} VNĐ
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								)}
							</TabsContent>
						</Tabs>
					</div>
				</div>
				<DialogFooter className='sm:justify-start'>
					<DialogClose asChild>
						<Button className='w-full'>Đóng</Button>
					</DialogClose>
					{activeTabList === 'month' && (
						<Button
							className='w-full bg-red-500 hover:bg-red-600 hover:text-white text-white'
							variant='outline'
							onClick={handleExportPayrollByMonth}
						>
							<FileText />
							Xuất PDF theo tháng
						</Button>
					)}
					{activeTabList === 'year' && (
						<Button
							className='w-full bg-red-500 hover:bg-red-600 hover:text-white text-white'
							variant='outline'
							onClick={handleExportPayrollByYear}
						>
							<FileText />
							Xuất PDF theo năm
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

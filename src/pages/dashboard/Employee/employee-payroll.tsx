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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchPayrollYearByUser } from '@/redux/slices/payrollByYearAndUserIdSlice';

import { RootState, useAppDispatch } from '@/redux/store';
import html2pdf from 'html2pdf.js';
import { BadgeDollarSign, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import removeAccents from 'remove-accents';
import EmployeePayrollMonth from './EmpployeePayroll/employee-payroll-month';
import EmployeePayrollYear from './EmpployeePayroll/employee-payroll-year';

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

	const [activeTabList, setActiveTabList] = useState('month');

	const dispatch = useAppDispatch();
	const { user } = useSelector((state: RootState) => state.user);
	const { payrollYearByUser } = useSelector((state: RootState) => state.payrollYearByUser);
	console.log(payrollYearByUser);
	const onChangeMonthYear = (year: string, month: string) => {
		setMonthYear({ year, month });
	};

	const onChangeYear = (year: string) => {
		setYear(year);
	};

	useEffect(() => {
		if (monthYear?.year && user) {
			dispatch(fetchPayrollYearByUser({ userId: 3, year: monthYear.year }));
		}
	}, [monthYear.year, dispatch]);

	useEffect(() => {
		const filteredByMonth = payrollYearByUser.filter(
			item => item.monthOfYear === `${monthYear.year}-${monthYear.month}`
		);
		setPayrollMonth(filteredByMonth.length > 0 ? filteredByMonth[0] : null);
	}, [monthYear, payrollYearByUser]);

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

			const nameSlug = removeAccents(payrollMonth?.fullName || 'unknown').replace(/\s+/g, '_');
			const options = {
				margin: 1,
				filename: `BTC_ThuNhap_${nameSlug}_${monthYear.month}_${monthYear.year}.pdf`,
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: { scale: 4 },
				jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
			};

			html2pdf(elementClone, options);
		}
	};

	const handleExportPayrollByYear = async () => {
		const headerElement = `<div class='max-w-4xl my-4 mx-auto bg-white px-4 rounded-lg'>
                            <h1 class='text-lg font-bold text-center mb-1'>CÔNG TY INVERSE</h1>
                            <p class='text-center text-sm mb-1'>
                              Địa chỉ: 273 An Dương Vương, Phường 3, Quận 5, Thành phố Hồ Chí Minh
                            </p>
                          </div>
                          <div class='flex flex-col justify-center items-center mb-1 w-full'>
                            <h2 class='text-base font-semibold text-center'>PHIẾU LƯƠNG</h2>
                            <label htmlFor='monthYear' class='text-md font-medium'>
                              Kỳ lương năm ${year}
                            </label>
                          </div>

                          <div class='px-4 text-sm mt-2 mb-4'>
                            <p class='mb-1 text-sm'>
                              <strong>Mã nhân viên:</strong> ${payrollYearByUser[payrollYearByUser.length - 1].userIdStr}
                            </p>
                            <p class='text-sm'>
                              <strong>Họ và tên:</strong> ${payrollYearByUser[payrollYearByUser.length - 1].fullName}
                            </p>
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

		const element = document.getElementById('payroll-year-content');

		if (element) {
			const elementClone = element.cloneNode(true) as HTMLElement;
			elementClone.insertAdjacentHTML('afterbegin', headerElement);
			elementClone.innerHTML += `<div class="page-break" style="page-break-after: always;"></div>` + signElement;

			const nameSlug = removeAccents(payrollYearByUser[payrollYearByUser.length - 1].fullName).replace(/\s+/g, '_');
			const options = {
				margin: 1,
				filename: `BTC_ThuNhap_${nameSlug}_${year}.pdf`,
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: { scale: 4 },
				jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
			};

			html2pdf(elementClone, options);
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
				className={`py-1 !w-[50vw] !max-w-none !h-[98vh] ${activeTabList === 'year' && '!w-[94vw]'} flex flex-col`}
				onOpenAutoFocus={e => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle></DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>

				<div className='flex-1 mb-4 '>
					<div>
						<div className='max-w-4xl mx-auto bg-white px-4 rounded-lg'>
							<h1 className='text-lg font-bold text-center mb-1'>Công ty Inverse</h1>

							<p className='text-center text-sm mb-4'>
								Địa chỉ: 273 An Dương Vương, Phường 3, Quận 5, Thành phố Hồ Chí Minh
							</p>
							<h2 className='text-md font-semibold text-center mb-2'>PHIẾU LƯƠNG</h2>
						</div>
						<Tabs value={activeTabList} onValueChange={setActiveTabList} className='w-full'>
							<div className='w-full flex justify-center items-center'>
								<TabsList className='grid  w-[240px] grid-cols-2'>
									<TabsTrigger value='month'>Theo tháng</TabsTrigger>
									<TabsTrigger value='year'>Theo năm</TabsTrigger>
								</TabsList>
							</div>
							<TabsContent value='month' id='payroll-month'>
								<EmployeePayrollMonth
									payrollMonth={payrollMonth}
									monthYear={monthYear}
									onChangeYear={onChangeYear}
									onChangeMonthYear={onChangeMonthYear}
								/>
							</TabsContent>
							<TabsContent value='year' id='payroll-year'>
								<EmployeePayrollYear
									year={year}
									monthYear={monthYear}
									onChangeYear={onChangeYear}
									onChangeMonthYear={onChangeMonthYear}
								/>
							</TabsContent>
						</Tabs>
					</div>
				</div>
				<DialogFooter className='sm:justify-start'>
					<DialogClose asChild>
						<Button className='w-full'>Đóng</Button>
					</DialogClose>
					{activeTabList === 'month' && (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button className='w-full bg-red-500 hover:bg-red-600 hover:text-white text-white' variant='outline'>
									<FileText />
									Xuất PDF theo tháng
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
					)}
					{activeTabList === 'year' && (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button className='w-full bg-red-500 hover:bg-red-600 hover:text-white text-white' variant='outline'>
									<FileText />
									Xuất PDF theo tháng
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Xác nhận xuất PDF</AlertDialogTitle>
									<AlertDialogDescription>Bạn có chắc chắn muốn xuất PDF này không?</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Thoát</AlertDialogCancel>
									<AlertDialogAction onClick={handleExportPayrollByYear}>Xác nhận</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

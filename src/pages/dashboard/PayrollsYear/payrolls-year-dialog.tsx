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
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchPayrollYearByUser } from '@/redux/slices/payrollByYearAndUserIdSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import html2pdf from 'html2pdf.js';
import { FileText } from 'lucide-react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import removeAccents from 'remove-accents';

type PayrollsYearDialogProps = {
	isDialogOpen: boolean;
	selectedId: number;
	year: string;
	handleCloseDialog: () => void;
};

export default function PayrollsYearDialog({
	isDialogOpen,
	year,
	selectedId,
	handleCloseDialog
}: PayrollsYearDialogProps) {
	const dispatch = useAppDispatch();
	const { payrollYearByUser } = useSelector((state: RootState) => state.payrollYearByUser);
	// const payrollYearByUser = [
	// 	{
	// 		id: 3,
	// 		idString: 'PR-3',
	// 		standardWorkingDays: 18,
	// 		maternityBenefit: '0',
	// 		sickBenefit: '2,000,000',
	// 		netSalary: '8634166.6665',
	// 		grossSalary: '9,833,333',
	// 		tax: '0',
	// 		employeeBHXH: '786,667',
	// 		employeeBHYT: '147,500',
	// 		employeeBHTN: '98,333',
	// 		penalties: '166,667',
	// 		allowance: '500,000',
	// 		totalIncome: '10,634,167',
	// 		attendanceId: 27,
	// 		monthOfYear: '2025-01',
	// 		userIdStr: 'NV-5',
	// 		fullName: 'Phạm Quang Huy',
	// 		roleName: 'WAREHOUSE_MANAGER',
	// 		salaryCoefficient: 1.2,
	// 		totalWorkingDays: 14,
	// 		totalSickLeaves: 4,
	// 		totalPaidLeaves: 0,
	// 		totalMaternityLeaves: 0,
	// 		totalUnpaidLeaves: 0,
	// 		totalHolidayLeaves: 5,
	// 		baseSalary: '12,000,000',
	// 		totalBaseSalary: '12,000,000',
	// 		totalBenefit: '2,000,000',
	// 		mainSalary: '9,333,333',
	// 		deductions: '1,199,167'
	// 	},
	// 	{
	// 		id: 4,
	// 		idString: 'PR-4',
	// 		standardWorkingDays: 20,
	// 		maternityBenefit: '0',
	// 		sickBenefit: '1,500,000',
	// 		netSalary: '9320000',
	// 		grossSalary: '10,500,000',
	// 		tax: '0',
	// 		employeeBHXH: '840,000',
	// 		employeeBHYT: '157,500',
	// 		employeeBHTN: '105,000',
	// 		penalties: '100,000',
	// 		allowance: '400,000',
	// 		totalIncome: '11,000,000',
	// 		attendanceId: 28,
	// 		monthOfYear: '2025-02',
	// 		userIdStr: 'NV-5',
	// 		fullName: 'Phạm Quang Huy',
	// 		roleName: 'WAREHOUSE_MANAGER',
	// 		salaryCoefficient: 1,
	// 		totalWorkingDays: 19,
	// 		totalSickLeaves: 1,
	// 		totalPaidLeaves: 0,
	// 		totalMaternityLeaves: 0,
	// 		totalUnpaidLeaves: 0,
	// 		totalHolidayLeaves: 1,
	// 		baseSalary: '12,000,000',
	// 		totalBaseSalary: '12,000,000',
	// 		totalBenefit: '1,500,000',
	// 		mainSalary: '10,000,000',
	// 		deductions: '1,068,500'
	// 	},
	// 	{
	// 		id: 5,
	// 		idString: 'PR-5',
	// 		standardWorkingDays: 22,
	// 		maternityBenefit: '0',
	// 		sickBenefit: '0',
	// 		netSalary: '9600000',
	// 		grossSalary: '10,666,667',
	// 		tax: '0',
	// 		employeeBHXH: '853,333',
	// 		employeeBHYT: '160,000',
	// 		employeeBHTN: '106,667',
	// 		penalties: '0',
	// 		allowance: '600,000',
	// 		totalIncome: '11,266,667',
	// 		attendanceId: 29,
	// 		monthOfYear: '2025-03',
	// 		userIdStr: 'NV-5',
	// 		fullName: 'Phạm Quang Huy',
	// 		roleName: 'WAREHOUSE_MANAGER',
	// 		salaryCoefficient: 1,
	// 		totalWorkingDays: 22,
	// 		totalSickLeaves: 0,
	// 		totalPaidLeaves: 0,
	// 		totalMaternityLeaves: 0,
	// 		totalUnpaidLeaves: 0,
	// 		totalHolidayLeaves: 0,
	// 		baseSalary: '12,000,000',
	// 		totalBaseSalary: '12,000,000',
	// 		totalBenefit: '0',
	// 		mainSalary: '10,666,667',
	// 		deductions: '1,120,000'
	// 	},
	// 	{
	// 		id: 6,
	// 		idString: 'PR-6',
	// 		standardWorkingDays: 21,
	// 		maternityBenefit: '0',
	// 		sickBenefit: '1,000,000',
	// 		netSalary: '9250000',
	// 		grossSalary: '10,300,000',
	// 		tax: '0',
	// 		employeeBHXH: '824,000',
	// 		employeeBHYT: '154,500',
	// 		employeeBHTN: '103,000',
	// 		penalties: '200,000',
	// 		allowance: '500,000',
	// 		totalIncome: '10,800,000',
	// 		attendanceId: 30,
	// 		monthOfYear: '2025-04',
	// 		userIdStr: 'NV-5',
	// 		fullName: 'Phạm Quang Huy',
	// 		roleName: 'WAREHOUSE_MANAGER',
	// 		salaryCoefficient: 1,
	// 		totalWorkingDays: 20,
	// 		totalSickLeaves: 1,
	// 		totalPaidLeaves: 0,
	// 		totalMaternityLeaves: 0,
	// 		totalUnpaidLeaves: 1,
	// 		totalHolidayLeaves: 2,
	// 		baseSalary: '12,000,000',
	// 		totalBaseSalary: '12,000,000',
	// 		totalBenefit: '1,000,000',
	// 		mainSalary: '9,800,000',
	// 		deductions: '1,081,500'
	// 	},
	// 	{
	// 		id: 7,
	// 		idString: 'PR-7',
	// 		standardWorkingDays: 22,
	// 		maternityBenefit: '0',
	// 		sickBenefit: '0',
	// 		netSalary: '9500000',
	// 		grossSalary: '10,500,000',
	// 		tax: '0',
	// 		employeeBHXH: '840,000',
	// 		employeeBHYT: '157,500',
	// 		employeeBHTN: '105,000',
	// 		penalties: '0',
	// 		allowance: '500,000',
	// 		totalIncome: '11,000,000',
	// 		attendanceId: 31,
	// 		monthOfYear: '2025-05',
	// 		userIdStr: 'NV-5',
	// 		fullName: 'Phạm Quang Huy',
	// 		roleName: 'WAREHOUSE_MANAGER',
	// 		salaryCoefficient: 1,
	// 		totalWorkingDays: 22,
	// 		totalSickLeaves: 0,
	// 		totalPaidLeaves: 0,
	// 		totalMaternityLeaves: 0,
	// 		totalUnpaidLeaves: 0,
	// 		totalHolidayLeaves: 0,
	// 		baseSalary: '12,000,000',
	// 		totalBaseSalary: '12,000,000',
	// 		totalBenefit: '0',
	// 		mainSalary: '10,500,000',
	// 		deductions: '1,102,500'
	// 	},
	// 	{
	// 		id: 8,
	// 		idString: 'PR-8',
	// 		standardWorkingDays: 20,
	// 		maternityBenefit: '0',
	// 		sickBenefit: '1,000,000',
	// 		netSalary: '9100000',
	// 		grossSalary: '10,100,000',
	// 		tax: '0',
	// 		employeeBHXH: '808,000',
	// 		employeeBHYT: '151,500',
	// 		employeeBHTN: '101,000',
	// 		penalties: '100,000',
	// 		allowance: '500,000',
	// 		totalIncome: '10,600,000',
	// 		attendanceId: 32,
	// 		monthOfYear: '2025-06',
	// 		userIdStr: 'NV-5',
	// 		fullName: 'Phạm Quang Huy',
	// 		roleName: 'WAREHOUSE_MANAGER',
	// 		salaryCoefficient: 1,
	// 		totalWorkingDays: 19,
	// 		totalSickLeaves: 1,
	// 		totalPaidLeaves: 0,
	// 		totalMaternityLeaves: 0,
	// 		totalUnpaidLeaves: 0,
	// 		totalHolidayLeaves: 1,
	// 		baseSalary: '12,000,000',
	// 		totalBaseSalary: '12,000,000',
	// 		totalBenefit: '1,000,000',
	// 		mainSalary: '9,800,000',
	// 		deductions: '1,060,500'
	// 	},
	// 	{
	// 		id: 9,
	// 		idString: 'PR-9',
	// 		standardWorkingDays: 23,
	// 		maternityBenefit: '0',
	// 		sickBenefit: '0',
	// 		netSalary: '9700000',
	// 		grossSalary: '10,800,000',
	// 		tax: '0',
	// 		employeeBHXH: '864,000',
	// 		employeeBHYT: '162,000',
	// 		employeeBHTN: '108,000',
	// 		penalties: '0',
	// 		allowance: '600,000',
	// 		totalIncome: '11,400,000',
	// 		attendanceId: 33,
	// 		monthOfYear: '2025-07',
	// 		userIdStr: 'NV-5',
	// 		fullName: 'Phạm Quang Huy',
	// 		roleName: 'WAREHOUSE_MANAGER',
	// 		salaryCoefficient: 1,
	// 		totalWorkingDays: 23,
	// 		totalSickLeaves: 0,
	// 		totalPaidLeaves: 0,
	// 		totalMaternityLeaves: 0,
	// 		totalUnpaidLeaves: 0,
	// 		totalHolidayLeaves: 0,
	// 		baseSalary: '12,000,000',
	// 		totalBaseSalary: '12,000,000',
	// 		totalBenefit: '0',
	// 		mainSalary: '10,800,000',
	// 		deductions: '1,134,000'
	// 	},
	// 	{
	// 		id: 10,
	// 		idString: 'PR-10',
	// 		standardWorkingDays: 21,
	// 		maternityBenefit: '0',
	// 		sickBenefit: '0',
	// 		netSalary: '9400000',
	// 		grossSalary: '10,400,000',
	// 		tax: '0',
	// 		employeeBHXH: '832,000',
	// 		employeeBHYT: '156,000',
	// 		employeeBHTN: '104,000',
	// 		penalties: '50,000',
	// 		allowance: '500,000',
	// 		totalIncome: '10,900,000',
	// 		attendanceId: 34,
	// 		monthOfYear: '2025-08',
	// 		userIdStr: 'NV-5',
	// 		fullName: 'Phạm Quang Huy',
	// 		roleName: 'WAREHOUSE_MANAGER',
	// 		salaryCoefficient: 1,
	// 		totalWorkingDays: 21,
	// 		totalSickLeaves: 0,
	// 		totalPaidLeaves: 0,
	// 		totalMaternityLeaves: 0,
	// 		totalUnpaidLeaves: 0,
	// 		totalHolidayLeaves: 1,
	// 		baseSalary: '12,000,000',
	// 		totalBaseSalary: '12,000,000',
	// 		totalBenefit: '0',
	// 		mainSalary: '10,400,000',
	// 		deductions: '1,092,000'
	// 	},
	// 	{
	// 		id: 11,
	// 		idString: 'PR-11',
	// 		standardWorkingDays: 20,
	// 		maternityBenefit: '0',
	// 		sickBenefit: '0',
	// 		netSalary: '8900000',
	// 		grossSalary: '9,900,000',
	// 		tax: '0',
	// 		employeeBHXH: '792,000',
	// 		employeeBHYT: '148,500',
	// 		employeeBHTN: '99,000',
	// 		penalties: '200,000',
	// 		allowance: '400,000',
	// 		totalIncome: '10,300,000',
	// 		attendanceId: 35,
	// 		monthOfYear: '2025-09',
	// 		userIdStr: 'NV-5',
	// 		fullName: 'Phạm Quang Huy',
	// 		roleName: 'WAREHOUSE_MANAGER',
	// 		salaryCoefficient: 1,
	// 		totalWorkingDays: 20,
	// 		totalSickLeaves: 0,
	// 		totalPaidLeaves: 0,
	// 		totalMaternityLeaves: 0,
	// 		totalUnpaidLeaves: 0,
	// 		totalHolidayLeaves: 0,
	// 		baseSalary: '12,000,000',
	// 		totalBaseSalary: '12,000,000',
	// 		totalBenefit: '0',
	// 		mainSalary: '9,900,000',
	// 		deductions: '1,039,500'
	// 	},
	// 	{
	// 		id: 12,
	// 		idString: 'PR-12',
	// 		standardWorkingDays: 22,
	// 		maternityBenefit: '0',
	// 		sickBenefit: '0',
	// 		netSalary: '9600000',
	// 		grossSalary: '10,600,000',
	// 		tax: '0',
	// 		employeeBHXH: '848,000',
	// 		employeeBHYT: '158,000',
	// 		employeeBHTN: '106,000',
	// 		penalties: '0',
	// 		allowance: '500,000',
	// 		totalIncome: '11,100,000',
	// 		attendanceId: 36,
	// 		monthOfYear: '2025-10',
	// 		userIdStr: 'NV-5',
	// 		fullName: 'Phạm Quang Huy',
	// 		roleName: 'WAREHOUSE_MANAGER',
	// 		salaryCoefficient: 1,
	// 		totalWorkingDays: 22,
	// 		totalSickLeaves: 0,
	// 		totalPaidLeaves: 0,
	// 		totalMaternityLeaves: 0,
	// 		totalUnpaidLeaves: 0,
	// 		totalHolidayLeaves: 0,
	// 		baseSalary: '12,000,000',
	// 		totalBaseSalary: '12,000,000',
	// 		totalBenefit: '0',
	// 		mainSalary: '10,600,000',
	// 		deductions: '1,112,000'
	// 	},
	// 	{
	// 		id: 13,
	// 		idString: 'PR-13',
	// 		standardWorkingDays: 21,
	// 		maternityBenefit: '0',
	// 		sickBenefit: '1,000,000',
	// 		netSalary: '9200000',
	// 		grossSalary: '10,200,000',
	// 		tax: '0',
	// 		employeeBHXH: '816,000',
	// 		employeeBHYT: '153,000',
	// 		employeeBHTN: '102,000',
	// 		penalties: '100,000',
	// 		allowance: '400,000',
	// 		totalIncome: '10,600,000',
	// 		attendanceId: 37,
	// 		monthOfYear: '2025-11',
	// 		userIdStr: 'NV-5',
	// 		fullName: 'Phạm Quang Huy',
	// 		roleName: 'WAREHOUSE_MANAGER',
	// 		salaryCoefficient: 1,
	// 		totalWorkingDays: 20,
	// 		totalSickLeaves: 1,
	// 		totalPaidLeaves: 0,
	// 		totalMaternityLeaves: 0,
	// 		totalUnpaidLeaves: 0,
	// 		totalHolidayLeaves: 1,
	// 		baseSalary: '12,000,000',
	// 		totalBaseSalary: '12,000,000',
	// 		totalBenefit: '1,000,000',
	// 		mainSalary: '9,800,000',
	// 		deductions: '1,071,000'
	// 	}
	// 	// {
	// 	// 	id: 14,
	// 	// 	idString: 'PR-14',
	// 	// 	standardWorkingDays: 20,
	// 	// 	maternityBenefit: '0',
	// 	// 	sickBenefit: '0',
	// 	// 	netSalary: '9400000',
	// 	// 	grossSalary: '10,200,000',
	// 	// 	tax: '0',
	// 	// 	employeeBHXH: '816,000',
	// 	// 	employeeBHYT: '153,000',
	// 	// 	employeeBHTN: '102,000',
	// 	// 	penalties: '0',
	// 	// 	allowance: '400,000',
	// 	// 	totalIncome: '10,600,000',
	// 	// 	attendanceId: 38,
	// 	// 	monthOfYear: '2025-12',
	// 	// 	userIdStr: 'NV-5',
	// 	// 	fullName: 'Phạm Quang Huy',
	// 	// 	roleName: 'WAREHOUSE_MANAGER',
	// 	// 	salaryCoefficient: 1,
	// 	// 	totalWorkingDays: 20,
	// 	// 	totalSickLeaves: 0,
	// 	// 	totalPaidLeaves: 0,
	// 	// 	totalMaternityLeaves: 0,
	// 	// 	totalUnpaidLeaves: 0,
	// 	// 	totalHolidayLeaves: 1,
	// 	// 	baseSalary: '12,000,000',
	// 	// 	totalBaseSalary: '12,000,000',
	// 	// 	totalBenefit: '0',
	// 	// 	mainSalary: '10,200,000',
	// 	// 	deductions: '1,071,000'
	// 	// }
	// ];

	useEffect(() => {
		// dispatch(fetchPayrollYearByUser({ userId: 3, year: '2025' }));
		dispatch(fetchPayrollYearByUser({ userId: selectedId, year }));
	}, [dispatch, selectedId, year]);

	const parseMoney = (str: string) => Number(str.replace(/,/g, ''));

	const total = payrollYearByUser.reduce(
		(acc, curr) => {
			acc.baseSalary += parseMoney(curr.baseSalary);
			acc.salaryCoefficient += curr.salaryCoefficient;
			acc.grossSalary += parseMoney(curr.grossSalary);
			acc.allowance += parseMoney(curr.allowance);
			acc.employeeBHXH += parseMoney(curr.employeeBHXH);
			acc.employeeBHYT += parseMoney(curr.employeeBHYT);
			acc.employeeBHTN += parseMoney(curr.employeeBHTN);
			acc.tax += parseMoney(curr.tax);
			acc.penalties += parseMoney(curr.penalties);
			acc.maternityBenefit += parseMoney(curr.maternityBenefit);
			acc.sickBenefit += parseMoney(curr.sickBenefit);
			acc.netSalary += parseMoney(curr.netSalary);
			acc.totalHolidayLeaves += curr.totalHolidayLeaves;
			acc.totalMaternityLeaves += curr.totalMaternityLeaves;
			acc.totalPaidLeaves += curr.totalPaidLeaves;
			acc.totalSickLeaves += curr.totalSickLeaves;
			acc.totalUnpaidLeaves += curr.totalUnpaidLeaves;
			acc.totalWorkingDays += curr.totalWorkingDays;
			return acc;
		},
		{
			baseSalary: 0,
			salaryCoefficient: 0,
			grossSalary: 0,
			allowance: 0,
			employeeBHXH: 0,
			employeeBHYT: 0,
			employeeBHTN: 0,
			tax: 0,
			penalties: 0,
			maternityBenefit: 0,
			sickBenefit: 0,
			netSalary: 0,
			totalHolidayLeaves: 0,
			totalMaternityLeaves: 0,
			totalPaidLeaves: 0,
			totalSickLeaves: 0,
			totalUnpaidLeaves: 0,
			totalWorkingDays: 0
		}
	);

	const handleExportPayrollByYear = async () => {
		const headerElement = `<div class='max-w-4xl my-4 mx-auto bg-white px-4 rounded-lg'>
                            <h1 class='text-lg font-bold text-center mb-1'>CÔNG TY INKVERSE</h1>
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

		const element = document.getElementById('payroll-year');

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

	console.log(payrollYearByUser);

	return (
		<>
			<Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
				<DialogContent className='h-[96vh] min-w-[94vw]'>
					<DialogHeader>
						<DialogTitle></DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>

					<div className='mx-auto max-w-4xl rounded-lg bg-white px-4'>
						<h1 className='mb-1 text-center text-lg font-bold'>CÔNG TY INKVERSE</h1>

						<p className='mb-1 text-center text-sm'>
							Địa chỉ: 273 An Dương Vương, Phường 3, Quận 5, Thành phố Hồ Chí Minh
						</p>
					</div>
					<div className='mb-1 flex w-full flex-col items-center justify-center'>
						<h2 className='text-center text-base font-semibold'>PHIẾU LƯƠNG</h2>
						<label htmlFor='monthYear' className='text-md font-medium'>
							Kỳ lương năm {year}
						</label>
					</div>

					<div className='mt-1 text-sm'>
						<p className='mb-1 text-sm'>
							<strong>Mã nhân viên:</strong> {payrollYearByUser[payrollYearByUser.length - 1]?.idString}
						</p>
						<p className='text-sm'>
							<strong>Họ và tên:</strong> {payrollYearByUser[payrollYearByUser.length - 1]?.fullName}
						</p>
					</div>

					<div className='overflow-auto' id='payroll-year'>
						<div className='overflow-auto rounded-lg border border-gray-400'>
							<Table className='sticky min-w-full table-fixed'>
								<TableHeader>
									<TableRow>
										<TableHead
											rowSpan={2}
											className='w-[70px] border border-gray-400 bg-gray-200 py-2 text-center text-xs text-black'
										></TableHead>

										<TableHead
											rowSpan={2}
											className='border border-gray-400 bg-gray-200 py-1 text-center text-xs text-black'
										>
											Lương cơ bản
										</TableHead>
										<TableHead
											rowSpan={2}
											className='w-[40px] border border-gray-400 bg-gray-200 px-0 py-1 text-center text-xs text-black'
										>
											Hệ <br /> số
										</TableHead>

										{/* <TableHead
											rowSpan={2}
											className='border py-1 border-gray-400 text-black text-center text-xs bg-gray-200'
										>
											Lương Gross
										</TableHead> */}
										<TableHead
											rowSpan={2}
											className='border border-gray-400 bg-gray-200 py-1 text-center text-xs text-black'
										>
											Phụ cấp
										</TableHead>

										<TableHead
											rowSpan={2}
											className='border border-gray-400 bg-gray-200 py-1 text-center text-xs text-black'
										>
											Phạt <br /> đi trễ
										</TableHead>

										<TableHead
											colSpan={6}
											className='h-[40px] w-[300px] border border-gray-400 bg-gray-200 py-1 text-center text-xs text-black'
										>
											Số ngày
										</TableHead>

										<TableHead
											rowSpan={2}
											className='border border-gray-400 bg-gray-200 py-1 text-center text-xs text-black'
										>
											Lương Gross
										</TableHead>

										<TableHead
											colSpan={3}
											className='h-[40px] border border-gray-400 bg-gray-200 py-1 text-center text-xs text-black'
										>
											Bảo hiểm bắt buộc
										</TableHead>

										<TableHead
											rowSpan={2}
											className='w-[60px] border border-gray-400 bg-gray-200 py-1 text-center text-xs text-black'
										>
											Thuế TNCN
										</TableHead>

										<TableHead
											colSpan={2}
											className='h-[40px] border border-gray-400 bg-gray-200 py-1 text-center text-xs text-black'
										>
											Trợ cấp BHXH
										</TableHead>

										<TableHead
											rowSpan={2}
											className='border border-gray-400 bg-gray-200 py-1 text-center text-xs text-black'
										>
											Tổng thực nhận <br /> (Lương Net)
										</TableHead>
									</TableRow>

									<TableRow>
										{/* LEAVE TYPE */}
										<TableHead
											rowSpan={2}
											className='w-[50px] border border-gray-400 bg-gray-200 px-0 py-1 text-center text-xs text-black'
										>
											Nghỉ <br /> không <br />
											phép
										</TableHead>
										<TableHead
											rowSpan={2}
											className='w-[50px] border border-gray-400 bg-gray-200 px-0 py-1 text-center text-xs text-black'
										>
											Nghỉ <br />
											phép
										</TableHead>
										<TableHead
											rowSpan={2}
											className='w-[50px] border border-gray-400 bg-gray-200 px-0 py-1 text-center text-xs text-black'
										>
											Nghỉ <br /> lễ
										</TableHead>
										<TableHead
											rowSpan={2}
											className='w-[50px] border border-gray-400 bg-gray-200 px-0 py-1 text-center text-xs text-black'
										>
											Nghỉ <br /> thai <br /> sản
										</TableHead>
										<TableHead
											rowSpan={2}
											className='w-[50px] border border-gray-400 bg-gray-200 px-0 py-1 text-center text-xs text-black'
										>
											Nghỉ bệnh
										</TableHead>
										<TableHead
											rowSpan={2}
											className='w-[50px] border border-gray-400 bg-gray-200 px-0 py-1 text-center text-xs text-black'
										>
											Ngày làm tiêu chuẩn
										</TableHead>
										{/* LEAVE TYPE */}

										<TableHead className='border border-gray-400 bg-gray-200 py-1 text-center text-xs text-black'>
											BHXH (8%)
										</TableHead>
										<TableHead className='border border-gray-400 bg-gray-200 py-1 text-center text-xs text-black'>
											BHYT (1.5%)
										</TableHead>
										<TableHead className='border border-gray-400 bg-gray-200 py-1 text-center text-xs text-black'>
											BHTN (1%)
										</TableHead>

										<TableHead className='border border-gray-400 bg-gray-200 py-1 text-center text-xs text-black'>
											Phụ cấp <br /> thai sản
										</TableHead>
										<TableHead className='border border-gray-400 bg-gray-200 py-1 text-center text-xs text-black'>
											Phụ cấp <br />
											nghỉ bệnh
										</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{[...Array(12)].map((_, idx) => {
										const currentMonth = idx + 1;

										const row = payrollYearByUser?.find(item => {
											const monthStr = item.monthOfYear?.split('-')[1];
											const month = parseInt(monthStr, 10);
											return month === currentMonth;
										});

										return (
											<TableRow key={idx}>
												<TableCell className='border border-gray-400 bg-gray-200 px-[3.5px] py-[2px] text-center text-xs'>
													Tháng {idx + 1}
												</TableCell>
												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row?.baseSalary ? `${row.baseSalary} ` : ''}
												</TableCell>
												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row?.salaryCoefficient ? `${row.salaryCoefficient}` : ''}
												</TableCell>

												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row?.allowance ? `${row.allowance} ` : ''}
												</TableCell>

												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row?.penalties ? `${row.penalties} ` : ''}
												</TableCell>

												{/* LEAVE TYPE */}
												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row && row.totalUnpaidLeaves >= 0 ? `${row.totalUnpaidLeaves}` : ''}
												</TableCell>
												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row && row.totalPaidLeaves >= 0 ? `${row.totalPaidLeaves}` : ''}
												</TableCell>
												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row && row.totalHolidayLeaves >= 0 ? `${row.totalHolidayLeaves}` : ''}
												</TableCell>
												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row && row?.totalMaternityLeaves >= 0 ? `${row.totalMaternityLeaves}` : ''}
												</TableCell>
												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row && row?.totalSickLeaves >= 0 ? `${row.totalSickLeaves}` : ''}
												</TableCell>
												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row && row?.standardWorkingDays >= 0 ? `${row.standardWorkingDays}` : ''}
												</TableCell>
												{/* LEAVE TYPE */}

												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row?.grossSalary ? `${row.grossSalary} ` : ''}
												</TableCell>

												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row?.employeeBHXH ? `${row.employeeBHXH} ` : ''}
												</TableCell>
												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row?.employeeBHYT ? `${row.employeeBHYT} ` : ''}
												</TableCell>
												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row?.employeeBHTN ? `${row.employeeBHTN} ` : ''}
												</TableCell>
												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row?.tax ? `${row.tax} ` : ''}
												</TableCell>

												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row?.maternityBenefit ? `${row.maternityBenefit} ` : ''}
												</TableCell>
												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row?.sickBenefit ? `${row.sickBenefit} ` : ''}
												</TableCell>
												<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
													{row?.netSalary ? `${Number(row.netSalary).toLocaleString('en-US')} ` : ''}
												</TableCell>
											</TableRow>
										);
									})}

									<TableRow>
										<TableCell className='border border-gray-400 bg-gray-200 px-[3.5px] py-[2px] text-center text-xs'>
											Tổng cột
										</TableCell>
										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.baseSalary.toLocaleString('en-US')}
										</TableCell>
										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.salaryCoefficient}
										</TableCell>

										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.allowance.toLocaleString('en-US')}
										</TableCell>
										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.penalties.toLocaleString('en-US')}
										</TableCell>

										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.totalUnpaidLeaves}
										</TableCell>
										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.totalPaidLeaves}
										</TableCell>
										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.totalHolidayLeaves}
										</TableCell>
										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.totalMaternityLeaves}
										</TableCell>
										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.totalSickLeaves}
										</TableCell>
										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.totalWorkingDays}
										</TableCell>

										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.grossSalary.toLocaleString('en-US')}
										</TableCell>

										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.employeeBHXH.toLocaleString('en-US')}
										</TableCell>
										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.employeeBHYT.toLocaleString('en-US')}
										</TableCell>
										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.employeeBHTN.toLocaleString('en-US')}
										</TableCell>

										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.tax.toLocaleString('en-US')}
										</TableCell>

										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.maternityBenefit.toLocaleString('en-US')}
										</TableCell>
										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.sickBenefit.toLocaleString('en-US')}
										</TableCell>
										<TableCell className='border border-gray-400 px-[3.5px] py-[2px] text-center text-[10px] text-[#737373]'>
											{total?.netSalary.toLocaleString('en-US')}
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</div>
					<DialogFooter className='sm:justify-end'>
						<div className='flex justify-end gap-2'>
							<Button
								className='rounded-md border bg-white px-4 py-2 text-black transition hover:bg-gray-100'
								onClick={handleCloseDialog}
							>
								Thoát
							</Button>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										className='w-full bg-red-500 text-white hover:bg-red-600 hover:text-white'
										variant='outline'
										// onClick={handleExportPayrollByYear}
									>
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
										<AlertDialogAction onClick={handleExportPayrollByYear}>Xác nhận</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

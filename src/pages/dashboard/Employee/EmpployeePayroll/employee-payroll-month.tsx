import { Input } from '@/components/ui/input';

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

interface EmployeePayrollMonthProps {
	payrollMonth: Payroll | null;
	monthYear: { year: string; month: string };
	onChangeMonthYear: (year: string, month: string) => void;
	onChangeYear: (year: string) => void;
}

const EmployeePayrollMonth = ({
	payrollMonth,
	monthYear,
	onChangeMonthYear,
	onChangeYear
}: EmployeePayrollMonthProps) => {
	return (
		<>
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
						onChangeMonthYear(year, month);
						onChangeYear(year);
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
								<td className='border border-gray-300 p-2 font-bold text-right'>{payrollMonth?.grossSalary} VNĐ</td>
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
								<td className='border border-gray-300 p-2 font-bold text-right'>- {payrollMonth?.deductions} VNĐ</td>
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
								<td className='border border-gray-300 p-2 text-right'>{payrollMonth?.maternityBenefit} VNĐ</td>
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
								<td className='border border-gray-300 p-2 font-bold text-right'>{payrollMonth?.totalBenefit} VNĐ</td>
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
									{payrollMonth?.netSalary ? Math.floor(Number(payrollMonth?.netSalary)).toLocaleString('en-US') : '0'}{' '}
									VNĐ
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			)}
		</>
	);
};

export default EmployeePayrollMonth;

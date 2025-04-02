import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RootState } from '@/redux/store';
import { TextSearch } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

interface EmployeePayrollYearProps {
	year: string;
	monthYear: { year: string; month: string };
	onChangeYear: (year: string) => void;
	onChangeMonthYear: (year: string, month: string) => void;
}

const EmployeePayrollYear = ({ year, monthYear, onChangeYear, onChangeMonthYear }: EmployeePayrollYearProps) => {
	const [activeTab, setActiveTab] = useState<{ currentTab: string | null; netSalary: string | null }>({
		currentTab: null,
		netSalary: null
	});
	const { payrollsYearByUserID } = useSelector((state: RootState) => state.payrollsYearByUserID);

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

	return (
		<>
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
						onChange={e => onChangeYear(e.target.value)}
					/>
					<Button
						className='h-[30px] w-[30px] absolute right-0'
						onClick={() => {
							onChangeMonthYear(year, '01');
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
		</>
	);
};

export default EmployeePayrollYear;

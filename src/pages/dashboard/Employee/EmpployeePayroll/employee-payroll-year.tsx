import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RootState } from '@/redux/store';
import { TextSearch } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface EmployeePayrollYearProps {
	year: string;
	monthYear: { year: string; month: string };
	onChangeYear: (year: string) => void;
	onChangeMonthYear: (year: string, month: string) => void;
}

const EmployeePayrollYear = ({ year, monthYear, onChangeYear, onChangeMonthYear }: EmployeePayrollYearProps) => {
	const { payrollYearByUser } = useSelector((state: RootState) => state.payrollYearByUser);

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
			netSalary: 0
		}
	);

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

			{payrollYearByUser.length > 0 && monthYear.year ? (
				<>
					<div className='text-sm mt-1 mb-2'>
						<p className='mb-1 text-sm'>
							<strong>Mã nhân viên:</strong> {payrollYearByUser[payrollYearByUser.length - 1].userIdStr}
						</p>
						<p className='text-sm'>
							<strong>Họ và tên:</strong> {payrollYearByUser[payrollYearByUser.length - 1].fullName}
						</p>
					</div>
					<div className='overflow-auto' id='payroll-year-content'>
						<div className='rounded-lg overflow-auto border border-gray-400'>
							<Table className='min-w-full sticky table-fixed '>
								<TableHeader>
									<TableRow>
										<TableHead
											rowSpan={2}
											className='border py-2 border-gray-400 text-black text-center w-[70px] text-xs bg-gray-200'
										></TableHead>

										<TableHead
											rowSpan={2}
											className='border py-1 border-gray-400 text-black text-center text-xs bg-gray-200'
										>
											Lương cơ bản
										</TableHead>
										<TableHead
											rowSpan={2}
											className='border py-1 border-gray-400 w-[60px] text-black text-center text-xs bg-gray-200'
										>
											Hệ số
										</TableHead>

										<TableHead
											rowSpan={2}
											className='border py-1 border-gray-400 text-black text-center text-xs bg-gray-200'
										>
											Lương Gross
										</TableHead>
										<TableHead
											rowSpan={2}
											className='border py-1 border-gray-400 text-black text-center text-xs bg-gray-200'
										>
											Phụ cấp
										</TableHead>

										<TableHead
											colSpan={3}
											className='border py-1 h-[40px] border-gray-400 text-black text-center text-xs bg-gray-200'
										>
											Bảo hiểm bắt buộc
										</TableHead>

										<TableHead
											rowSpan={2}
											className='border py-1 border-gray-400 w-[60px] text-black text-center text-xs bg-gray-200'
										>
											Thuế TNCN
										</TableHead>
										<TableHead
											rowSpan={2}
											className='border py-1 border-gray-400 text-black text-center text-xs bg-gray-200'
										>
											Phạt
										</TableHead>

										<TableHead
											colSpan={2}
											className='border py-1 h-[40px] border-gray-400 text-black text-center text-xs bg-gray-200'
										>
											Trợ cấp BHXH
										</TableHead>

										<TableHead
											rowSpan={2}
											className='border py-1 border-gray-400 text-black text-center text-xs bg-gray-200'
										>
											Tổng thực nhận <br /> (Lương Net)
										</TableHead>
									</TableRow>

									<TableRow>
										<TableHead className='border py-1 border-gray-400 text-black text-center text-xs bg-gray-200'>
											BHXH (8%)
										</TableHead>
										<TableHead className='border py-1 border-gray-400 text-black text-center text-xs bg-gray-200'>
											BHYT (1.5%)
										</TableHead>
										<TableHead className='border py-1 border-gray-400 text-black text-center text-xs bg-gray-200'>
											BHTN (1%)
										</TableHead>

										<TableHead className='border py-1 border-gray-400 text-black text-center text-xs bg-gray-200'>
											Phụ cấp <br /> thai sản
										</TableHead>
										<TableHead className='border py-1 border-gray-400 text-black text-center text-xs bg-gray-200'>
											Phụ cấp <br />
											nghỉ bệnh
										</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{[...Array(12)].map((_, idx) => {
										const row = payrollYearByUser?.[idx];
										return (
											<TableRow key={idx}>
												<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-xs bg-gray-200'>
													Thg {idx + 1}
												</TableCell>
												<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
													{row?.baseSalary ? `${row.baseSalary} VNĐ` : ''}
												</TableCell>
												<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
													{row?.salaryCoefficient ? `${row.salaryCoefficient}` : ''}
												</TableCell>
												<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
													{row?.grossSalary ? `${row.grossSalary} VNĐ` : ''}
												</TableCell>

												<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
													{row?.allowance ? `${row.allowance} VNĐ` : ''}
												</TableCell>
												<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
													{row?.employeeBHXH ? `${row.employeeBHXH} VNĐ` : ''}
												</TableCell>
												<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
													{row?.employeeBHYT ? `${row.employeeBHYT} VNĐ` : ''}
												</TableCell>
												<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
													{row?.employeeBHTN ? `${row.employeeBHTN} VNĐ` : ''}
												</TableCell>
												<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
													{row?.tax ? `${row.tax} VNĐ` : ''}
												</TableCell>
												<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
													{row?.penalties ? `${row.penalties} VNĐ` : ''}
												</TableCell>
												<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
													{row?.maternityBenefit ? `${row.maternityBenefit} VNĐ` : ''}
												</TableCell>
												<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
													{row?.sickBenefit ? `${row.sickBenefit} VNĐ` : ''}
												</TableCell>
												<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
													{row?.netSalary ? `${Number(row.netSalary).toLocaleString('en-US')} VNĐ` : ''}
												</TableCell>
											</TableRow>
										);
									})}

									<TableRow>
										<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] bg-gray-200'>
											Tổng cột
										</TableCell>
										<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
											{total?.baseSalary.toLocaleString('en-US')} VNĐ
										</TableCell>
										<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
											{total?.salaryCoefficient}
										</TableCell>
										<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
											{total?.grossSalary.toLocaleString('en-US')} VNĐ
										</TableCell>
										<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
											{total?.allowance.toLocaleString('en-US')} VNĐ
										</TableCell>

										<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
											{total?.employeeBHXH.toLocaleString('en-US')} VNĐ
										</TableCell>
										<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
											{total?.employeeBHYT.toLocaleString('en-US')} VNĐ
										</TableCell>
										<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
											{total?.employeeBHTN.toLocaleString('en-US')} VNĐ
										</TableCell>

										<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
											{total?.tax.toLocaleString('en-US')} VNĐ
										</TableCell>
										<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
											{total?.penalties.toLocaleString('en-US')} VNĐ
										</TableCell>

										<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
											{total?.maternityBenefit.toLocaleString('en-US')} VNĐ
										</TableCell>
										<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
											{total?.sickBenefit.toLocaleString('en-US')} VNĐ
										</TableCell>
										<TableCell className='py-[2px] px-[3.5px] border border-gray-400 text-center text-[10px] text-[#737373]'>
											{total?.netSalary.toLocaleString('en-US')} VNĐ
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</div>
				</>
			) : (
				<div className='overflow-y-auto px-4 max-h-[430px] pb-2'>
					<p className='text-center text-sm'>Không có thông tin lương cho kỳ này.</p>
				</div>
			)}
		</>
	);
};

export default EmployeePayrollYear;

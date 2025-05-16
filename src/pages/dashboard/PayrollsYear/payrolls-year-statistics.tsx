import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/redux/store';
import { fetchSalaryYearStatistics } from '@/redux/slices/salaryYearStatisticsSlice';
import { fetchSalaryYearMonthStatistics } from '@/redux/slices/salaryYearMonthStatictiscSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	LineChart,
	CartesianGrid,
	Line,
	ResponsiveContainer
} from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#E91E63'];

export default function PayrollsYearStatistics({ year }: { year: string }) {
	const dispatch = useAppDispatch();
	const { statistics } = useSelector((state: RootState) => state.salaryYearStatistics);
	const { payrollsByYear } = useSelector((state: RootState) => state.payrollsByYear);
	const { statisticsYearMonth } = useSelector((state: RootState) => state.salaryYearMonthStatistics);

	useEffect(() => {
		if (year) {
			dispatch(fetchSalaryYearStatistics(`${year}`));
			dispatch(fetchSalaryYearMonthStatistics(`${year}`));
		}
	}, [dispatch, year]);

	console.log(payrollsByYear);

	// ===== Start: Statistics data for average =====
	const leaveData = [
		{ name: 'Nghỉ bệnh', value: statistics?.totalSickLeaves },
		{ name: 'Nghỉ phép', value: statistics?.totalPaidLeaves },
		{ name: 'Nghỉ không phép', value: statistics?.totalUnpaidLeaves },
		{ name: 'Nghỉ lễ', value: statistics?.totalHolidayLeaves }
	];

	const totalCompanyCost = [
		{
			name: 'Tổng lương GROSS',
			value: Number(statistics?.totalGrossSalary?.replace(/,/g, ''))
		},
		{
			name: 'Tổng lương NET',
			value: Number(statistics?.totalNetSalary?.replace(/,/g, ''))
		},
		{
			name: 'Tổng phụ cấp',
			value: Number(statistics?.totalAllowance?.replace(/,/g, ''))
		},
		{
			name: 'Tổng thuế',
			value: Number(statistics?.totalTax?.replace(/,/g, ''))
		},
		{
			name: 'Tổng phạt',
			value: Number(statistics?.totalPenalties?.replace(/,/g, ''))
		}
	];

	const averageSalaryData = [
		{
			name: 'GROSS',
			value: Number(statistics?.avgGrossSalary?.replace(/,/g, '')),
			fill: '#0088FE'
		},
		{
			name: 'NET',
			value: Number(statistics?.avgNetSalary?.replace(/,/g, '')),
			fill: '#00C49F'
		},
		{
			name: 'Phụ cấp',
			value: Number(statistics?.avgAllowance?.replace(/,/g, '')),
			fill: '#FFBB28'
		},
		{
			name: 'Phạt',
			value: Number(statistics?.avgPenalties?.replace(/,/g, '')),
			fill: '#FF8042'
		},
		{
			name: 'Thuế',
			value: Number(statistics?.avgTax?.replace(/,/g, '')),
			fill: '#E91E63'
		}
	];

	const insuranceData = [
		{
			name: 'BHXH',
			value: Number(statistics?.totalEmployeeBHXH?.replace(/,/g, '')),
			fill: '#8884d8'
		},
		{
			name: 'BHYT',
			value: Number(statistics?.totalEmployeeBHYT?.replace(/,/g, '')),
			fill: '#82ca9d'
		},
		{
			name: 'BHTN',
			value: Number(statistics?.totalEmployeeBHTN?.replace(/,/g, '')),
			fill: '#ffc658'
		}
	];

	const hasNonZeroLeaveData = leaveData.some(item => item && typeof item.value === 'number' && item.value > 0);
	const hasNoneZeroCompanyCostData = totalCompanyCost.some(
		item => item && typeof item.value === 'number' && item.value > 0
	);
	// ===== End: Statistics data for average =====

	// ===== Start: Statistics data for 12 months =====
	const leaveTypeAllMonth = statisticsYearMonth?.map(item => ({
		name: item.month,
		totalPaidLeaves: Number(item.totalPaidLeaves),
		totalUnpaidLeaves: Number(item.totalUnpaidLeaves),
		totalHolidayLeaves: Number(item.totalHolidayLeaves),
		totalSickLeaves: Number(item.totalSickLeaves),
		totalMaternityLeaves: Number(item.totalMaternityLeaves),
		averageWorkingDays: Number(item.averageWorkingDays)
	}));

	const salaryAvgAllMonth = statisticsYearMonth?.map(item => ({
		name: item.month,
		avgGrossSalary: Number(item.avgGrossSalary.replace(/,/g, '')),
		avgNetSalary: Number(item.avgNetSalary.replace(/,/g, '')),
		avgAllowance: Number(item.avgAllowance.replace(/,/g, '')),
		avgPenalties: Number(item.avgPenalties.replace(/,/g, '')),
		avgTax: Number(item.avgTax.replace(/,/g, '')),
		costPerEmployee: Number(item.costPerEmployee.replace(/,/g, ''))
	}));

	const totalCompanyCostAllMonth = statisticsYearMonth?.map(item => ({
		name: item.month,
		totalGrossSalary: Number(item.totalGrossSalary.replace(/,/g, '')),
		totalNetSalary: Number(item.totalNetSalary.replace(/,/g, '')),
		totalAllowance: Number(item.totalAllowance.replace(/,/g, '')),
		totalTax: Number(item.totalTax.replace(/,/g, '')),
		totalPenalties: Number(item.totalPenalties.replace(/,/g, '')),
		totalCompanyCost: Number(item.totalCompanyCost.replace(/,/g, ''))
	}));

	const insuranceAllMonth = statisticsYearMonth?.map(item => ({
		name: item.month,
		totalEmployeeBHXH: Number(item.totalEmployeeBHXH.replace(/,/g, '')),
		totalEmployeeBHYT: Number(item.totalEmployeeBHYT.replace(/,/g, '')),
		totalEmployeeBHTN: Number(item.totalEmployeeBHTN.replace(/,/g, ''))
	}));
	// ===== End: Statistics data for 12 months =====

	const formatNumber = (value: number) => {
		return `${new Intl.NumberFormat('vi-VN').format(value)} `;
	};

	return (
		<div className='mb-2'>
			<div className='rounded-md bg-white p-4 shadow'>
				{statisticsYearMonth && statisticsYearMonth.length > 0 ? (
					<Tabs defaultValue='leaveTypeAllMonth' className='w-full'>
						<TabsList className='m-auto mb-2 grid w-[80%] grid-cols-4 items-center justify-center'>
							<TabsTrigger value='leaveTypeAllMonth'>Thống kê ngày nghỉ</TabsTrigger>
							<TabsTrigger value='salaryAvg'>Thống kê lương trung bình</TabsTrigger>
							<TabsTrigger value='companyCost'>Thống kê chi phí công ty</TabsTrigger>
							<TabsTrigger value='insurance'>Thống kê bảo hiểm nhân viên</TabsTrigger>
						</TabsList>
						<TabsContent value='leaveTypeAllMonth'>
							<h3 className='my-2 text-center text-lg font-medium'>Thống kê ngày nghỉ theo tháng</h3>
							<ResponsiveContainer width='100%' height={300}>
								<LineChart data={leaveTypeAllMonth} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='name' />
									<YAxis tickFormatter={value => formatNumber(value)} />
									<Tooltip formatter={value => `${formatNumber(Number(value))} ngày`} />
									<Legend />
									<Line
										type='monotone'
										dataKey='averageWorkingDays'
										stroke='#0088FE'
										name='Ngày làm việc trung bình'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line
										type='monotone'
										dataKey='totalPaidLeaves'
										stroke='#00C49F'
										name='Nghỉ phép'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line
										type='monotone'
										dataKey='totalSickLeaves'
										stroke='#FFBB28'
										name='Nghỉ bệnh'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line
										type='monotone'
										dataKey='totalHolidayLeaves'
										stroke='#FF8042'
										name='Nghỉ lễ'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line
										type='monotone'
										dataKey='totalUnpaidLeaves'
										stroke='#E91E63'
										name='Nghỉ không phép'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line
										type='monotone'
										dataKey='totalMaternityLeaves'
										stroke='#9C27B0'
										name='Nghỉ thai sản'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</TabsContent>
						<TabsContent value='salaryAvg'>
							<h3 className='my-2 text-center text-lg font-medium'>Thống kê lương trung bình theo tháng</h3>
							<ResponsiveContainer width='100%' height={300}>
								<LineChart data={salaryAvgAllMonth} margin={{ top: 20, right: 30, left: 50, bottom: 10 }}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='name' />
									<YAxis tickFormatter={value => formatNumber(value)} />
									<Tooltip formatter={value => `${formatNumber(Number(value))} VNĐ`} />
									<Legend />
									<Line
										type='monotone'
										dataKey='costPerEmployee'
										stroke='#673AB7'
										name='Lương CTY chi trả trung bình'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line
										type='monotone'
										dataKey='avgGrossSalary'
										stroke='#0088FE'
										name='Lương GROSS'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line
										type='monotone'
										dataKey='avgNetSalary'
										stroke='#00C49F'
										name='Lương NET'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line
										type='monotone'
										dataKey='avgAllowance'
										stroke='#FFBB28'
										name='Phụ cấp'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line
										type='monotone'
										dataKey='avgPenalties'
										stroke='#FF8042'
										name='Phạt'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line type='monotone' dataKey='avgTax' stroke='#E91E63' name='Thuế' strokeWidth={2} dot={{ r: 4 }} />
								</LineChart>
							</ResponsiveContainer>
						</TabsContent>
						<TabsContent value='companyCost'>
							<h3 className='my-2 text-center text-lg font-medium'>Thống kê chi phí công ty theo tháng</h3>
							<ResponsiveContainer width='100%' height={300}>
								<LineChart data={totalCompanyCostAllMonth} margin={{ top: 20, right: 30, left: 50, bottom: 10 }}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='name' />
									<YAxis tickFormatter={value => formatNumber(value)} />
									<Tooltip formatter={value => `${formatNumber(Number(value))} VNĐ`} />
									<Legend />
									<Line
										type='monotone'
										dataKey='totalCompanyCost'
										stroke='#673AB7'
										name='Tổng chi phí công ty'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line
										type='monotone'
										dataKey='totalGrossSalary'
										stroke='#0088FE'
										name='Tổng lương GROSS'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line
										type='monotone'
										dataKey='totalNetSalary'
										stroke='#00C49F'
										name='Tổng lương NET'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line
										type='monotone'
										dataKey='totalAllowance'
										stroke='#FFBB28'
										name='Tổng phụ cấp'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line
										type='monotone'
										dataKey='totalTax'
										stroke='#FF8042'
										name='Tổng thuế'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line
										type='monotone'
										dataKey='totalPenalties'
										stroke='#E91E63'
										name='Tổng phạt'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</TabsContent>
						<TabsContent value='insurance'>
							<h3 className='my-2 text-center text-lg font-medium'>Thống kê bảo hiểm nhân viên theo tháng</h3>
							<ResponsiveContainer width='100%' height={300}>
								<LineChart data={insuranceAllMonth} margin={{ top: 20, right: 30, left: 50, bottom: 10 }}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='name' />
									<YAxis tickFormatter={value => formatNumber(value)} />
									<Tooltip formatter={value => `${formatNumber(Number(value))} VNĐ`} />
									<Legend />
									<Line
										type='monotone'
										dataKey='totalEmployeeBHXH'
										stroke='#0088FE'
										name='Tổng BHXH'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line
										type='monotone'
										dataKey='totalEmployeeBHYT'
										stroke='#00C49F'
										name='Tổng BHYT'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
									<Line
										type='monotone'
										dataKey='totalEmployeeBHTN'
										stroke='#FFBB28'
										name='Tổng BHTN'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</TabsContent>
					</Tabs>
				) : (
					<p className='my-2'>Không có dữ liệu thống kê</p>
				)}
			</div>

			<Accordion type='single' collapsible className='mt-2 w-full rounded-md bg-white p-4 shadow'>
				<AccordionItem value='item-1'>
					<AccordionTrigger>Tổng quan nguồn lực và chi phí nhân sự</AccordionTrigger>
					<AccordionContent>
						<div className='mt-4 grid grid-cols-2 gap-2'>
							{/* Statistics data for leave types */}
							<div className='rounded-md bg-white p-4'>
								<h3 className='text-lg font-medium'>Phân loại ngày nghỉ</h3>
								<div className='flex justify-center'>
									{payrollsByYear.length > 0 && hasNonZeroLeaveData ? (
										<PieChart width={450} height={350} className='m-auto'>
											<Pie
												data={leaveData}
												dataKey='value'
												nameKey='name'
												cx='50%'
												cy='50%'
												outerRadius={100}
												fill='#8884d8'
												label
											>
												{leaveData.map((_, index) => (
													<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
												))}
											</Pie>
											<Tooltip formatter={value => formatNumber(Number(value))} />
											<Legend />
										</PieChart>
									) : (
										<p className='my-2'>Không có dữ liệu thống kê</p>
									)}
								</div>
							</div>

							{/* Statistics data for company costs */}
							<div className='rounded-md bg-white p-4'>
								<h3 className='text-lg font-medium'>Phân bổ chi phí công ty</h3>
								<div className='flex justify-center'>
									{payrollsByYear.length > 0 && hasNoneZeroCompanyCostData ? (
										<PieChart width={450} height={350}>
											<Pie
												data={totalCompanyCost}
												dataKey='value'
												nameKey='name'
												cx='50%'
												cy='50%'
												outerRadius={100}
												fill='#8884d8'
												label={({ value }) => `${formatNumber(Number(value))} VNĐ`}
											>
												{totalCompanyCost.map((_, index) => (
													<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
												))}
											</Pie>
											<Tooltip formatter={value => `${formatNumber(Number(value))} VNĐ`} />
											<Legend />
										</PieChart>
									) : (
										<p className='my-2'>Không có dữ liệu thống kê</p>
									)}
								</div>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value='item-2'>
					<AccordionTrigger>Tổng hợp lương và bảo hiểm</AccordionTrigger>
					<AccordionContent>
						<div className='mb-2 mt-2 grid grid-cols-2 gap-2'>
							{/* Statistics data for average salary */}
							<div className='rounded-md bg-white p-4'>
								<h3 className='text-lg font-medium'>Thống kê khoản lương trung bình</h3>
								<div className='flex justify-center'>
									{payrollsByYear.length > 0 ? (
										<BarChart
											width={600}
											height={300}
											data={averageSalaryData}
											margin={{
												top: 20,
												right: 30,
												left: 50,
												bottom: 20
											}}
										>
											<CartesianGrid strokeDasharray='3 3' />
											<XAxis dataKey='name' />
											<YAxis tickFormatter={value => formatNumber(value)} />
											<Tooltip formatter={value => `${formatNumber(Number(value))} VNĐ`} />
											{/* <Legend />  */}
											<Bar dataKey='value' name='Giá trị' fill='#333' radius={[4, 4, 0, 0]}>
												{averageSalaryData.map((entry, index) => (
													<Cell key={`cell-${index}`} fill={entry.fill} />
												))}
											</Bar>
										</BarChart>
									) : (
										<p className='my-2'>Không có dữ liệu thống kê</p>
									)}
								</div>
							</div>

							{/* Statistics data for insurance */}
							<div className='rounded-md bg-white p-4'>
								<h3 className='text-lg font-medium'>Thống kê bảo hiểm nhân viên</h3>
								<div className='flex justify-center'>
									{payrollsByYear.length > 0 ? (
										<BarChart
											width={600}
											height={300}
											data={insuranceData}
											margin={{
												top: 20,
												right: 30,
												left: 50,
												bottom: 20
											}}
										>
											<CartesianGrid strokeDasharray='3 3' />
											<XAxis dataKey='name' />
											<YAxis tickFormatter={value => formatNumber(value)} />
											<Tooltip formatter={value => `${formatNumber(Number(value))} VNĐ`} />
											{/* <Legend /> */}
											<Bar dataKey='value' name='Giá trị' radius={[4, 4, 0, 0]}>
												{insuranceData.map((entry, index) => (
													<Cell key={`cell-${index}`} fill={entry.fill} />
												))}
											</Bar>
										</BarChart>
									) : (
										<p className='my-2'>Không có dữ liệu thống kê</p>
									)}
								</div>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}

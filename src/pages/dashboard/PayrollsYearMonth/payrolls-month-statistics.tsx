import { useEffect } from 'react';
import { RootState, useAppDispatch } from '@/redux/store';
import { fetchSalaryMonthStatistics } from '@/redux/slices/salaryMonthStatisticsSlice';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#E91E63'];

export default function PayrollsMonthStatistics({ month, year }: { month: string; year: string }) {
	const dispatch = useAppDispatch();
	const { statistics } = useSelector((state: RootState) => state.salaryMonthStatistics);
	const { payrollsByYearMonth } = useSelector((state: RootState) => state.payrollsByYearMonth);

	useEffect(() => {
		dispatch(fetchSalaryMonthStatistics(`${year}-${month}`));
	}, [dispatch, month, year]);

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
	const hasNonZeroTotalCompanyCost = totalCompanyCost.some(
		item => item && typeof item.value === 'number' && item.value > 0
	);
	const formatNumber = (value: number) => {
		return `${new Intl.NumberFormat('vi-VN').format(value)} `;
	};

	return (
		<div className='mb-2'>
			<div className='grid grid-cols-2 gap-2'>
				{/* Pie chart for leave data */}
				<div className='rounded-md bg-white p-4 shadow'>
					<h3 className='text-lg font-medium'>Phân loại ngày nghỉ</h3>
					<div className='flex justify-center'>
						{payrollsByYearMonth.length > 0 && hasNonZeroLeaveData ? (
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
				<div className='rounded-md bg-white p-4 shadow'>
					<h3 className='text-lg font-medium'>Phân bổ chi phí công ty</h3>
					<div className='flex justify-center'>
						{payrollsByYearMonth.length > 0 && hasNonZeroTotalCompanyCost ? (
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

			<div className='mt-2 grid grid-cols-2 gap-2'>
				<div className='rounded-md bg-white p-4 shadow'>
					<h3 className='text-lg font-medium'>Thống kê khoản lương trung bình</h3>
					<div className='flex justify-center'>
						{payrollsByYearMonth.length > 0 ? (
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

				<div className='rounded-md bg-white p-4 shadow'>
					<h3 className='text-lg font-medium'>Thống kê bảo hiểm</h3>
					<div className='flex justify-center'>
						{payrollsByYearMonth.length > 0 ? (
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
		</div>
	);
}

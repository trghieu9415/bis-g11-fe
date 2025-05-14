import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/redux/store';
import { fetchEmployeeMonthStatistics } from '@/redux/slices/employeeMonthStatisticsSlice';
import { Input } from '@/components/ui/input';

import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#E91E63'];

interface Statistics {
	id: number;
	monthOfYear: string;
	activeEmployees: number;
	newEmployees: number;
	contractExpired: number;
	avgAge: number;
	genderRatio: string;
	permanentEmployees: number;
	probationEmployees: number;
	avgTenure: number;
}

export default function EmployeeMonthStatistics() {
	const dispatch = useAppDispatch();
	const { users } = useSelector((state: RootState) => state.users);
	const { statistics } = useSelector((state: RootState) => state.employeeMonthStatistics); // Changed from employeeMonthStatistics to employeeStatistics

	const [hasValidData, setHasValidData] = useState<boolean>(false);

	const getCurrentYearMonth = () => {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		return `${year}-${month}`;
	};

	const checkHasData = (stats: Statistics | null) => {
		if (!stats) return false;
		const { id, monthOfYear, ...relevantStats } = stats;
		return Object.values(relevantStats).some(
			value => (typeof value === 'number' && value > 0) || (typeof value === 'string' && value !== '0.0%')
		);
	};

	useEffect(() => {
		const currentYearMonth = getCurrentYearMonth();
		const [year, month] = currentYearMonth.split('-');
		dispatch(fetchEmployeeMonthStatistics(`${year}-${month}`));
	}, [dispatch]);

	useEffect(() => {
		if (statistics) {
			setHasValidData(checkHasData(statistics));
		}
	}, [statistics]);

	const formatNumber = (value: number) => {
		return `${new Intl.NumberFormat('vi-VN').format(value)} `;
	};

	const employeeStructure = [
		{
			title: 'Nhân viên hoạt động',
			value: statistics?.activeEmployees
		},
		{ title: 'Nhân viên mới', value: statistics?.newEmployees },
		{ title: 'Nhân viên hết hạn hợp đồng', value: statistics?.contractExpired }
	];

	const constractStatus = [
		{ title: 'Chính thức', value: statistics?.permanentEmployees },
		{ title: 'Thử việc', value: statistics?.probationEmployees }
	];

	const genderRatio = [
		{
			title: 'Nam',
			value: Number(statistics?.genderRatio?.replace('%', ''))
		},
		{
			title: 'Nữ',
			value: 100 - Number(statistics?.genderRatio?.replace('%', ''))
		}
	];

	return (
		<div className='mb-2'>
			<div className='mb-2'>
				<Input
					type='month'
					id='monthYear'
					defaultValue={getCurrentYearMonth()}
					className='m-auto block h-[30px] w-[160px] rounded-md border p-2'
					min='2020-01'
					max='2100-12'
					onChange={e => {
						const [year, month] = e.target.value.split('-');
						dispatch(fetchEmployeeMonthStatistics(`${year}-${month}`));
					}}
				/>
			</div>
			<div className='grid grid-cols-4 gap-2'>
				<div className='rounded-md bg-white p-4'>
					<h3 className='text-lg font-medium'>Cơ cấu nhân sự</h3>
					<div className='flex justify-center'>
						{users.length > 0 && hasValidData ? (
							<BarChart
								width={240}
								height={300}
								data={employeeStructure}
								layout='vertical'
								margin={{
									top: 20,
									right: 0,
									left: 20,
									bottom: 5
								}}
							>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis type='number' tickFormatter={value => formatNumber(value)} />
								<YAxis dataKey='title' type='category' width={90} />
								<Tooltip formatter={value => formatNumber(Number(value))} />
								{/* <Legend /> */}
								<Bar dataKey='value' name='Số lượng' radius={[0, 4, 4, 0]}>
									{employeeStructure.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Bar>
							</BarChart>
						) : (
							<p className='my-2'>Không có dữ liệu thống kê</p>
						)}
					</div>
				</div>
				<div className='rounded-md bg-white p-4'>
					<h3 className='text-lg font-medium'>Tỷ lệ giới tính</h3>
					<div className='flex justify-center'>
						{users.length > 0 && hasValidData ? (
							<PieChart width={240} height={300}>
								<Pie
									data={genderRatio}
									dataKey='value'
									nameKey='title'
									cx='50%'
									cy='50%'
									outerRadius={100}
									fill='#8884d8'
									label={({ value }) => `${value.toFixed(1)}%`}
								>
									{genderRatio.map((_, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip formatter={value => `${Number(value).toFixed(2)}%`} />
								<Legend />
							</PieChart>
						) : (
							<p className='my-2'>Không có dữ liệu thống kê</p>
						)}
					</div>
				</div>
				<div className='rounded-md bg-white p-4'>
					<h3 className='text-lg font-medium'>Trạng thái hợp đồng</h3>
					<div className='flex justify-center'>
						{users.length > 0 && hasValidData ? (
							<PieChart width={240} height={300}>
								<Pie
									data={constractStatus}
									dataKey='value'
									nameKey='title'
									cx='50%'
									cy='50%'
									outerRadius={100}
									fill='#8884d8'
									label={({ value }) => `${value}`}
								>
									{constractStatus.map((_, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip formatter={value => `${Number(value)}`} />
								<Legend />
							</PieChart>
						) : (
							<p className='my-2'>Không có dữ liệu thống kê</p>
						)}
					</div>
				</div>

				<div className='flex flex-col justify-start gap-4'>
					<div className='rounded-md bg-white p-6 shadow'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600'>Tuổi trung bình</p>
								{users.length > 0 && hasValidData ? (
									<h3 className='mt-2 text-3xl font-bold text-gray-900'>
										{statistics?.avgAge ? statistics.avgAge.toFixed(1) : 0}
										<span className='ml-1 text-lg font-medium'>tuổi</span>
									</h3>
								) : (
									<p className='my-2'>Không có dữ liệu thống kê</p>
								)}
							</div>
							<div className='rounded-full bg-blue-50 p-3'>
								<svg
									className='h-8 w-8 text-blue-500'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
									/>
								</svg>
							</div>
						</div>
					</div>
					<div className='rounded-md bg-white p-6 shadow'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600'>Thâm niên trung bình</p>
								{users.length > 0 && hasValidData ? (
									<h3 className='mt-2 text-3xl font-bold text-gray-900'>
										{statistics?.avgTenure ? statistics.avgTenure.toFixed(1) : 0}
										<span className='ml-1 text-lg font-medium'>năm</span>
									</h3>
								) : (
									<p className='my-2'>Không có dữ liệu thống kê</p>
								)}
							</div>
							<div className='rounded-full bg-green-50 p-3'>
								<svg
									className='h-8 w-8 text-green-500'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

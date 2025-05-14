import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/redux/store';
import { fetchEmployeeYearStatistics } from '@/redux/slices/employeeYearStatisticsSlice';
import { fetchEmployeeYearMonthStatistics } from '@/redux/slices/employeeYearMonthStatisticsSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TextSearch } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
	CartesianGrid,
	ResponsiveContainer,
	LineChart,
	Line
} from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#E91E63'];

interface Statistics {
	id: number;
	year: string;
	activeEmployees: number;
	newEmployees: number;
	contractExpired: number;
	avgAge: number;
	genderRatio: string;
	permanentEmployees: number;
	probationEmployees: number;
	avgTenure: number;
}

export default function EmployeeYearStatistics() {
	const dispatch = useAppDispatch();
	const { users } = useSelector((state: RootState) => state.users);
	const { statistics } = useSelector((state: RootState) => state.employeeYearStatistics);
	const { statisticsYearMonth } = useSelector((state: RootState) => state.employeeYearMonthStatistics);

	const [hasValidData, setHasValidData] = useState<boolean>(false);
	const [year, setYear] = useState('2025');

	const checkHasData = (stats: Statistics | null) => {
		if (!stats) return false;
		const { id, year, ...relevantStats } = stats;
		return Object.values(relevantStats).some(
			value => (typeof value === 'number' && value > 0) || (typeof value === 'string' && value !== '0.0%')
		);
	};

	useEffect(() => {
		if (year) {
			dispatch(fetchEmployeeYearStatistics(`${year}`));
			dispatch(fetchEmployeeYearMonthStatistics(`${year}`));
		}
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

	const employeeStructureAllMonth = statisticsYearMonth?.map(item => ({
		title: item.monthOfYear,
		activeEmployee: item.activeEmployees,
		newEmployee: item.newEmployees,
		contractExpired: item.contractExpired
	}));

	const contractStatusAllMonth = statisticsYearMonth?.map(item => ({
		title: item.monthOfYear,
		permanentEmployees: item.permanentEmployees,
		probationEmployees: item.probationEmployees
	}));

	const avgAgeAllMonth = statisticsYearMonth?.map(item => ({
		title: item.monthOfYear,
		avgAge: item.avgAge
	}));

	const genderRatioAllMonth = statisticsYearMonth?.map(item => ({
		title: item.monthOfYear,
		male: Number(item?.genderRatio?.replace('%', '')),
		female: 100 - Number(item?.genderRatio?.replace('%', ''))
	}));

	return (
		<div className='mb-2'>
			<div className='mb-2 flex justify-center gap-2'>
				<Input
					type='number'
					id='year'
					placeholder='YYYY'
					min='2020'
					max='2100'
					value={year}
					className='block h-[30px] w-[90px] rounded-sm border p-2 pr-[32px]'
					onChange={e => setYear(e.target.value)}
				/>
				<Button
					className='h-[30px] w-[30px]'
					onClick={() => {
						dispatch(fetchEmployeeYearStatistics(year));
						dispatch(fetchEmployeeYearMonthStatistics(year));
					}}
				>
					<TextSearch />
				</Button>
			</div>

			<div className='rounded-md bg-white p-4'>
				<Tabs defaultValue='employeeStructure' className='w-full'>
					<TabsList className='m-auto grid w-[60%] grid-cols-4'>
						<TabsTrigger value='employeeStructure'>Cơ cấu nhân sự</TabsTrigger>
						<TabsTrigger value='contractStatus'>Trạng thái hợp đồng</TabsTrigger>
						<TabsTrigger value='avgAge'>Tuổi trung bình</TabsTrigger>
						<TabsTrigger value='genderRatio'>Tỉ lệ giới tính</TabsTrigger>
					</TabsList>
					<TabsContent value='employeeStructure'>
						<h3 className='my-2 text-center text-lg font-medium'>Thống kê cơ cấu nhân sự</h3>
						<ResponsiveContainer width='100%' height={300}>
							<LineChart data={employeeStructureAllMonth} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='title' />
								<YAxis tickFormatter={value => formatNumber(value)} />
								<Tooltip formatter={value => formatNumber(Number(value))} />
								<Legend />
								<Line type='monotone' dataKey='activeEmployee' name='Nhân viên hoạt động' stroke='#0088FE' />
								<Line type='monotone' dataKey='newEmployee' name='Nhân viên mới' stroke='#00C49F' />
								<Line type='monotone' dataKey='contractExpired' name='Hết hạn hợp đồng' stroke='#FFBB28' />
							</LineChart>
						</ResponsiveContainer>
					</TabsContent>
					<TabsContent value='contractStatus'>
						<h3 className='my-2 text-center text-lg font-medium'>Thống kê trạng thái hợp đồng</h3>
						<ResponsiveContainer width='100%' height={300}>
							<LineChart data={contractStatusAllMonth} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='title' />
								<YAxis tickFormatter={value => formatNumber(value)} />
								<Tooltip formatter={value => formatNumber(Number(value))} />
								<Legend />
								<Line type='monotone' dataKey='permanentEmployees' name='Chính thức' stroke='#0088FE' />
								<Line type='monotone' dataKey='probationEmployees' name='Thử việc' stroke='#00C49F' />
							</LineChart>
						</ResponsiveContainer>
					</TabsContent>
					<TabsContent value='avgAge'>
						<h3 className='my-2 text-center text-lg font-medium'>Thống kê tuổi trung bình</h3>
						<ResponsiveContainer width='100%' height={300}>
							<LineChart data={avgAgeAllMonth} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='title' />
								<YAxis tickFormatter={value => formatNumber(value)} />
								<Tooltip formatter={value => formatNumber(Number(value))} />
								<Legend />
								<Line type='monotone' dataKey='avgAge' name='Tuổi trung bình' stroke='#0088FE' />
							</LineChart>
						</ResponsiveContainer>
					</TabsContent>
					<TabsContent value='genderRatio'>
						<h3 className='my-2 text-center text-lg font-medium'>Thống kê tỉ lệ giới tính</h3>
						<ResponsiveContainer width='100%' height={300}>
							<BarChart data={genderRatioAllMonth} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='title' />
								<YAxis />
								<Tooltip formatter={value => `${Number(value).toFixed(1)}%`} />
								<Legend />
								<Bar dataKey='male' name='Nam' stackId='a' fill='#0088FE' />
								<Bar dataKey='female' name='Nữ' stackId='a' fill='#00C49F' />
							</BarChart>
						</ResponsiveContainer>
					</TabsContent>
				</Tabs>
			</div>

			<div className='mt-2 grid grid-cols-4 gap-2'>
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

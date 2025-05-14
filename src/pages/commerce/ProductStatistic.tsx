import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, BookText } from 'lucide-react';
import { Bar, Pie } from 'recharts';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Cell } from 'recharts';
import CustomTable from '@/components/custom-table';
import axios from '@/services/customize-axios';
import { handleExportSalesReport, YearReportData } from './Warehouse Management/Products/utils/pdfExplore';
import { stat } from 'fs';

// Types
type ProductStatistics = {
	year?: number;
	quarter?: number;
	monthOfYear?: string;
	totalProductsSold: number;
	totalRevenue: number;
	totalProfit: number;
	totalCost: number;
	monthlySales?: Record<string, number>;
	quarterlySales?: Record<string, number>;
	topSellingProducts: TopSellingProduct[];
	categorySales: CategorySale[];
};

type TopSellingProduct = {
	id: number;
	name: string;
	quantitySold: number;
	revenue: number;
	profit: number;
};

type CategorySale = {
	id: number;
	name: string;
	quantitySold: number;
	revenue: number;
	profit: number;
	percentageOfTotal: number;
};

// Table column definitions
const productColumns: ColumnDef<TopSellingProduct>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<Button
				variant='link'
				className='w-16 text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				ID <ArrowUpDown />
			</Button>
		),
		enableHiding: false
	},
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<Button
				variant='link'
				className='w-40 text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Tên <ArrowUpDown />
			</Button>
		),
		cell: ({ row }) => (
			<span className='flex items-center'>
				<Button variant='ghost' className='mr-2 h-5 p-1 text-black'>
					<BookText />
				</Button>
				{row.getValue('name')}
			</span>
		),
		enableHiding: false
	},
	{
		accessorKey: 'quantitySold',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Số lượng <ArrowUpDown />
			</Button>
		),
		cell: ({ row }) => <span className='flex justify-center'>{row.getValue('quantitySold')}</span>
	},
	{
		accessorKey: 'revenue',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Doanh thu <ArrowUpDown />
			</Button>
		),
		cell: ({ row }) => <span className='flex justify-center'>{formatCurrency(row.getValue('revenue'))}</span>
	},
	{
		accessorKey: 'profit',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Lợi nhuận <ArrowUpDown />
			</Button>
		),
		cell: ({ row }) => <span className='flex justify-center'>{formatCurrency(row.getValue('profit'))}</span>
	}
];

const categoryColumns: ColumnDef<CategorySale>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<Button
				variant='link'
				className='w-16 text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				ID <ArrowUpDown />
			</Button>
		),
		enableHiding: false
	},
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<Button
				variant='link'
				className='w-40 text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Danh mục <ArrowUpDown />
			</Button>
		),
		enableHiding: false
	},
	{
		accessorKey: 'quantitySold',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Số lượng <ArrowUpDown />
			</Button>
		),
		cell: ({ row }) => <span className='flex justify-center'>{row.getValue('quantitySold')}</span>
	},
	{
		accessorKey: 'revenue',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Doanh thu <ArrowUpDown />
			</Button>
		),
		cell: ({ row }) => <span className='flex justify-center'>{formatCurrency(row.getValue('revenue'))}</span>
	},
	{
		accessorKey: 'profit',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Lợi nhuận <ArrowUpDown />
			</Button>
		),
		cell: ({ row }) => <span className='flex justify-center'>{formatCurrency(row.getValue('profit'))}</span>
	},
	{
		accessorKey: 'percentageOfTotal',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Tỷ lệ <ArrowUpDown />
			</Button>
		),
		cell: ({ row }) => <span className='flex justify-center'>{row.getValue('percentageOfTotal')}%</span>
	}
];

// Utility functions
const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const getCurrentYear = () => {
	return new Date().getFullYear();
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function ProductStatistics() {
	const [activeTab, setActiveTab] = useState('year');
	const [year, setYear] = useState(getCurrentYear());
	const [quarter, setQuarter] = useState(1);
	const [month, setMonth] = useState(1);
	const [loading, setLoading] = useState(false);
	const [stats, setStats] = useState<ProductStatistics | null>(null);
	const [yearStats, setYearStats] = useState<YearReportData | null>(null);

	// Fetch data based on active tab
	useEffect(() => {
		fetchStatistics();
	}, [activeTab, year, quarter, month]);

	useEffect(() => {
		fetchStatistics();
	}, []);

	const fetchStatistics = async () => {
		setLoading(true);
		try {
			let url = '';

			switch (activeTab) {
				case 'year':
					url = `/api/v1/statistics/products/year/${year}`;
					break;
				case 'quarter':
					url = `/api/v1/statistics/products/quarter/${year}/${quarter}`;
					break;
				case 'month':
					url = `/api/v1/statistics/products/month/${year}/${month}`;
					break;
				default:
					url = `/api/v1/statistics/products/year/${year}`;
			}

			const response = await axios.get(url);
			console.log(response);
			if (response) {
				setStats(response.data);
				console.log('line 257', response.data);

				const transformed: YearReportData = {
					totalRevenue: response.data.totalRevenue,
					totalCost: response.data.totalCost,
					totalProductsSold: response.data.totalProductsSold,
					totalProfit: response.data.totalProfit,
					monthlySales: response.data.monthlySales,
					quarterlySales: response.data.quarterlySales,
					topSellingProducts: response.data.topSellingProducts.map(product => ({
						id: product.id,
						name: product.name,
						quantitySold: product.quantitySold,
						revenue: product.revenue,
						profit: product.profit
					})),
					categorySales: response.data.categorySales.map(category => ({
						id: category.id,
						name: category.name,
						quantitySold: category.quantitySold,
						revenue: category.revenue,
						profit: category.profit,
						percentageOfTotal: category.percentageOfTotal
					}))
				};
				setYearStats(transformed);
				console.log(transformed);
			}
		} catch (error) {
			console.error('Error fetching statistics:', error);
		} finally {
			setLoading(false);
		}
	};

	// Transform data for charts
	const prepareMonthlyData = () => {
		if (!stats?.monthlySales) return [];

		const monthNames = {
			'01': 'Tháng 1',
			'02': 'Tháng 2',
			'03': 'Tháng 3',
			'04': 'Tháng 4',
			'05': 'Tháng 5',
			'06': 'Tháng 6',
			'07': 'Tháng 7',
			'08': 'Tháng 8',
			'09': 'Tháng 9',
			'10': 'Tháng 10',
			'11': 'Tháng 11',
			'12': 'Tháng 12'
		};

		return Object.entries(stats.monthlySales)
			.sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
			.map(([key, value]) => {
				const monthKey = key.split('-')[1];
				return {
					name: monthNames[monthKey as keyof typeof monthNames] || key,
					value: value
				};
			});
	};

	const prepareQuarterlyData = () => {
		if (!stats?.quarterlySales) return [];

		return Object.entries(stats.quarterlySales).map(([key, value]) => ({
			name: `Q${key}`,
			value: value
		}));
	};

	const prepareCategoryData = () => {
		return stats?.categorySales || [];
	};

	// Generate years for select
	const getYearOptions = () => {
		const currentYear = getCurrentYear();
		const years = [];
		for (let i = currentYear - 5; i <= currentYear; i++) {
			years.push(i);
		}
		return years;
	};
	const handleExportPDF = () => {
		console.log(yearStats);
		handleExportSalesReport(yearStats, year.toString());
	};

	return (
		<div className='w-full p-4'>
			<h1 className='mb-4 text-2xl font-bold'>Thống kê sản phẩm</h1>

			<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
				<TabsList className='mb-4 grid grid-cols-3'>
					<TabsTrigger value='year'>Theo năm</TabsTrigger>
					<TabsTrigger value='quarter'>Theo quý</TabsTrigger>
					<TabsTrigger value='month'>Theo tháng</TabsTrigger>
				</TabsList>

				{/* Year Tab */}
				<TabsContent value='year' className='space-y-4'>
					<div className='mb-4 flex items-center'>
						<Select value={year.toString()} onValueChange={value => setYear(parseInt(value))}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Chọn năm' />
							</SelectTrigger>
							<SelectContent>
								{getYearOptions().map(year => (
									<SelectItem key={year} value={year.toString()}>
										{year}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button className='ml-2' onClick={fetchStatistics}>
							Xem thống kê
						</Button>
						<Button className='ml-2' onClick={handleExportPDF}>
							Xuất PDF
						</Button>
					</div>

					{stats && renderStatisticsContent(stats, 'year', prepareMonthlyData(), prepareQuarterlyData())}
				</TabsContent>

				{/* Quarter Tab */}
				<TabsContent value='quarter' className='space-y-4'>
					<div className='mb-4 flex items-center'>
						<Select value={year.toString()} onValueChange={value => setYear(parseInt(value))}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Chọn năm' />
							</SelectTrigger>
							<SelectContent>
								{getYearOptions().map(year => (
									<SelectItem key={year} value={year.toString()}>
										{year}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select value={quarter.toString()} onValueChange={value => setQuarter(parseInt(value))}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Chọn quý' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='1'>Quý 1</SelectItem>
								<SelectItem value='2'>Quý 2</SelectItem>
								<SelectItem value='3'>Quý 3</SelectItem>
								<SelectItem value='4'>Quý 4</SelectItem>
							</SelectContent>
						</Select>

						<Button className='ml-2' onClick={fetchStatistics}>
							Xem thống kê
						</Button>
					</div>

					{stats && renderStatisticsContent(stats, 'quarter', prepareMonthlyData())}
				</TabsContent>

				{/* Month Tab */}
				<TabsContent value='month' className='space-y-4'>
					<div className='mb-4 flex items-center'>
						<Select value={year.toString()} onValueChange={value => setYear(parseInt(value))}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Chọn năm' />
							</SelectTrigger>
							<SelectContent>
								{getYearOptions().map(year => (
									<SelectItem key={year} value={year.toString()}>
										{year}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select value={month.toString()} onValueChange={value => setMonth(parseInt(value))}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Chọn tháng' />
							</SelectTrigger>
							<SelectContent>
								{Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
									<SelectItem key={m} value={m.toString()}>
										Tháng {m}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button className='ml-2' onClick={fetchStatistics}>
							Xem thống kê
						</Button>
					</div>

					{stats && renderStatisticsContent(stats, 'month')}
				</TabsContent>
			</Tabs>
		</div>
	);

	function renderStatisticsContent(
		stats: ProductStatistics,
		mode: 'year' | 'quarter' | 'month',
		monthlyData?: any[],
		quarterlyData?: any[]
	) {
		return (
			<>
				{/* Overview Cards */}
				<div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
					<Card>
						<CardHeader className='pb-2'>
							<CardTitle className='text-md font-medium'>Tổng số sản phẩm đã bán</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-2xl font-bold'>{stats.totalProductsSold}</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='pb-2'>
							<CardTitle className='text-md font-medium'>Tổng doanh thu</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-2xl font-bold'>{formatCurrency(stats.totalRevenue)}</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='pb-2'>
							<CardTitle className='text-md font-medium'>Tổng lợi nhuận</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-2xl font-bold'>{formatCurrency(stats.totalProfit)}</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='pb-2'>
							<CardTitle className='text-md font-medium'>Tổng chi phí</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-2xl font-bold'>{formatCurrency(stats.totalCost)}</p>
						</CardContent>
					</Card>
				</div>

				{/* Charts Section */}
				<div className='mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2'>
					{/* Distribution Chart */}
					{mode === 'year' && quarterlyData && quarterlyData.length > 0 && (
						<Card className='col-span-1'>
							<CardHeader>
								<CardTitle>Phân bố theo quý</CardTitle>
							</CardHeader>
							<CardContent className='h-[300px]'>
								<ResponsiveContainer width='100%' height='100%'>
									<BarChart data={quarterlyData}>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis dataKey='name' />
										<YAxis />
										<Tooltip formatter={value => [value, 'Số lượng']} />
										<Legend />
										<Bar dataKey='value' fill='#8884d8' name='Số lượng bán' />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					)}

					{/* Monthly Distribution */}
					{monthlyData && monthlyData.length > 0 && (
						<Card className='col-span-1'>
							<CardHeader>
								<CardTitle>
									{mode === 'year'
										? 'Phân bố theo tháng'
										: mode === 'quarter'
											? `Phân bố các tháng trong Quý ${stats.quarter}`
											: 'Chi tiết tháng'}
								</CardTitle>
							</CardHeader>
							<CardContent className='h-[300px]'>
								<ResponsiveContainer width='100%' height='100%'>
									<BarChart data={monthlyData}>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis dataKey='name' />
										<YAxis />
										<Tooltip formatter={value => [value, 'Số lượng']} />
										<Legend />
										<Bar dataKey='value' fill='#82ca9d' name='Số lượng bán' />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					)}

					{/* Category Distribution */}
					<Card className='col-span-1'>
						<CardHeader>
							<CardTitle>Phân bố theo danh mục</CardTitle>
						</CardHeader>
						<CardContent className='h-[300px]'>
							<ResponsiveContainer width='100%' height='100%'>
								<PieChart>
									<Pie
										data={prepareCategoryData()}
										dataKey='quantitySold'
										nameKey='name'
										cx='50%'
										cy='50%'
										outerRadius={100}
										fill='#8884d8'
										label={({ name, percentageOfTotal }) => `${name}: ${percentageOfTotal}%`}
									>
										{prepareCategoryData().map((entry, index) => (
											<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
										))}
									</Pie>
									<Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</div>

				{/* Tables Section */}
				<div className='grid grid-cols-1 gap-4'>
					{/* Top Selling Products Table */}
					<Card>
						<CardHeader>
							<CardTitle>Sản phẩm bán chạy</CardTitle>
							<CardDescription>Danh sách các sản phẩm bán chạy nhất</CardDescription>
						</CardHeader>
						<CardContent>
							<CustomTable columns={productColumns} data={stats.topSellingProducts} />
						</CardContent>
					</Card>

					{/* Category Sales Table */}
					<Card>
						<CardHeader>
							<CardTitle>Thống kê theo danh mục</CardTitle>
							<CardDescription>Doanh số bán hàng theo từng danh mục</CardDescription>
						</CardHeader>
						<CardContent>
							<CustomTable columns={categoryColumns} data={stats.categorySales} />
						</CardContent>
					</Card>
				</div>
			</>
		);
	}
}

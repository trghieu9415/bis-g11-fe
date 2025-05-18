import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, BookText, FileText } from 'lucide-react';
import { Bar, Pie } from 'recharts';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Cell } from 'recharts';
import CustomTable from '@/components/custom-table';
import axios from '@/services/customize-axios';
import { handleExportImportReport, YearImportData } from './Warehouse Management/Inventory/utils/pdfExplore';

// Types
type ImportStatistics = {
	year?: number;
	quarter?: number;
	monthOfYear?: string;
	totalProductsImported: number;
	totalCost: number;
	monthlyImports?: Record<string, number>;
	quarterlyImports?: Record<string, number>;
	topImportedProducts: ImportedProduct[];
	allImportedProducts: ImportedProduct[];
	supplierImports: SupplierImport[];
};

type ImportedProduct = {
	id: number;
	name: string;
	quantityImported: number;
	totalCost: number;
};

type SupplierImport = {
	id: number;
	name: string;
	quantityImported: number;
	totalCost: number;
	percentageOfTotal: number;
};

// Table column definitions
const productColumns: ColumnDef<ImportedProduct>[] = [
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
		accessorKey: 'quantityImported',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Số lượng <ArrowUpDown />
			</Button>
		),
		cell: ({ row }) => <span className='flex justify-center'>{row.getValue('quantityImported')}</span>
	},
	{
		accessorKey: 'totalCost',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Chi phí <ArrowUpDown />
			</Button>
		),
		cell: ({ row }) => <span className='flex justify-center'>{formatCurrency(row.getValue('totalCost'))}</span>
	}
];

const supplierColumns: ColumnDef<SupplierImport>[] = [
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
				Nhà cung cấp <ArrowUpDown />
			</Button>
		),
		cell: ({ row }) => (
			<span className='flex items-center'>
				<Button variant='ghost' className='mr-2 h-5 p-1 text-black'>
					<FileText />
				</Button>
				{row.getValue('name')}
			</span>
		),
		enableHiding: false
	},
	{
		accessorKey: 'quantityImported',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Số lượng <ArrowUpDown />
			</Button>
		),
		cell: ({ row }) => <span className='flex justify-center'>{row.getValue('quantityImported')}</span>
	},
	{
		accessorKey: 'totalCost',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Chi phí <ArrowUpDown />
			</Button>
		),
		cell: ({ row }) => <span className='flex justify-center'>{formatCurrency(row.getValue('totalCost'))}</span>
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

export default function ImportStatistics() {
	const [activeTab, setActiveTab] = useState('year');
	const [year, setYear] = useState(getCurrentYear());
	const [quarter, setQuarter] = useState(1);
	const [month, setMonth] = useState(1);
	const [loading, setLoading] = useState(false);
	const [stats, setStats] = useState<ImportStatistics | null>(null);
	const [yearStats, setYearStats] = useState<YearImportData | null>(null);

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
					url = `/api/v1/statistics/products/imports/year/${year}`;
					break;
				case 'month':
					url = `/api/v1/statistics/products/imports/month/${year}/${month}`;
					break;
				default:
					url = `/api/v1/statistics/products/imports/year/${year}`;
			}

			const response = await axios.get(url);
			console.log(response);
			if (response) {
				setStats(response.data);
				console.log('Import statistics data:', response.data);

				const transformed: YearImportData = {
					// Dữ liệu tổng hợp
					totalProductsImported: response.data.totalProductsImported,
					totalCost: response.data.totalCost,
					year: response.data.year,

					// Dữ liệu theo thời gian
					monthlyImports: response.data.monthlyImports,
					quarterlyImports: response.data.quarterlyImports,

					// Dữ liệu sản phẩm
					topImportedProducts: response.data.topImportedProducts.map(product => ({
						id: product.id,
						name: product.name,
						quantityImported: product.quantityImported,
						totalCost: product.totalCost
					})),

					// Dữ liệu nhà cung cấp
					supplierImports: response.data.supplierImports.map(supplier => ({
						id: supplier.id,
						name: supplier.name,
						quantityImported: supplier.quantityImported,
						totalCost: supplier.totalCost,
						percentageOfTotal: supplier.percentageOfTotal
					}))
				};
				setYearStats(transformed);
				console.log('Transformed data:', transformed);
			}
		} catch (error) {
			console.error('Error fetching import statistics:', error);
		} finally {
			setLoading(false);
		}
	};

	// Transform data for charts
	const prepareMonthlyData = () => {
		if (!stats?.monthlyImports) return [];

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

		return Object.entries(stats.monthlyImports)
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
		if (!stats?.quarterlyImports) return [];

		return Object.entries(stats.quarterlyImports).map(([key, value]) => ({
			name: `Q${key}`,
			value: value
		}));
	};

	const prepareSupplierData = () => {
		return stats?.supplierImports || [];
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
		handleExportImportReport(yearStats, year);
	};

	return (
		<div className='w-full p-4'>
			<h1 className='mb-4 text-2xl font-bold'>Thống kê nhập hàng</h1>

			<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
				<TabsList className='mb-4 grid grid-cols-3'>
					<TabsTrigger value='year'>Theo năm</TabsTrigger>
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
		stats: ImportStatistics,
		mode: 'year' | 'quarter' | 'month',
		monthlyData?: any[],
		quarterlyData?: any[]
	) {
		return (
			<>
				{/* Overview Cards */}
				<div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2'>
					<Card>
						<CardHeader className='pb-2'>
							<CardTitle className='text-md font-medium'>Tổng số sản phẩm đã nhập</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-2xl font-bold'>{stats.totalProductsImported}</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='pb-2'>
							<CardTitle className='text-md font-medium'>Tổng chi phí nhập hàng</CardTitle>
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
								<CardTitle>Phân bố nhập hàng theo quý</CardTitle>
							</CardHeader>
							<CardContent className='h-[300px]'>
								<ResponsiveContainer width='100%' height='100%'>
									<BarChart data={quarterlyData}>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis dataKey='name' />
										<YAxis />
										<Tooltip formatter={value => [value, 'Số lượng']} />
										<Legend />
										<Bar dataKey='value' fill='#8884d8' name='Số lượng nhập' />
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
										? 'Phân bố nhập hàng theo tháng'
										: mode === 'quarter'
											? `Phân bố nhập hàng các tháng trong Quý ${stats.quarter}`
											: 'Chi tiết nhập hàng trong tháng'}
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
										<Bar dataKey='value' fill='#82ca9d' name='Số lượng nhập' />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					)}

					{/* Supplier Distribution */}
					<Card className='col-span-1'>
						<CardHeader>
							<CardTitle>Phân bố theo nhà cung cấp</CardTitle>
						</CardHeader>
						<CardContent className='h-[380px]'>
							<ResponsiveContainer width='100%' height='100%'>
								<PieChart>
									<Pie
										data={prepareSupplierData()}
										dataKey='quantityImported'
										nameKey='name'
										cx='50%'
										cy='50%'
										outerRadius={80}
										fill='#8884d8'
										label={({ name, percentageOfTotal }) => `${name}: ${percentageOfTotal}%`}
									>
										{prepareSupplierData().map((entry, index) => (
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
					{/* Top Imported Products Table */}
					<Card>
						<CardHeader>
							<CardTitle>Sản phẩm nhập nhiều nhất</CardTitle>
							<CardDescription>Danh sách các sản phẩm nhập với số lượng lớn nhất</CardDescription>
						</CardHeader>
						<CardContent>
							<CustomTable columns={productColumns} data={stats.topImportedProducts} />
						</CardContent>
					</Card>

					{/* All Imported Products Table */}
					<Card>
						<CardHeader>
							<CardTitle>Tất cả sản phẩm đã nhập</CardTitle>
							<CardDescription>Danh sách đầy đủ các sản phẩm đã nhập trong kỳ</CardDescription>
						</CardHeader>
						<CardContent>
							<CustomTable columns={productColumns} data={stats.allImportedProducts} />
						</CardContent>
					</Card>

					{/* Supplier Imports Table */}
					<Card>
						<CardHeader>
							<CardTitle>Thống kê theo nhà cung cấp</CardTitle>
							<CardDescription>Chi tiết nhập hàng theo từng nhà cung cấp</CardDescription>
						</CardHeader>
						<CardContent>
							<CustomTable columns={supplierColumns} data={stats.supplierImports} />
						</CardContent>
					</Card>
				</div>
			</>
		);
	}
}

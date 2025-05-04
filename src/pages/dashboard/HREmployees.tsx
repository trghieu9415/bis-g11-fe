import EmployeeTable from './HREmployees/hremployee-table';
import EmployeeCreateNew from './HREmployees/hremployee-create-new';
import EmployeeMonthStatistics from './HREmployees/hremployee-statistics-month';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HREmployees() {
	return (
		<div className='flex w-full flex-col'>
			<h1 className='py-4 text-lg font-bold uppercase'>Danh sách nhân sự</h1>
			<EmployeeCreateNew />
			<div className='mb-2'>
				<div className='mb-2 rounded-md bg-white p-4 shadow'>
					<Tabs defaultValue='month' className='w-full'>
						<div className='flex w-full items-center justify-center'>
							<p className='mr-2'>Thống kê tình hình nhân sự: </p>
							<TabsList className='grid w-[240px] grid-cols-2'>
								<TabsTrigger value='month'>Theo tháng</TabsTrigger>
								<TabsTrigger value='year'>Theo năm</TabsTrigger>
							</TabsList>
						</div>
						<TabsContent value='month' id='employee-statistics-month'>
							<EmployeeMonthStatistics />
						</TabsContent>
						<TabsContent value='year' id='employee-statistics-year'></TabsContent>
					</Tabs>
				</div>
				<EmployeeTable />
			</div>
		</div>
	);
}

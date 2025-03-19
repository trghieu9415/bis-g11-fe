import HolidayTable from './Holiday/holiday-table';

export default function Holidays() {
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách lịch nghỉ lễ</h1>
			{/* <EmployeeCreateNew /> */}
			<div className='mb-2'>
				<HolidayTable />
			</div>
		</div>
	);
}

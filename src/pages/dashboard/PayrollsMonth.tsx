import { useState, useEffect } from 'react';
import PayrollsYearMonthTable from './PayrollsYearMonth/payrolls-month-table';
import { Input } from '@/components/ui/input';

export default function SalaryMonth() {
	const [today, setToday] = useState(new Date());
	const [isThisMonth, setIsThisMonth] = useState(false);

	const updateDate = (e: React.ChangeEvent<HTMLInputElement>) => {
		setToday(new Date(e.target.value));
	};

	const month = today.toLocaleDateString('vi-VN', { month: '2-digit' });
	const year = today.toLocaleDateString('vi-VN', { year: 'numeric' });

	useEffect(() => {
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth();
		const currentYear = currentDate.getFullYear();
		setIsThisMonth(currentMonth === today.getMonth() && currentYear === today.getFullYear());
	}, [today]);

	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>
				Danh sách lương theo{' '}
				<span className='text-lg pb-[2px] font-bold border-b-4 border-blue-300 '>tháng {month} năm {year}</span>
				{isThisMonth && <span className='bg-yellow-200 text-black px-2 py-1 rounded ml-2'>Tháng này</span>}
			</h1>
			<div>
				<div className='inline-block float-end mr-1'>
					<Input
						type='month'
						className='border-gray-200 outline-none mb-2 !text-base'
						value={`${year}-${month}`}
						onChange={updateDate}
					/>
				</div>
			</div>
			<div className='mb-2'>
				<PayrollsYearMonthTable month={month} year={year} />
			</div>
		</div>
	);
}

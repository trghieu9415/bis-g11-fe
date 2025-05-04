import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import PayrollsYearMonthTable from './PayrollsYearMonth/payrolls-month-table';
import PayrollsMonthStatistics from './PayrollsYearMonth/payrolls-month-statictisc';

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
		<div className='flex w-full flex-col'>
			<h1 className='py-4 text-lg font-bold uppercase'>
				Danh sách lương theo{' '}
				<span className='border-b-4 border-blue-300 pb-[2px] text-lg font-bold'>
					tháng {month} năm {year}
				</span>
				{isThisMonth && <span className='ml-2 rounded bg-yellow-200 px-2 py-1 text-black'>Tháng này</span>}
			</h1>
			<div>
				<div className='float-end mr-1 inline-block'>
					<Input
						type='month'
						className='mb-2 border-gray-200 !text-base outline-none'
						value={`${year}-${month}`}
						onChange={updateDate}
					/>
				</div>
			</div>
			<PayrollsMonthStatistics month={month} year={year} />
			<div className='mb-2'>
				<PayrollsYearMonthTable month={month} year={year} />
			</div>
		</div>
	);
}

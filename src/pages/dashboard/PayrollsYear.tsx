import { useState, useEffect } from 'react';
import PayrollsYearTable from './PayrollsYear/payrolls-year-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarSearch } from 'lucide-react';

import { fetchPayrollsByYear } from '@/redux/slices/payrollsByYearSlice';
import { useAppDispatch } from '@/redux/store';
import PayrollsYearStatistics from './PayrollsYearMonth/payrolls-year-statistics';

export default function SalaryMonth() {
	const dispatch = useAppDispatch();
	const [year, setYear] = useState({
		input: '',
		search: ''
	});
	const [isThisYear, setIsThisYear] = useState(true);

	const updateDate = (value: string) => {
		setYear(prev => ({ ...prev, input: value }));
	};

	useEffect(() => {
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		setYear(prev => ({ ...prev, input: String(currentYear), search: String(currentYear) }));
		dispatch(fetchPayrollsByYear(String(currentYear)));
	}, []);

	// console.log(year.input, year.search);

	return (
		<div className='flex w-full flex-col'>
			<h1 className='py-4 text-lg font-bold uppercase'>
				Danh sách lương năm{' '}
				<span className='border-b-4 border-blue-300 pb-[2px] text-lg font-bold'>năm {year.search}</span>
				{isThisYear && <span className='ml-2 rounded bg-yellow-200 px-2 py-1 text-black'>Năm nay</span>}
			</h1>
			<div>
				<div className='float-end mb-2 mr-1 flex items-center justify-center gap-2'>
					<Input
						type='number'
						className={`w-[68px] border-gray-200 !text-base outline-none ${year.input && (parseInt(year.input) < 2020 || parseInt(year.input) > new Date().getFullYear()) ? 'border-red-500' : ''}`}
						value={year?.input || ''}
						min={2020}
						max={new Date().getFullYear()}
						onChange={e => {
							const value = e.target.value;
							if (value.length <= 4) {
								updateDate(value);
							}
						}}
						onKeyDown={e => {
							if (
								e.key === 'Enter' &&
								!(parseInt(year.input) < 2020 || parseInt(year.input) > new Date().getFullYear())
							) {
								if (year.input.length === 4) {
									dispatch(fetchPayrollsByYear(year.input));
									setYear(prev => ({ ...prev, search: year.input }));
									setIsThisYear(year.input === String(new Date().getFullYear()));
								}
							}
						}}
					/>
					<Button
						className='h-[40px]'
						onClick={() => {
							if (year.input.length === 4) {
								dispatch(fetchPayrollsByYear(year.input));
								setYear(prev => ({ ...prev, search: year.input }));
								setIsThisYear(year.input === String(new Date().getFullYear()));
							}
						}}
						disabled={
							year.input.length !== 4 || parseInt(year.input) < 2020 || parseInt(year.input) > new Date().getFullYear()
						}
					>
						<CalendarSearch />
					</Button>
				</div>
			</div>
			<PayrollsYearStatistics year={year.search} />
			<div className='mb-2'>
				<PayrollsYearTable year={year.search} />
			</div>
		</div>
	);
}

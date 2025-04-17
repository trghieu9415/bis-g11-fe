import { useState, useEffect } from 'react';
import PayrollsYearTable from './PayrollsYear/payrolls-year-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarSearch } from 'lucide-react';

import { fetchPayrollsByYear } from '@/redux/slices/payrollsByYearSlice';
import { useAppDispatch } from '@/redux/store';

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
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>
				Danh sách lương năm{' '}
				<span className='text-lg pb-[2px] font-bold border-b-4 border-blue-300 '>năm {year.search}</span>
				{isThisYear && <span className='bg-yellow-200 text-black px-2 py-1 rounded ml-2'>Năm nay</span>}
			</h1>
			<div>
				<div className='flex items-center justify-center gap-2 float-end mr-1 mb-2'>
					<Input
						type='number'
						className={`border-gray-200 outline-none w-[68px] !text-base ${year.input && (parseInt(year.input) < 2020 || parseInt(year.input) > new Date().getFullYear()) ? 'border-red-500' : ''}`}
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
			<div className='mb-2'>
				<PayrollsYearTable year={year.search} />
			</div>
		</div>
	);
}

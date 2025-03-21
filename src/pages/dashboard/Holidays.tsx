import { useState, useEffect } from 'react';

import HolidayTable from './Holiday/holiday-table';
import HolidayCreateNew from './Holiday/holiday-create-new';

interface EventType {
	end: string;
	id: number;
	start: string;
	title: string;
	description: string;
}

export default function Holidays() {
	const [holiday, setHoliday] = useState<EventType | null>(null);

	const handleCreateSuccess = (newHoliday: EventType) => {
		setHoliday(newHoliday);
	};

	useEffect(() => {
		setHoliday(null);
	}, [holiday]);

	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách lịch nghỉ lễ</h1>
			<HolidayCreateNew onCreateSuccess={handleCreateSuccess} />
			<div className='mb-2'>
				<HolidayTable newEvent={holiday} />
			</div>
		</div>
	);
}

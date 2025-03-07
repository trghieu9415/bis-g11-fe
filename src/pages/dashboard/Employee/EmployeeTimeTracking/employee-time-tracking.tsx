import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarCheck } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';

import EmployeeCalendar from '@/pages/dashboard/Employee/EmployeeTimeTracking/employee-calendar';

export default function EmployeeTimeTracking() {
	const [events, setEvents] = useState([
		{
			calendarId: 'green-theme',
			end: '2025-03-05 10:44',
			id: '1741171491189',
			start: '2025-03-05 10:44',
			title: 'Check-in'
		}
		// {
		// 	calendarId: 'red-theme',
		// 	end: '2025-03-05 10:44',
		// 	id: '1741171491189',
		// 	start: '2025-03-05 10:44',
		// 	title: 'Check-out'
		// }
	]);

	const onCheckIn = () => {
		console.log('CLICKED');
		setEvents(prev => [
			...prev,
			{
				calendarId: 'red-theme',
				end: '2025-03-05 10:44',
				id: '1741171491189',
				start: '2025-03-05 10:44',
				title: 'Check-out'
			}
		]);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline' className='border-none h-[32px] py-[6px] px-[8px] w-full justify-start items-center'>
					<CalendarCheck />
					Chấm công
				</Button>
			</DialogTrigger>
			<DialogContent className='!w-[50vw] !max-w-none'>
				<DialogHeader>
					<DialogTitle>Bảng chấm công</DialogTitle>
					<DialogDescription>
						Đảm bảo bạn luôn nhớ check-in và check-out đúng giờ để theo dõi thời gian làm việc chính xác và tránh sai
						sót trong bảng chấm công!
					</DialogDescription>
				</DialogHeader>
				<EmployeeCalendar events={events} onCheckIn={onCheckIn} />
			</DialogContent>
		</Dialog>
	);
}

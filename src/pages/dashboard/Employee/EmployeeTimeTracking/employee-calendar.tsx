import { useState, useEffect } from 'react';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import { createViewMonthAgenda, createViewMonthGrid } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';

import '@schedule-x/theme-default/dist/index.css';

import { CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EventType = {
	calendarId: string;
	end: string;
	id: string;
	start: string;
	title: string;
};

interface EmployeeCalendarProps {
	events: EventType[];
	onCheckIn?: () => void;
}

function EmployeeCalendar({ events, onCheckIn }: EmployeeCalendarProps) {
	const eventsService = useState(() => createEventsServicePlugin())[0];
	const calendar = useCalendarApp({
		views: [createViewMonthGrid(), createViewMonthAgenda()],
		selectedDate: new Date().toISOString().split('T')[0],
		events: events,
		calendars: {
			'green-theme': {
				colorName: 'green-theme',
				lightColors: {
					main: '#28a745',
					container: '#d4edda',
					onContainer: '#155724'
				},
				darkColors: {
					main: '#2eb82e',
					container: '#0b3d0b',
					onContainer: '#d4edda'
				}
			},
			'red-theme': {
				colorName: 'red-theme',
				lightColors: {
					main: '#dc3545',
					container: '#f8d7da',
					onContainer: '#721c24'
				},
				darkColors: {
					main: '#b22222',
					container: '#5c0e0e',
					onContainer: '#f8d7da'
				}
			}
		},
		plugins: [eventsService]
	});
	useEffect(() => {
		eventsService.getAll();
	}, [eventsService]);

	return (
		<div>
			<div className='flex items-center justify-end gap-2'>
				<Button className='bg-green-800 hover:bg-green-900 mb-4 text-base' onClick={onCheckIn}>
					<CalendarCheck />
					Điểm danh (Check-in)
				</Button>
				<Button className='bg-red-800 hover:bg-red-900 mb-4 text-base'>
					<CalendarCheck />
					Điểm danh (Check-out)
				</Button>
			</div>

			<div>
				<ScheduleXCalendar calendarApp={calendar} />
			</div>
		</div>
	);
}

export default EmployeeCalendar;

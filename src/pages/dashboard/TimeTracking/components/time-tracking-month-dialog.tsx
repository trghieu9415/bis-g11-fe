import { createViewMonthAgenda, createViewMonthGrid } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { useEffect, useState } from 'react';

import '@schedule-x/theme-default/dist/index.css';
import './time-tracking-month-dialog.css';

interface EventType {
	end: string;
	id: number;
	start: string;
	title: string;
	description: string;
}

interface TimeTrackingMonthDialogProps {
	events: EventType[];
	monthOfYear: string;
}

export default function TimeTrackingMonthDialog({ events, monthOfYear }: TimeTrackingMonthDialogProps) {
	console.log(events);
	console.log(monthOfYear);
	const [yearStr, monthStr] = monthOfYear.split('-');
	const year: number = parseInt(yearStr, 10);
	const month: number = parseInt(monthStr, 10);

	const lastDay = new Date(year, month, 0).getDate();

	const eventsService = useState(() => createEventsServicePlugin())[0];
	const calendar = useCalendarApp({
		locale: 'vi-VN',
		firstDayOfWeek: 0,
		minDate: `${monthOfYear}-01`,
		maxDate: `${monthOfYear}-${lastDay}`,
		isResponsive: false,
		views: [createViewMonthGrid(), createViewMonthAgenda()],
		selectedDate: `${monthOfYear}-01`,
		events: events,
		calendars: {
			// (PRESENT)
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
			// (ABSENT)
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
			},
			'blue-theme': {
				// (SICK_LEAVE)
				colorName: 'blue-theme',
				lightColors: {
					main: '#007bff',
					container: '#d0e7ff',
					onContainer: '#003366'
				},
				darkColors: {
					main: '#0056b3',
					container: '#004080',
					onContainer: '#d0e7ff'
				}
			},
			'orange-theme': {
				// (PAID_LEAVE)
				colorName: 'orange-theme',
				lightColors: {
					main: '#fd7e14',
					container: '#ffe5b5',
					onContainer: '#c95c00'
				},
				darkColors: {
					main: '#e67300',
					container: '#803100',
					onContainer: '#ffe5b5'
				}
			},
			'pink-theme': {
				// (MATERNITY_LEAVE)
				colorName: 'pink-theme',
				lightColors: {
					main: '#e83e8c',
					container: '#f8d2e5',
					onContainer: '#a50045'
				},
				darkColors: {
					main: '#c9004f',
					container: '#8b0047',
					onContainer: '#f8d2e5'
				}
			},
			// (LATE)
			'yellow-theme': {
				colorName: 'yellow-theme',
				lightColors: {
					main: '#ffc107',
					container: '#fff3cd',
					onContainer: '#856404'
				},
				darkColors: {
					main: '#e0a800',
					container: '#9e6e00',
					onContainer: '#fff3cd'
				}
			},
			// (HOLIDAY_LEAVE)
			'purple-theme': {
				colorName: 'purple-theme',
				lightColors: { main: '#cdb4db', container: '#f1e0f7', onContainer: '#775a83' },
				darkColors: { main: '#a685b9', container: '#533a63', onContainer: '#cdb4db' }
			}
		},
		plugins: [eventsService]
	});

	useEffect(() => {
		eventsService.getAll();
	}, [eventsService]);

	return (
		<div className='time-tracking-month-dialog'>
			{calendar && events && (
				<div>
					<ScheduleXCalendar calendarApp={calendar} />
				</div>
			)}
		</div>
	);
}

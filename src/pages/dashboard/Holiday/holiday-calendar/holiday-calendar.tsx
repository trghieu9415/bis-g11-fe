import { createViewMonthGrid } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import '@schedule-x/theme-default/dist/index.css';
import { useEffect, useState } from 'react';

import './holiday-calender-styles.css';

type Holiday = {
	id: number;
	idString: string;
	name: string;
	startDate: string;
	endDate: string;
	description: string;
	status: number;
};

interface EventType {
	calendarId: string;
	end: string;
	id: number;
	start: string;
	title: string;
}

interface HolidayCalendarProps {
	events: Holiday[];
	onDelete?: number;
	onSave?: EventType | undefined | null;
}

export default function HolidayCalendar({ events, onDelete, onSave }: HolidayCalendarProps) {
	console.log(onDelete);
	const mappedEvents = events.map((item, index) => ({
		calendarId: item.idString,
		end: item.endDate,
		id: item.id,
		start: item.startDate,
		title: item.name
	}));

	const eventsService = useState(() => createEventsServicePlugin())[0];
	const calendar = useCalendarApp({
		locale: 'vi-VN',
		firstDayOfWeek: 0,
		views: [createViewMonthGrid()],
		selectedDate: new Date().toISOString().split('T')[0],
		events: mappedEvents,
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

	useEffect(() => {
		if (onDelete) {
			eventsService.remove(onDelete);
		}
	}, [onDelete]);

	useEffect(() => {
		if (onSave) {
			eventsService.update({
				id: onSave.id,
				start: onSave.start,
				end: onSave.end,
				title: onSave.title,
				calendarId: onSave.calendarId
			});
		}
	}, [onSave]);

	return (
		<div>
			{calendar && (
				<div className='holiday-calendar [&_.sx__range-heading]:hidden !important'>
					<ScheduleXCalendar calendarApp={calendar} />
				</div>
			)}
		</div>
	);
}

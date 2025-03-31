import { createViewMonthGrid } from '@schedule-x/calendar';
import { createEventModalPlugin } from '@schedule-x/event-modal';
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
	end: string;
	id: number;
	start: string;
	title: string;
	description: string;
}

interface HolidayCalendarProps {
	events: Holiday[];
	onDelete?: number;
	onSave?: EventType | undefined | null;
	onAdd?: EventType | undefined | null;
}

export default function HolidayCalendar({ events, onDelete, onSave, onAdd }: HolidayCalendarProps) {
	const getDaysDifference = (startDate: string, endDate: string) => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
	};

	const mappedEvents = events.map(item => {
		const days = getDaysDifference(item.startDate, item.endDate);

		let theme = 'green-holiday';
		if (days >= 3 && days <= 6) {
			theme = 'blue-holiday';
		} else if (days >= 7 && days <= 14) {
			theme = 'pink-holiday';
		} else if (days > 14) {
			theme = 'purple-holiday';
		}

		return {
			calendarId: theme,
			end: item.endDate,
			id: item.id,
			start: item.startDate,
			title: item.name,
			description: item.description
		};
	});

	const eventsService = useState(() => createEventsServicePlugin())[0];
	const calendar = useCalendarApp({
		locale: 'vi-VN',
		firstDayOfWeek: 0,
		views: [createViewMonthGrid()],
		selectedDate: new Date().toISOString().split('T')[0],
		events: mappedEvents,
		calendars: {
			'green-holiday': {
				colorName: 'green-holiday',
				lightColors: { main: '#b2f0b2', container: '#eaffea', onContainer: '#4a7c4a' },
				darkColors: { main: '#81c784', container: '#2d5734', onContainer: '#b2f0b2' }
			},
			'blue-holiday': {
				colorName: 'blue-holiday',
				lightColors: { main: '#b2d8ff', container: '#e6f2ff', onContainer: '#4a6a92' },
				darkColors: { main: '#82b1ff', container: '#2d4870', onContainer: '#b2d8ff' }
			},
			'pink-holiday': {
				colorName: 'pink-holiday',
				lightColors: { main: '#ffc0cb', container: '#ffe6eb', onContainer: '#a75d67' },
				darkColors: { main: '#ff91a4', container: '#7c3641', onContainer: '#ffc0cb' }
			},
			'purple-holiday': {
				colorName: 'purple-holiday',
				lightColors: { main: '#cdb4db', container: '#f1e0f7', onContainer: '#775a83' },
				darkColors: { main: '#a685b9', container: '#533a63', onContainer: '#cdb4db' }
			}
		},
		plugins: [eventsService, createEventModalPlugin()]
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
			const days = getDaysDifference(onSave.start, onSave.end);

			let theme = 'green-holiday';
			if (days >= 3 && days <= 6) {
				theme = 'blue-holiday';
			} else if (days >= 7 && days <= 14) {
				theme = 'pink-holiday';
			} else if (days > 14) {
				theme = 'purple-holiday';
			}

			eventsService.update({
				id: onSave.id,
				start: onSave.start,
				end: onSave.end,
				title: onSave.title,
				description: onSave?.description,
				calendarId: theme
			});
		}
	}, [onSave]);

	useEffect(() => {
		if (onAdd) {
			const days = getDaysDifference(onAdd.start, onAdd.end);

			let theme = 'green-holiday';
			if (days >= 3 && days <= 6) {
				theme = 'blue-holiday';
			} else if (days >= 7 && days <= 14) {
				theme = 'pink-holiday';
			} else if (days > 14) {
				theme = 'purple-holiday';
			}

			eventsService.add({
				id: onAdd.id,
				start: onAdd.start,
				end: onAdd.end,
				title: onAdd.title,
				description: onSave?.description,
				calendarId: theme
			});
		}
	}, [onAdd]);

	return (
		<div>
			{calendar && (
				<div className='holiday-calendar'>
					<ScheduleXCalendar calendarApp={calendar} />
				</div>
			)}
		</div>
	);
}

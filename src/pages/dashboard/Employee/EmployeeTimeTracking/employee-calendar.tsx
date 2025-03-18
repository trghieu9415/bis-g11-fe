import { useState, useEffect, useMemo } from 'react';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import { createViewMonthAgenda, createViewMonthGrid } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { Button } from '@/components/ui/button';
import '@schedule-x/theme-default/dist/index.css';
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction
} from '@/components/ui/alert-dialog';

import { CalendarCheck } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

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
	onCheckOut?: () => void;
}

function EmployeeCalendar({ events, onCheckIn, onCheckOut }: EmployeeCalendarProps) {
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

	const [isShowCheckIn, setIsShowCheckIn] = useState(true);
	const [isShowCheckOut, setIsShowCheckOut] = useState(true);

	const handleShowCheckInCheckOut = () => {
		const today = new Date();
		const newestCheckInEvent = events
			.filter(event => event.title === 'Check-in')
			.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())[0];
		const newestCheckOutEvent = events
			.filter(event => event.title === 'Check-out')
			.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())[0];

		let isSameCheckInDate = false;
		let isSameCheckOutDate = false;

		if (newestCheckInEvent) {
			const newestCheckInDate = new Date(newestCheckInEvent.start.replace(' ', 'T'));
			isSameCheckInDate =
				today.getFullYear() === newestCheckInDate.getFullYear() &&
				today.getMonth() === newestCheckInDate.getMonth() &&
				today.getDate() === newestCheckInDate.getDate();
		}

		if (newestCheckOutEvent) {
			const newestCheckOutDate = new Date(newestCheckOutEvent.start.replace(' ', 'T'));
			isSameCheckOutDate =
				today.getFullYear() === newestCheckOutDate.getFullYear() &&
				today.getMonth() === newestCheckOutDate.getMonth() &&
				today.getDate() === newestCheckOutDate.getDate();
		}

		setIsShowCheckIn(!isSameCheckInDate);
		setIsShowCheckOut(!isSameCheckOutDate);
	};

	useEffect(() => {
		handleShowCheckInCheckOut();
	}, [events]);

	const handleCheckIn = () => {
		if (onCheckIn) onCheckIn();
		const now = new Date();
		const formattedDate = now.toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).replace('T', ' ').slice(0, 16);
		const newEvent = {
			id: uuidv4(),
			start: formattedDate,
			end: formattedDate,
			title: 'Check-in',
			calendarId: 'green-theme'
		};
		eventsService.add(newEvent);
	};

	const handleCheckOut = () => {
		if (onCheckOut) onCheckOut();
		const now = new Date();
		const formattedDate = now.toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).replace('T', ' ').slice(0, 16);
		const newEvent = {
			id: uuidv4(),
			start: formattedDate,
			end: formattedDate,
			title: 'Check-out',
			calendarId: 'red-theme'
		};
		eventsService.add(newEvent);
	};

	return (
		<div>
			<div className='flex items-center justify-end gap-2'>
				{isShowCheckIn && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button className='bg-green-700 hover:bg-green-800 mb-4 text-base'>
								<CalendarCheck />
								Điểm danh (Check-in)
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Bạn có chắc chắn muốn Check-in?</AlertDialogTitle>
								<AlertDialogDescription>
									Hãy đảm bảo rằng bạn đang thực sự có mặt tại nơi làm việc trước khi điểm danh.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Hủy</AlertDialogCancel>
								<AlertDialogAction onClick={handleCheckIn}>Xác nhận</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}

				{isShowCheckOut && !isShowCheckIn && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button className='bg-red-700 hover:bg-red-800 mb-4 text-base'>
								<CalendarCheck />
								Điểm danh (Check-out)
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Bạn có chắc chắn muốn Check-out?</AlertDialogTitle>
								<AlertDialogDescription>
									Xác nhận rằng bạn đã hoàn thành công việc trước khi Check-out.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Hủy</AlertDialogCancel>
								<AlertDialogAction onClick={handleCheckOut}>Xác nhận</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}
			</div>

			{calendar && (
				<div>
					<ScheduleXCalendar calendarApp={calendar} />
				</div>
			)}
		</div>
	);
}

export default EmployeeCalendar;

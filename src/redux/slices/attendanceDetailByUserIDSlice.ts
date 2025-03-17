// src/redux/slices/usersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ApiResponse {
	id: number;
	idString: string;
	checkIn: string | null;
	checkOut: string | null;
	workingDay: Date | null;
	attendanceStatus: string | null;
	leaveTypeEnum: string | null;
	userId: number;
	attendanceId: number;
}

interface CalendarEvent {
	calendarId: string;
	end: string;
	start: string;
	id: string;
	title: string;
}

interface AttendanceDetailByUserIDState {
	attendanceDetailsByUserID: CalendarEvent[];
	isLoading: boolean;
	isError: boolean;
}

const initialState: AttendanceDetailByUserIDState = {
	attendanceDetailsByUserID: [],
	isLoading: false,
	isError: false
};

export const fetchAttendanceDetailsByUserID = createAsyncThunk(
	'attendanceDetail/fetchAttendanceDetailsByUserID',
	async (id: number) => {
		const response = await axios.get<ApiResponse[]>(`/api/v1/attendanceDetails/user/${id}`);
		const filteredResponse: CalendarEvent[] = response.data.flatMap(item => {
			const result: CalendarEvent[] = [];
			if (item.checkIn && item.workingDay) {
				const [hoursCheckIn, minutesCheckIn] = item.checkIn.split(':');
				result.push({
					calendarId: 'green-theme',
					end: `${item.workingDay} ${hoursCheckIn}:${minutesCheckIn}`,
					start: `${item.workingDay} ${hoursCheckIn}:${minutesCheckIn}`,
					id: item.idString,
					title: 'Check-in'
				});
			}

			if (item.checkOut && item.workingDay) {
				const [hoursCheckOut, minutesCheckOut] = item.checkOut.split(':');
				result.push({
					calendarId: 'red-theme',
					end: `${item.workingDay} ${hoursCheckOut}:${minutesCheckOut}`,
					id: '1741171491189',
					start: `${item.workingDay} ${hoursCheckOut}:${minutesCheckOut}`,
					title: 'Check-out'
				});
			}

			return result;
		});

		return filteredResponse;
	}
);

const attendanceDetailsByUserIDSlice = createSlice({
	name: 'attendanceDetail',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchAttendanceDetailsByUserID.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchAttendanceDetailsByUserID.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.attendanceDetailsByUserID = action.payload;
			})
			.addCase(fetchAttendanceDetailsByUserID.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default attendanceDetailsByUserIDSlice.reducer;

// src/redux/slices/usersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ApiResponse {
	id: number;
	idString: string;
	checkIn: string;
	checkOut: string;
	workingDay: string;
	attendanceStatus: string;
	leaveTypeEnum: number | null;
	userId: number;
	userIdString: string;
	fullName: string;
	attendanceId: number;
}

interface TimeTrackingTodayStates {
	timeTrackingToday: ApiResponse[];
	isLoading: boolean;
	isError: boolean;
}

const initialState: TimeTrackingTodayStates = {
	timeTrackingToday: [],
	isLoading: false,
	isError: false
};

export const fetchAllTimeTrackingToday = createAsyncThunk(
	'leave-request/fetchAllTimeTrackingToday',
	async (date: string) => {
		const response = await axios.get<ApiResponse[]>(`/api/v1/attendanceDetails/date?date=${date}`);
		return response.data;
	}
);

const timeTrackingTodaySlice = createSlice({
	name: 'leaveRequests',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchAllTimeTrackingToday.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchAllTimeTrackingToday.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.timeTrackingToday = action.payload;
			})
			.addCase(fetchAllTimeTrackingToday.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default timeTrackingTodaySlice.reducer;

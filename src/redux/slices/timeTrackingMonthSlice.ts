// src/redux/slices/usersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ApiResponse {
	id: number;
	idString: string;
	monthOfYear: string;
	totalWorkingDays: number;
	totalSickLeaves: number;
	totalPaidLeaves: number;
	totalMaternityLeaves: number;
	totalUnpaidLeaves: number;
	totalHolidayLeaves: number;
	userId: number;
}

interface TimeTrackingMonthStates {
	timeTrackingMonth: ApiResponse[];
	isLoading: boolean;
	isError: boolean;
}

const initialState: TimeTrackingMonthStates = {
	timeTrackingMonth: [],
	isLoading: false,
	isError: false
};

export const fetchAllTimeTrackingMonth = createAsyncThunk(
	'time-tracking-month/fetchAllTimeTrackingMonth',
	async (month: string) => {
		const response = await axios.get<ApiResponse[]>(`/api/v1/attendances/yearMonth?yearMonth=${month}`);
		console.log(response.data);
		return response.data;
	}
);

const timeTrackingMonthSlice = createSlice({
	name: 'timeTrackingMonth',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchAllTimeTrackingMonth.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchAllTimeTrackingMonth.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.timeTrackingMonth = action.payload;
			})
			.addCase(fetchAllTimeTrackingMonth.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default timeTrackingMonthSlice.reducer;

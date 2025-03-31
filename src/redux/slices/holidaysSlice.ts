// src/redux/slices/usersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ApiResponse {
	id: number;
	idString: string;
	name: string;
	startDate: string;
	endDate: string;
	description: string;
	status: number;
}

interface HolidayState {
	holidays: ApiResponse[];
	isLoading: boolean;
	isError: boolean;
}

const initialState: HolidayState = {
	holidays: [],
	isLoading: false,
	isError: false
};

export const fetchHolidays = createAsyncThunk('users/fetchHolidays', async () => {
	const response = await axios.get<ApiResponse[]>('/api/v1/holidays');
	return response.data;
});

const holidaysSlice = createSlice({
	name: 'holidays',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchHolidays.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchHolidays.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.holidays = action.payload;
			})
			.addCase(fetchHolidays.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default holidaysSlice.reducer;

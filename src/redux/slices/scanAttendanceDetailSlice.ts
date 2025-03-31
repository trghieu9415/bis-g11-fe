import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ApiResponse {
	statusCode: number;
	message: string;
	success: boolean;
	data?: [];
}

interface ScanAttendanceDetailState {
	isLoading: boolean;
	isError: boolean;
	scanAttendanceDetail: ApiResponse | null;
}

const initialState: ScanAttendanceDetailState = {
	isLoading: false,
	isError: false,
	scanAttendanceDetail: null
};

export const scanAttendanceDetailRedux = createAsyncThunk('attendance/scanAttendanceDetail', async (date: string) => {
	const response = await axios.put<ApiResponse>(`/api/v1/scan?dateScan=${date}`);
	return response;
});

const scanAttendanceDetailSlice = createSlice({
	name: 'scanAttendanceDetail',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(scanAttendanceDetailRedux.pending, state => {
				state.isLoading = true;
				state.isError = false;
				state.scanAttendanceDetail = null;
			})
			.addCase(scanAttendanceDetailRedux.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				// @ts-expect-error - Response from API includes required field
				state.scanAttendanceDetail = action.payload;
			})
			.addCase(scanAttendanceDetailRedux.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				// @ts-expect-error - Store the error information from the rejected action
				state.scanAttendanceDetail = action.payload;
			});
	}
});

export default scanAttendanceDetailSlice.reducer;

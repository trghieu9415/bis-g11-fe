import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ApiResponse {
	id: number;
	monthOfYear: string;
	activeEmployees: number;
	newEmployees: number;
	contractExpired: number;
	avgAge: number;
	genderRatio: string;
	permanentEmployees: number;
	probationEmployees: number;
	avgTenure: number;
}

interface EmployeeStatisticsState {
	statistics: ApiResponse | null;
	isLoading: boolean;
	isError: boolean;
}

const initialState: EmployeeStatisticsState = {
	statistics: null,
	isLoading: false,
	isError: false
};

export const fetchEmployeeMonthStatistics = createAsyncThunk(
	'employee-month-statistics/fetchEmployeeMonthStatistics',
	async (yearMonth: string) => {
		const response = await axios.get<ApiResponse>(`/api/v1/staffStatistics/month?yearMonth=${yearMonth}`);
		return response.data;
	}
);

const employeeMonthStatisticsSlice = createSlice({
	name: 'employeeStatistics',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchEmployeeMonthStatistics.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchEmployeeMonthStatistics.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.statistics = action.payload;
			})
			.addCase(fetchEmployeeMonthStatistics.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default employeeMonthStatisticsSlice.reducer;

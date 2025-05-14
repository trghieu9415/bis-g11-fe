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
	statisticsYearMonth: ApiResponse[] | null;
	isLoading: boolean;
	isError: boolean;
}

const initialState: EmployeeStatisticsState = {
	statisticsYearMonth: null,
	isLoading: false,
	isError: false
};

export const fetchEmployeeYearMonthStatistics = createAsyncThunk(
	'employee-year-month-statistics/fetchEmployeeYearMonthStatistics',
	async (year: string) => {
		const response = await axios.get<ApiResponse[]>(`/api/v1/staffStatistics/year/month?year=${year}`);
		return response.data;
	}
);

const employeeMonthStatisticsSlice = createSlice({
	name: 'employeeStatistics',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchEmployeeYearMonthStatistics.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchEmployeeYearMonthStatistics.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.statisticsYearMonth = action.payload;
			})
			.addCase(fetchEmployeeYearMonthStatistics.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default employeeMonthStatisticsSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ApiResponse {
	id: number;
	year: string;
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

export const fetchEmployeeYearStatistics = createAsyncThunk(
	'employee-year-statistics/fetchEmployeeYearStatistics',
	async (year: string) => {
		const response = await axios.get<ApiResponse>(`/api/v1/staffStatistics/year?year=${year}`);
		return response.data;
	}
);

const employeeYearStatisticsSlice = createSlice({
	name: 'employeeYearStatistics',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchEmployeeYearStatistics.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchEmployeeYearStatistics.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.statistics = action.payload;
			})
			.addCase(fetchEmployeeYearStatistics.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default employeeYearStatisticsSlice.reducer;

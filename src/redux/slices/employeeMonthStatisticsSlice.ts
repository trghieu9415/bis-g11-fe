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

export const fetchEmployeeStatistics = createAsyncThunk(
	'employee-statistics/fetchEmployeeStatistics',
	async (yearMonth: string) => {
		const response = await axios.get<ApiResponse>(`/api/v1/staffStatistics/month?yearMonth=${yearMonth}`);
		console.log(response);
		return response.data;
	}
);

const employeeStatisticsSlice = createSlice({
	name: 'employeeStatistics',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchEmployeeStatistics.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchEmployeeStatistics.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.statistics = action.payload;
			})
			.addCase(fetchEmployeeStatistics.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default employeeStatisticsSlice.reducer;

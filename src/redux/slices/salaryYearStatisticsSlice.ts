import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ApiResponse {
	month: string | null;
	year: string | null;
	averageWorkingDays: number;
	totalSickLeaves: number;
	totalMaternityLeaves: number;
	totalPaidLeaves: number;
	totalUnpaidLeaves: number;
	totalHolidayLeaves: number;
	avgGrossSalary: string;
	avgNetSalary: string;
	avgAllowance: string;
	avgPenalties: string;
	avgTax: string;
	costPerEmployee: string;
	totalGrossSalary: string;
	totalNetSalary: string;
	totalAllowance: string;
	totalPenalties: string;
	totalTax: string;
	totalEmployeeBHXH: string;
	totalEmployeeBHYT: string;
	totalEmployeeBHTN: string;
	totalSickBenefit: string;
	totalMaternityBenefit: string;
	totalCompanyCost: string;
}

interface SalaryYearStatisticsState {
	statistics: ApiResponse | null;
	isLoading: boolean;
	isError: boolean;
}

const initialState: SalaryYearStatisticsState = {
	statistics: null,
	isLoading: false,
	isError: false
};

export const fetchSalaryYearStatistics = createAsyncThunk(
	'salary-year-statistics/fetchSalaryYearStatistics',
	async (year: string) => {
		const response = await axios.get<ApiResponse>(`/api/v1/salaryStatistics/year?year=${year}`);
		return response.data;
	}
);

const salaryYearStatisticsSlice = createSlice({
	name: 'salaryYearStatistics',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchSalaryYearStatistics.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchSalaryYearStatistics.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.statistics = action.payload;
			})
			.addCase(fetchSalaryYearStatistics.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default salaryYearStatisticsSlice.reducer;

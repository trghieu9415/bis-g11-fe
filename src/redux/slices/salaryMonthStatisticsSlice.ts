import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ApiResponse {
	month: string;
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

interface SalaryMonthStatisticsState {
	statistics: ApiResponse | null;
	isLoading: boolean;
	isError: boolean;
}

const initialState: SalaryMonthStatisticsState = {
	statistics: null,
	isLoading: false,
	isError: false
};

export const fetchSalaryMonthStatistics = createAsyncThunk(
	'salary-month-statistics/fetchSalaryMonthStatistics',
	async (month: string) => {
		const response = await axios.get<ApiResponse>(`/api/v1/salaryStatistics/month?month=${month}`);
		return response.data;
	}
);

const salaryMonthStatisticsSlice = createSlice({
	name: 'salaryMonthStatistics',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchSalaryMonthStatistics.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchSalaryMonthStatistics.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.statistics = action.payload;
			})
			.addCase(fetchSalaryMonthStatistics.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default salaryMonthStatisticsSlice.reducer;

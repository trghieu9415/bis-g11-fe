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
	statisticsYearMonth: ApiResponse[] | null;
	isLoading: boolean;
	isError: boolean;
}

const initialState: SalaryYearStatisticsState = {
	statisticsYearMonth: null,
	isLoading: false,
	isError: false
};

export const fetchSalaryYearMonthStatistics = createAsyncThunk(
	'salary-year-month-statistics/fetchSalaryYearMonthStatistics',
	async (year: string) => {
		const response = await axios.get<ApiResponse[]>(`/api/v1/salaryStatistics/year/month?year=${year}`);
		return response.data;
	}
);

const salaryYearMonthStatisticsSlice = createSlice({
	name: 'salaryYearMonthStatistics',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchSalaryYearMonthStatistics.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchSalaryYearMonthStatistics.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.statisticsYearMonth = action.payload;
			})
			.addCase(fetchSalaryYearMonthStatistics.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default salaryYearMonthStatisticsSlice.reducer;

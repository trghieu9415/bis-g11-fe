import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ApiResponse {
	id: number;
	idString: string;
	standardWorkingDays: number;
	maternityBenefit: string;
	sickBenefit: string;
	netSalary: string;
	grossSalary: string;
	tax: string;
	employeeBHXH: string;
	employeeBHYT: string;
	employeeBHTN: string;
	penalties: string;
	allowance: string;
	totalIncome: string;
	attendanceId: number;
	monthOfYear: string;
	userIdStr: string;
	fullName: string;
	roleName: string;
	salaryCoefficient: number;
	totalWorkingDays: number;
	totalSickLeaves: number;
	totalPaidLeaves: number;
	totalMaternityLeaves: number;
	totalUnpaidLeaves: number;
	totalHolidayLeaves: number;
	baseSalary: string;
	totalBaseSalary: string;
	totalBenefit: string;
	mainSalary: string;
	deductions: string;
}

interface PayrollState {
	payrollsByYear: ApiResponse[];
	isLoading: boolean;
	isError: boolean;
}

const initialState: PayrollState = {
	payrollsByYear: [],
	isLoading: false,
	isError: false
};

export const fetchPayrollsByYear = createAsyncThunk(
	'payrolls/fetchPayrollsByYear',
	async (year: string) => {
		const response = await axios.get<ApiResponse[]>(`/api/v1/payrolls/year?year=${year}`);
		return response.data;
	}
);

const payrollsByYearSlice = createSlice({
	name: 'payrollsByYear',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchPayrollsByYear.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchPayrollsByYear.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.payrollsByYear = action.payload;
			})
			.addCase(fetchPayrollsByYear.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default payrollsByYearSlice.reducer;

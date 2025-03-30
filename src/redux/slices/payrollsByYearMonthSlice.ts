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
	payrollsByYearMonth: ApiResponse[];
	isLoading: boolean;
	isError: boolean;
}

const initialState: PayrollState = {
	payrollsByYearMonth: [],
	isLoading: false,
	isError: false
};

export const fetchPayrollsByYearMonth = createAsyncThunk(
	'payrolls/fetchPayrollsByYearMonth',
	async (yearMonth: string) => {
		const response = await axios.get<ApiResponse[]>(`/api/v1/payrolls/month?yearMonth=${yearMonth}`);
		return response.data;
	}
);

const payrollsByYearMonthSlice = createSlice({
	name: 'payrolls',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchPayrollsByYearMonth.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchPayrollsByYearMonth.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.payrollsByYearMonth = action.payload;
			})
			.addCase(fetchPayrollsByYearMonth.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default payrollsByYearMonthSlice.reducer;

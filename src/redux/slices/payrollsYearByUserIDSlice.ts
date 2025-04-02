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
	payrollsYearByUserID: ApiResponse[];
	isLoading: boolean;
	isError: boolean;
}

const initialState: PayrollState = {
	payrollsYearByUserID: [],
	isLoading: false,
	isError: false
};

export const fetchPayrollsYearByUserID = createAsyncThunk(
	'payrolls/fetchPayrollsYearByUserID',
	async ({ userId, year }: { userId: number; year: string }) => {
		const response = await axios.get<ApiResponse[]>(`/api/v1/payrolls/user/year/${userId}?year=${year}`);
		console.log(response);
		return response.data;
	}
);

const payrollsYearByUserIDSlice = createSlice({
	name: 'payrollsYearByUserID',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchPayrollsYearByUserID.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchPayrollsYearByUserID.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.payrollsYearByUserID = action.payload;
			})
			.addCase(fetchPayrollsYearByUserID.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default payrollsYearByUserIDSlice.reducer;

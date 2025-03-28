import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ApiResponse {
	id: number;
	month: string;
	totalSalary: number;
	userId: number;
}

interface SalaryMonthState {
	salaryMonth: ApiResponse[];
	isLoading: boolean;
	isError: boolean;
}

const initialState: SalaryMonthState = {
	salaryMonth: [],
	isLoading: false,
	isError: false
};

export const fetchAllSalaryMonth = createAsyncThunk('salary-month/fetchAllSalaryMonth', async (month: string) => {
	const response = await axios.get<ApiResponse[]>(`/api/v1/payrolls?month=${month}`);
	return response.data;
});

const salaryMonthSlice = createSlice({
	name: 'salaryMonth',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchAllSalaryMonth.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchAllSalaryMonth.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.salaryMonth = action.payload;
			})
			.addCase(fetchAllSalaryMonth.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default salaryMonthSlice.reducer;

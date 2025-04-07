// src/redux/slices/allowancesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ApiResponse {
	id: number;
	idString: string;
	roleName: string[];
}

interface AllowanceState {
	allowances: ApiResponse[];
	isLoading: boolean;
	isError: boolean;
}

const initialState: AllowanceState = {
	allowances: [],
	isLoading: false,
	isError: false
};

export const fetchAllAllowances = createAsyncThunk('allowances/fetchAllAllowances', async () => {
	const response = await axios.get<ApiResponse[]>('/api/v1/allowances');
	return response.data;
});

const allowancesSlice = createSlice({
	name: 'allowances',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchAllAllowances.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchAllAllowances.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.allowances = action.payload;
			})
			.addCase(fetchAllAllowances.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default allowancesSlice.reducer;
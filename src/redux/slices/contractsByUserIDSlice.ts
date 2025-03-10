// src/redux/slices/usersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ApiResponse {
	id: number;
	idString: string;
	userId: number;
	fullName: string;
	baseSalary: number;
	status: number;
	startDate: string;
	endDate: string;
	expiryDate: string;
	roleName: string;
	levelName: string;
	salaryCoefficient: number;
}

interface ContractState {
	contracts: ApiResponse[];
	isLoading: boolean;
	isError: boolean;
}

const initialState: ContractState = {
	contracts: [],
	isLoading: false,
	isError: false
};

export const fetchAllContractsByUserId = createAsyncThunk('contracts/fetchAllContractsByUserId', async (id: number) => {
	const response = await axios.get<ApiResponse[]>(`/api/v1/contracts/user/${id}`);
	return response.data;
});

const contractsByUserIDSlice = createSlice({
	name: 'contracts',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchAllContractsByUserId.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchAllContractsByUserId.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.contracts = action.payload;
			})
			.addCase(fetchAllContractsByUserId.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default contractsByUserIDSlice.reducer;

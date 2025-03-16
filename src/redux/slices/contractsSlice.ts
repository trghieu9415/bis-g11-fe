// src/redux/slices/usersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ApiResponse {
	id: number;
	idString: string;
	userId: number;
	fullName: string;
	baseSalary: number;
	status: boolean;
	startDate: string;
	endDate: string;
	expiryDate: string;
	roleName: string;
	levelName: string;
	salaryCoefficient: number;
}

interface TransformedContract extends Omit<ApiResponse, 'baseSalary'> {
	baseSalary: string;
	statusLabel: string;
	userIdString: string;
}

interface ContractsState {
	contracts: TransformedContract[];
	isLoading: boolean;
	isError: boolean;
}

const initialState: ContractsState = {
	contracts: [],
	isLoading: false,
	isError: false
};

export const fetchContracts = createAsyncThunk('users/fetchContracts', async () => {
	const response = await axios.get<ApiResponse[]>('/api/v1/contracts');
	const filteredContracts = response?.data.map(contract => ({
		...contract,
		baseSalary: contract.baseSalary.toLocaleString('en-US') + ' VND',
		userIdString: `NV-${contract.userId}`,
		statusLabel: contract.status ? 'Hiệu lực' : 'Không hiệu lực'
	}));
	return filteredContracts;
});

const contractsSlice = createSlice({
	name: 'contracts',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchContracts.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchContracts.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.contracts = action.payload;
			})
			.addCase(fetchContracts.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default contractsSlice.reducer;

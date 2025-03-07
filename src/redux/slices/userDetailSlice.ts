// src/redux/slices/usersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ApiResponse {
	id: number;
	idString: string;
	fullName: string;
	phoneNumber: string;
	email: string;
	dateOfBirth: string;
	address: string;
	gender: string;
	username: string;
	createdAt: string;
	status: number;
	resContractDTO?: {
		id: number;
		userId: number;
		fullName: string;
		baseSalary: number;
		standardWorkingDay: number;
		status: number;
		startDate: string;
		endDate: string;
		expiryDate: string;
		roleName: string;
		levelName: string;
		salaryCoefficient: number;
	};
}

interface UsersState {
	user: ApiResponse;
	isLoading: boolean;
	isError: boolean;
}

const initialState: UsersState = {
	user: {} as ApiResponse,
	isLoading: false,
	isError: false
};

export const fetchUserDetail = createAsyncThunk('user/fetchUserDetail', async (id: number) => {
	const response = await axios.get<ApiResponse>(`/api/v1/users/${id}`);
	return response.data;
});

const userDetailSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchUserDetail.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchUserDetail.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.user = action.payload;
			})
			.addCase(fetchUserDetail.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default userDetailSlice.reducer;

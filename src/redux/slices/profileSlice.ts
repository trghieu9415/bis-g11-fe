// src/redux/slices/usersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ContractDTO {
	id: number;
	idString: string;
	userId: number;
	fullName: string;
	seniorityId: number;
	baseSalary: number;
	status: number;
	startDate: string;
	endDate: string;
	expiryDate: string;
	roleName: string;
	levelName: string;
	salaryCoefficient: number;
}

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
	resContractDTO: ContractDTO;
}

interface ProfileState {
	profile: ApiResponse | null;
	isLoading: boolean;
	isError: boolean;
}

const initialState: ProfileState = {
	profile: null,
	isLoading: false,
	isError: false
};

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
	const response = await axios.get<ApiResponse>('/api/v1/users/me');
	console.log(response);
	return response.data;
});

const profileSlice = createSlice({
	name: 'profile',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchProfile.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchProfile.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.profile = action.payload;
			})
			.addCase(fetchProfile.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default profileSlice.reducer;

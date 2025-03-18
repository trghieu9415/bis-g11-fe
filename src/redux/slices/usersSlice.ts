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

interface Employee {
	id: number;
	idString: string;
	full_name: string;
	role: string;
	status: boolean;
	base_salary: number;
	level: string;
	salary_coefficient: number;
	gender: boolean;
	email: string;
	phone: string;
	date_of_birth: string;
	address: string;
	username: string;
	password: string;
}

interface UsersState {
	users: Employee[];
	isLoading: boolean;
	isError: boolean;
}

const initialState: UsersState = {
	users: [],
	isLoading: false,
	isError: false
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
	const response = await axios.get<ApiResponse[]>('/api/v1/users');

	const formattedData: Employee[] = response.data
		.filter(user => user.username.toLowerCase() !== 'admin')
		.map(user => ({
			id: user.id,
			idString: user.idString,
			full_name: user.fullName,
			role: user.resContractDTO?.roleName || '',
			status: user.status === 1,
			base_salary: user.resContractDTO?.baseSalary || 0,
			level: user.resContractDTO?.levelName || '',
			salary_coefficient: user.resContractDTO?.salaryCoefficient || 1,
			gender: user.gender === 'MALE',
			email: user.email,
			phone: user.phoneNumber,
			date_of_birth: user.dateOfBirth,
			address: user.address,
			username: user.username,
			password: ''
		}));

	return formattedData;
});

const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchUsers.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.users = action.payload;
			})
			.addCase(fetchUsers.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default usersSlice.reducer;

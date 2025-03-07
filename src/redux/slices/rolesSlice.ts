// src/redux/slices/usersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ResSeniority {
	id: number;
	levelName: string;
	description: string;
	salaryCoefficient: number;
	status: boolean;
	roleId: number;
}

interface ApiResponse {
	id: number;
	name: string;
	description: string;
	status: boolean;
	resSeniority: ResSeniority[];
}

interface Role {
	id: number;
	name: string;
	description: string;
	status: boolean;
	resSeniority: ResSeniority[];
}

interface UsersState {
	roles: Role[];
	isLoading: boolean;
	isError: boolean;
}

const initialState: UsersState = {
	roles: [],
	isLoading: false,
	isError: false
};

export const fetchRoles = createAsyncThunk('users/fetchRoles', async () => {
	const response = await axios.get<ApiResponse[]>('/api/v1/roles');

	// const formattedData: Employee[] = response.data.map(user => ({
	// 	id: user.id,
	// 	idString: user.idString,
	// 	full_name: user.fullName,
	// 	role: user.resContractDTO?.roleName || '',
	// 	status: user.status === 1,
	// 	base_salary: user.resContractDTO?.baseSalary || 0,
	// 	level: user.resContractDTO?.levelName || '',
	// 	salary_coefficient: user.resContractDTO?.salaryCoefficient || 1,
	// 	gender: user.gender === 'MALE',
	// 	email: user.email,
	// 	phone: user.phoneNumber,
	// 	date_of_birth: user.dateOfBirth,
	// 	address: user.address,
	// 	username: user.username,
	// 	password: ''
	// }));

	return response.data;
});

const rolesSlice = createSlice({
	name: 'roles',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchRoles.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchRoles.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.roles = action.payload;
			})
			.addCase(fetchRoles.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default rolesSlice.reducer;

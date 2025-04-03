// src/redux/slices/usersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ResSeniority {
	id: number;
	levelName: string;
	description: string;
	salaryCoefficient: number;
	status: number;
	roleId: number;
}

interface ApiResponse {
	id: number;
	name: string;
	description: string;
	status: boolean;
	resSeniority: ResSeniority[];
}

interface RolesState {
	roles: ApiResponse[];
	isLoading: boolean;
	isError: boolean;
}

const initialState: RolesState = {
	roles: [],
	isLoading: false,
	isError: false
};

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
	const response = await axios.get<ApiResponse[]>('/api/v1/roles');
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

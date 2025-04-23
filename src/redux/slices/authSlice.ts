/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';
import { json } from 'stream/consumers';

interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	userId: number;
	roleName: string;
}

interface UserProfile {
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
	};
}

interface AuthState {
	isAuthenticated: boolean;
	profile: UserProfile | null;
	isLoading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	isAuthenticated: !!localStorage.getItem('accessToken'),
	profile: null,
	isLoading: false,
	error: null
};

// Thunk to handle login and fetch user profile in one operation
export const loginUser = createAsyncThunk(
	'auth/loginUser',
	async (credentials: { username: string; password: string; platform: string }, { rejectWithValue }) => {
		try {
			console.log('Logging in with credentials:', credentials);

			// Step 1: Login to get tokens
			const loginResponse = await axios.post('/api/v1/auth/access', credentials);

			console.log('Login response:', loginResponse.data);

			// Extract data
			const { accessToken, refreshToken, userId } = loginResponse.data;

			// Save tokens to localStorage
			localStorage.setItem('accessToken', accessToken);
			localStorage.setItem('refreshToken', refreshToken);

			// Step 2: Fetch user profile
			const profileResponse = await axios.get('/api/v1/users/me', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});

			localStorage.setItem('profile', JSON.stringify(profileResponse.data));
			console.log('Profile response:', profileResponse.data);

			// Return combined result
			return profileResponse.data;
		} catch (error: any) {
			console.error('Auth error:', error.response?.data || error);

			// Clean up if login failed
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');

			return rejectWithValue(error.response?.data?.message || 'Authentication failed');
		}
	}
);

// Separate thunk just for refreshing the profile
export const refreshUserProfile = createAsyncThunk('auth/refreshUserProfile', async (_, { rejectWithValue }) => {
	try {
		const response = await axios.get('/api/v1/users/me');
		return response.data;
	} catch (error: any) {
		return rejectWithValue(error.response?.data?.message || 'Failed to refresh user profile');
	}
});

// Thunk to handle logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
	try {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		return null;
	} catch (error: any) {
		return rejectWithValue('Logout failed');
	}
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			// Handle combined login & profile fetch
			.addCase(loginUser.pending, state => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = true;
				state.profile = action.payload;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.error = action.payload as string;
			})

			// Handle profile refresh
			.addCase(refreshUserProfile.pending, state => {
				state.isLoading = true;
			})
			.addCase(refreshUserProfile.fulfilled, (state, action) => {
				state.isLoading = false;
				state.profile = action.payload;
			})
			.addCase(refreshUserProfile.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// Handle logout
			.addCase(logoutUser.fulfilled, state => {
				state.isAuthenticated = false;
				state.profile = null;
			});
	}
});

export default authSlice.reducer;

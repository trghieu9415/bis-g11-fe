/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, createListenerMiddleware } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	userId: number;
	roleName: string;
}

interface AuthState {
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	isAuthenticated: !!localStorage.getItem('accessToken'),
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

			// Return combined result
			// return loginResponse.data;
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
		// Lấy accessToken để gửi yêu cầu logout
		const accessToken = localStorage.getItem('accessToken');

		if (accessToken) {
			// Gọi API logout để vô hiệu hóa token ở phía server
			try {
				await axios.post('/api/v1/auth/logout', null, {
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				});
				console.log('Logout API called successfully');
			} catch (apiError) {
				// Chỉ log lỗi, tiếp tục xử lý logout ở client
				console.error('Failed to call logout API:', apiError);
			}
		}

		// Xóa tất cả thông tin người dùng từ localStorage
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');

		// Phát event logout để các component khác có thể lắng nghe
		window.dispatchEvent(new Event('auth-logout'));

		return null;
	} catch (error: any) {
		console.error('Logout error:', error);
		// Vẫn xóa dữ liệu local ngay cả khi API thất bại
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');

		return rejectWithValue('Logout failed');
	}
});

export const authStorageListener = createListenerMiddleware();

authStorageListener.startListening({
	actionCreator: loginUser.fulfilled,
	effect: (action, listenerApi) => {
		// Phát event để các component khác biết trạng thái đã thay đổi
		window.dispatchEvent(new Event('auth-change'));
	}
});

export const authLogoutListener = createListenerMiddleware();

authLogoutListener.startListening({
	actionCreator: logoutUser.fulfilled,
	effect: (action, listenerApi) => {
		// Phát event để các component khác biết đã logout
		window.dispatchEvent(new Event('auth-logout'));
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
			})
			.addCase(refreshUserProfile.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// Handle logout
			.addCase(logoutUser.fulfilled, state => {
				// Reset toàn bộ state về giá trị khởi tạo
				return {
					...initialState,
					isAuthenticated: false // Đảm bảo isAuthenticated luôn false khi logout
				};
			});
	}
});

export default authSlice.reducer;

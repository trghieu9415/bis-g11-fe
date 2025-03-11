// src/redux/slices/usersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

interface ApiResponse {
	id: number;
	idString: string;
	title: string;
	startDate: string;
	endDate: string;
	sendDate: string;
	description: string;
	leaveReason: number;
	updatedAt: string;
	status: number;
	userId: number;
}

interface LeaveRequestStates {
	leaveRequests: ApiResponse[];
	isLoading: boolean;
	isError: boolean;
}

const initialState: LeaveRequestStates = {
	leaveRequests: [],
	isLoading: false,
	isError: false
};

export const fetchAllLeaveRequestsByUserId = createAsyncThunk(
	'leave-request/fetchAllLeaveRequestsByUserId',
	async (id: number) => {
		const response = await axios.get<ApiResponse[]>(`/api/v1/leaveReqs/user/${id}`);
		return response.data;
	}
);

const leaveRequestByUserIDSlice = createSlice({
	name: 'leaveRequest',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchAllLeaveRequestsByUserId.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(fetchAllLeaveRequestsByUserId.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.leaveRequests = action.payload;
			})
			.addCase(fetchAllLeaveRequestsByUserId.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default leaveRequestByUserIDSlice.reducer;

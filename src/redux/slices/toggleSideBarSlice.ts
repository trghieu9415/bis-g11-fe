// src/redux/slices/usersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface PostToggleSidebar {
	isHideSidebar: boolean;
	isLoading: boolean;
	isError: boolean;
}

const initialState: PostToggleSidebar = {
	isHideSidebar: false,
	isLoading: false,
	isError: false
};

export const postToggleSidebar = createAsyncThunk('post-toggle-sidebar/postToggleSidebar', (toggle: boolean) => {
	return toggle;
});

const postToggleSidebarSlice = createSlice({
	name: 'postToggleSidebar',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(postToggleSidebar.pending, state => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(postToggleSidebar.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.isHideSidebar = action.payload;
			})
			.addCase(postToggleSidebar.rejected, state => {
				state.isLoading = false;
				state.isError = true;
			});
	}
});

export default postToggleSidebarSlice.reducer;

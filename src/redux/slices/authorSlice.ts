import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';
// import { Supplier } from '@/pages/dashboard/Warehouse Management/SupplierTable';

export type Author = {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
};

interface ApiResponse {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
}
interface AuthorState {
	authors: Author[];
	isLoading: boolean;
	error: string | null;
}

const initialState: AuthorState = {
	authors: [],
	isLoading: false,
	error: null
};

export const fetchAuthor = createAsyncThunk('authors/fetchAuthor', async () => {
	const response = await axios.get<ApiResponse[]>('api/v1/author/list');
	console.log(response);
	const formattedData: Author[] = response.data.map(author => ({
		id: author.id,
		name: author.name,
		createdAt: author.createdAt,
		updatedAt: author.updatedAt
	}));

	return formattedData;
});

const authorSlice = createSlice({
	name: 'authors',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchAuthor.pending, state => {
				state.isLoading = true;
			})
			.addCase(fetchAuthor.fulfilled, (state, action) => {
				state.isLoading = false;
				state.authors = action.payload;
			})
			.addCase(fetchAuthor.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to fetch authors';
			});
	}
});


export default authorSlice.reducer;

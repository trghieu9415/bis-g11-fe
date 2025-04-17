import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';
// import { Supplier } from '@/pages/dashboard/Warehouse Management/SupplierTable';

export type Category = {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
	productCount: number;
};

interface ApiResponse {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
	productCount: number;
}
interface CategoryState {
	categories: Category[];
	isLoading: boolean;
	error: string | null;
}

const initialState: CategoryState = {
	categories: [],
	isLoading: false,
	error: null
};

export const fetchCategory = createAsyncThunk('categories/fetchCategory', async () => {
	const response = await axios.get<ApiResponse[]>('api/v1/category/list');
	console.log(response);
	const formattedData: Category[] = response.data.map(category => ({
		id: category.id,
		name: category.name,
		createdAt: category.createdAt,
		updatedAt: category.updatedAt,
		productCount: category.productCount
	}));

	return formattedData;
});

const categorySlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchCategory.pending, state => {
				state.isLoading = true;
			})
			.addCase(fetchCategory.fulfilled, (state, action) => {
				state.isLoading = false;
				state.categories = action.payload;
			})
			.addCase(fetchCategory.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to fetch category';
			});
	}
});

export const {} = categorySlice.actions;

export default categorySlice.reducer;

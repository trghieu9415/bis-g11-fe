/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

export type Category = {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
	productCount: number;
};

// Đúng cấu trúc API response thường gặp ở dự án của bạn
interface ApiResponse {
	statusCode: number;
	success: boolean;
	message: string;
	data: {
		id: number;
		name: string;
		createdAt: string;
		updatedAt: string;
		productCount: number;
	}[];
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

export const fetchCategory = createAsyncThunk('categories/fetchCategory', async (_, { rejectWithValue }) => {
	try {
		const response = await axios.get<ApiResponse>('api/v1/category/list');
		console.log('Category response:', response.data);

		// Kiểm tra cấu trúc response
		if (response.data && response.data.data) {
			// Nếu response có cấu trúc { data: [...] }
			const formattedData: Category[] = response.data.data.map(category => ({
				id: category.id,
				name: category.name,
				createdAt: category.createdAt,
				updatedAt: category.updatedAt,
				productCount: category.productCount
			}));
			return formattedData;
		} else if (Array.isArray(response.data)) {
			// Nếu response trực tiếp là mảng
			const formattedData: Category[] = response.data.map(category => ({
				id: category.id,
				name: category.name,
				createdAt: category.createdAt,
				updatedAt: category.updatedAt,
				productCount: category.productCount
			}));
			return formattedData;
		} else {
			throw new Error('Unexpected API response format');
		}
	} catch (error: any) {
		console.error('Error fetching categories:', error);
		return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch categories');
	}
});

const categorySlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchCategory.pending, state => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchCategory.fulfilled, (state, action) => {
				state.isLoading = false;
				state.categories = action.payload;
			})
			.addCase(fetchCategory.rejected, (state, action) => {
				state.isLoading = false;
				state.error = (action.payload as string) || 'Failed to fetch categories';
			});
	}
});

export default categorySlice.reducer;

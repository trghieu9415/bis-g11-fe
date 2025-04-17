import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';
import { getSupplier } from '@/services/supplierService';
import { getAuthor } from '@/services/authorService';
import { getCategory } from '@/services/categoryService';

export type Product = {
	image: string;
	id: number;
	name: string;
	status: boolean;
	quantity: number;
	price: number;
	supplier: { id: number; name: string };
	category: { id: number; name: string };
	author: { id: number; name: string };
};

interface ApiResponse {
	id: number;
	name: string;
	image: string;
	quantity: number;
	status: number;
	price: number;
	supplierId: number;
	categoryId: number;
	authorId: number;
	createdAt: string;
	updatedAt: string;
}
interface ProductState {
	products: Product[];
	isLoading: boolean;
	error: string | null;
}

const initialState: ProductState = {
	products: [],
	isLoading: false,
	error: null
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
	const response = await axios.get<ApiResponse[]>('api/v1/product/list');
	const productsData = response.data;

	const supplierPromises = productsData.map(p => getSupplier(p.supplierId));
	const authorPromises = productsData.map(p => getAuthor(p.authorId));
	const categoryPromises = productsData.map(p => getCategory(p.categoryId));

	const suppliers = await Promise.all(supplierPromises);
	const authors = await Promise.all(authorPromises);
	const categories = await Promise.all(categoryPromises);

	const formattedData: Product[] = response.data.map((product, index) => ({
		id: product.id,
		name: product.name,
		image: product.image,
		quantity: product.quantity,
		status: product.status === 1,
		price: product.price,
		createdAt: product.createdAt,
		updatedAt: product.updatedAt,
		supplier: { id: suppliers[index].id, name: suppliers[index].name },
		category: { id: categories[index].id, name: categories[index].name },
		author: { id: authors[index].id, name: authors[index].name }
	}));

	const data = formattedData.filter(p => p.status == true);

	return data;
});

const productSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchProducts.pending, state => {
				state.isLoading = true;
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.isLoading = false;
				state.products = action.payload;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to fetch products';
			});
	}
});

export const {} = productSlice.actions;

export default productSlice.reducer;

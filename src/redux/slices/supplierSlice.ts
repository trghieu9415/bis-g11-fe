import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';
import { Supplier } from '@/pages/commerce/Warehouse Management/Supplier/SupplierTable';

// export type Supplier = {
// 	id: number;
// 	name: string;
// 	phoneNumber: string;
// 	email: string;
// 	address: string;
// 	status: boolean;
// 	percentage: number;
// 	createdAt: string;
// 	updatedAt: string;
// };

interface ApiResponse {
	id: number;
	name: string;
	phoneNumber: string;
	email: string;
	address: string;
	status: number;
	percentage: number;
	createdAt: string;
	updatedAt: string;
}
interface SupplierState {
	suppliers: Supplier[];
	isLoading: boolean;
	error: string | null;
}

const initialState: SupplierState = {
	suppliers: [],
	isLoading: false,
	error: null
};

export const fetchSuppliers = createAsyncThunk('suppliers/fetchSuppliers', async () => {
	const response = await axios.get<ApiResponse[]>('api/v1/supplier/list');

	const formattedData: Supplier[] = response.data.map(supplier => ({
		id: supplier.id,
		name: supplier.name,
		phone: supplier.phoneNumber,
		email: supplier.email,
		address: supplier.address,
		status: supplier.status === 1,
		percentage: supplier.percentage,
		createdAt: supplier.createdAt,
		updatedAt: supplier.updatedAt
	}));

	return formattedData;
});

const supplierSlice = createSlice({
	name: 'suppliers',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchSuppliers.pending, state => {
				state.isLoading = true;
			})
			.addCase(fetchSuppliers.fulfilled, (state, action) => {
				state.isLoading = false;
				state.suppliers = action.payload;
			})
			.addCase(fetchSuppliers.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to fetch suppliers';
			});
	}
});

export const {} = supplierSlice.actions;

export default supplierSlice.reducer;

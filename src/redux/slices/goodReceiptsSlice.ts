import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '@/services/customize-axios';

export type GoodReceiptDetail = {
	productId: number;
	productName?: string;
	quantity: number;
	inputPrice: number;
};

export type GoodReceipt = {
	id: number;
	userId: number;
	totalPrice: number;
	createdAt: string;
	updatedAt: string;
	goodReceiptDetails: GoodReceiptDetail[];
};

interface ApiResponse {
	id: number;
	userId: number;
	totalPrice: number;
	createdAt: string;
	updatedAt: string;
	goodReceiptDetails: GoodReceiptDetail[];
}

interface GoodReceiptState {
	goodReceipts: GoodReceipt[];
	isLoading: boolean;
	error: string | null;
}

const initialState: GoodReceiptState = {
	goodReceipts: [],
	isLoading: false,
	error: null
};

export const fetchGoodreceipt = createAsyncThunk('goodreceipts/fetchGoodreceipts', async () => {
	const response = await axios.get<ApiResponse[]>('api/v1/good-receipt/list');
	const formattedData: GoodReceipt[] = response.data.map(item => ({
		id: item.id,
		userId: item.userId,
		totalPrice: item.totalPrice,
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
		goodReceiptDetails: item.goodReceiptDetails || []
	}));

	return formattedData;
});

const goodreceiptsSlice = createSlice({
	name: 'goodReceipts',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchGoodreceipt.pending, state => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchGoodreceipt.fulfilled, (state, action) => {
				state.isLoading = false;
				state.goodReceipts = action.payload;
			})
			.addCase(fetchGoodreceipt.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to fetch good receipts';
			});
	}
});

export default goodreceiptsSlice.reducer;

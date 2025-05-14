import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
	fetchYearStatistics,
	fetchQuarterStatistics,
	fetchMonthStatistics,
	YearStatistics,
	QuarterStatistics,
	MonthStatistics
} from './statisticService';

interface StatisticsState {
	yearStats: YearStatistics | null;
	quarterStats: QuarterStatistics | null;
	monthStats: MonthStatistics | null;
	loading: boolean;
	error: string | null;
}

const initialState: StatisticsState = {
	yearStats: null,
	quarterStats: null,
	monthStats: null,
	loading: false,
	error: null
};

// Async thunks
export const getYearStatistics = createAsyncThunk(
	'statistics/getYearStatistics',
	async (year: number, { rejectWithValue }) => {
		try {
			return await fetchYearStatistics(year);
		} catch (error) {
			if (error instanceof Error) {
				return rejectWithValue(error.message);
			}
			return rejectWithValue('Không thể lấy thống kê theo năm');
		}
	}
);

export const getQuarterStatistics = createAsyncThunk(
	'statistics/getQuarterStatistics',
	async ({ year, quarter }: { year: number; quarter: number }, { rejectWithValue }) => {
		try {
			return await fetchQuarterStatistics(year, quarter);
		} catch (error) {
			if (error instanceof Error) {
				return rejectWithValue(error.message);
			}
			return rejectWithValue('Không thể lấy thống kê theo quý');
		}
	}
);

export const getMonthStatistics = createAsyncThunk(
	'statistics/getMonthStatistics',
	async ({ year, month }: { year: number; month: number }, { rejectWithValue }) => {
		try {
			return await fetchMonthStatistics(year, month);
		} catch (error) {
			if (error instanceof Error) {
				return rejectWithValue(error.message);
			}
			return rejectWithValue('Không thể lấy thống kê theo tháng');
		}
	}
);

const statisticsSlice = createSlice({
	name: 'statistics',
	initialState,
	reducers: {
		clearStatistics: state => {
			state.yearStats = null;
			state.quarterStats = null;
			state.monthStats = null;
			state.error = null;
		}
	},
	extraReducers: builder => {
		// Year statistics
		builder
			.addCase(getYearStatistics.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getYearStatistics.fulfilled, (state, action: PayloadAction<YearStatistics>) => {
				state.yearStats = action.payload;
				state.loading = false;
			})
			.addCase(getYearStatistics.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});

		// Quarter statistics
		builder
			.addCase(getQuarterStatistics.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getQuarterStatistics.fulfilled, (state, action: PayloadAction<QuarterStatistics>) => {
				state.quarterStats = action.payload;
				state.loading = false;
			})
			.addCase(getQuarterStatistics.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});

		// Month statistics
		builder
			.addCase(getMonthStatistics.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getMonthStatistics.fulfilled, (state, action: PayloadAction<MonthStatistics>) => {
				state.monthStats = action.payload;
				state.loading = false;
			})
			.addCase(getMonthStatistics.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	}
});

export const { clearStatistics } = statisticsSlice.actions;

export default statisticsSlice.reducer;

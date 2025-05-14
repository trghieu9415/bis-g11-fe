import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Types
export interface TopSellingProduct {
	id: number;
	name: string;
	quantitySold: number;
	revenue: number;
	profit: number;
}

export interface CategorySale {
	id: number;
	name: string;
	quantitySold: number;
	revenue: number;
	profit: number;
	percentageOfTotal: number;
}

export interface MonthlySales {
	[key: string]: number;
}

export interface QuarterlySales {
	[key: string]: number;
}

export interface YearStatistics {
	year: number;
	totalProductsSold: number;
	totalRevenue: number;
	totalProfit: number;
	totalCost: number;
	monthlySales: MonthlySales;
	quarterlySales: QuarterlySales;
	topSellingProducts: TopSellingProduct[];
	categorySales: CategorySale[];
}

export interface QuarterStatistics {
	year: number;
	quarter: number;
	totalProductsSold: number;
	totalRevenue: number;
	totalProfit: number;
	totalCost: number;
	monthlySales: MonthlySales;
	topSellingProducts: TopSellingProduct[];
	categorySales: CategorySale[];
}

export interface MonthStatistics {
	monthOfYear: string;
	totalProductsSold: number;
	totalRevenue: number;
	totalProfit: number;
	totalCost: number;
	topSellingProducts: TopSellingProduct[];
	categorySales: CategorySale[];
}

export interface ApiResponse<T> {
	statusCode: number;
	success: boolean;
	message: string;
	data: T;
}

/**
 * Lấy thống kê sản phẩm theo năm
 * @param year Năm cần thống kê
 * @returns Promise<YearStatistics>
 */
export const fetchYearStatistics = async (year: number): Promise<YearStatistics> => {
	try {
		const response = await axios.get<ApiResponse<YearStatistics>>(`${API_URL}/api/v1/statistics/products/year/${year}`);

		if (response.data.success) {
			return response.data.data;
		}

		throw new Error(response.data.message || 'Không thể lấy thống kê theo năm');
	} catch (error) {
		console.error('Error fetching year statistics:', error);
		throw error;
	}
};

/**
 * Lấy thống kê sản phẩm theo quý
 * @param year Năm cần thống kê
 * @param quarter Quý cần thống kê (1-4)
 * @returns Promise<QuarterStatistics>
 */
export const fetchQuarterStatistics = async (year: number, quarter: number): Promise<QuarterStatistics> => {
	try {
		const response = await axios.get<ApiResponse<QuarterStatistics>>(
			`${API_URL}/api/v1/statistics/products/quarter/${year}/${quarter}`
		);

		if (response.data.success) {
			return response.data.data;
		}

		throw new Error(response.data.message || 'Không thể lấy thống kê theo quý');
	} catch (error) {
		console.error('Error fetching quarter statistics:', error);
		throw error;
	}
};

/**
 * Lấy thống kê sản phẩm theo tháng
 * @param year Năm cần thống kê
 * @param month Tháng cần thống kê (1-12)
 * @returns Promise<MonthStatistics>
 */
export const fetchMonthStatistics = async (year: number, month: number): Promise<MonthStatistics> => {
	try {
		const response = await axios.get<ApiResponse<MonthStatistics>>(
			`${API_URL}/api/v1/statistics/products/month/${year}/${month}`
		);

		if (response.data.success) {
			return response.data.data;
		}

		throw new Error(response.data.message || 'Không thể lấy thống kê theo tháng');
	} catch (error) {
		console.error('Error fetching month statistics:', error);
		throw error;
	}
};

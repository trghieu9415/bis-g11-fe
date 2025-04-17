export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export type PaymentMethod = 'cash' | 'bank_transfer' | 'credit_card' | 'e_wallet';

export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface BillDetailRequest {
	productId: number;
	quantity: number;
}

export interface CustomerInfo {
	id: number;
	customerName: string;
	customerPhone: string;
	customerAddress: string;
}

export interface CreateBillRequest {
	userId: number;
	customerId: number;
	address?: string;
	billDetails: BillDetailRequest[];
}

export interface BillDetail {
	id: number;
	productId: number;
	productName: string;
	quantity: number;
	subPrice: number;
}

export interface Bill {
	id: number | string;
	idString: string;
	userId: number;
	customerInfo: {
		customerName: string;
		customerPhone: string;
		customerAddress: string;
	};
	totalPrice: number;
	totalAmount: number;
	createdAt: string;
	updatedAt: string;
	billDetails: BillDetail[];
}

export interface OrderProduct {
	id: string;
	name: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
}

export interface OrderFilter {
	search?: string;
	status?: OrderStatus;
	paymentStatus?: PaymentStatus;
}

export interface OrderSort {
	field: 'orderNumber' | 'orderDate' | 'customerName' | 'totalAmount' | 'status' | 'totalPrice';
	direction: 'asc' | 'desc';
}

export interface OrderPagination {
	page: number;
	limit: number;
	total: number;
}

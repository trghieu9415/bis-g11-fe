export type CustomerStatus = 'active' | 'inactive';

export type Customer = {
	id: number;
	idString: string;
	name: string;
	phoneNumber: string;
	email: string;
	address: string;
	status: number;
	createdAt: string;
	updatedAt: string;
};

export type RequestCustomer = {
	name: string;
	phoneNumber: string;
	email: string;
	address: string;
	status?: number;
};

export interface CustomerFilter {
	search?: string;
	status?: CustomerStatus;
}

export interface CustomerSort {
	field: 'fullName' | 'phone' | 'email' | 'createdAt';
	direction: 'asc' | 'desc';
}

export interface CustomerPagination {
	page: number;
	limit: number;
	total: number;
}

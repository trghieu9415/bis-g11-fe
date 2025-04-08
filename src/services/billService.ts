import axios from '@/services/customize-axios';

export interface BillDetailRequest {
	productId: number;
	quantity: number;
}

export interface CreateBillRequest {
	userId: number;
	customerId: number;
	address: string;
	billDetails: BillDetailRequest[];
}

export const getListBill = async () => axios.get('/api/v1/bill/list');

export const getBillById = async (id: number) => axios.get(`/api/v1/bill/${id}`);

export const createBill = async (body: CreateBillRequest) => axios.post('/api/v1/bill/create', body);

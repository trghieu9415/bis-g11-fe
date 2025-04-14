import axios from '@/services/customize-axios';
import { Bill, CreateBillRequest } from '@/types/order';

export const getListBill = async () => axios.get<Bill[]>('/api/v1/bill/list');

export const getBillById = async (id: number) => axios.get(`/api/v1/bill/${id}`);

export const createBill = async (body: CreateBillRequest) => axios.post('/api/v1/bill/create', body);

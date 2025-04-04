import axios from '@/services/customize-axios';
import { Customer, RequestCustomer } from '@/types/customer';

export const getListCustomers = async () => axios.get<Customer[]>('/api/v1/customer/list');

export const getCustomerById = async (id: number) => axios.get<Customer>(`/api/v1/customer/${id}`);

export const addCustomer = async (customer: Customer) => axios.post('/api/v1/customer', customer);

export const updateCustomer = async (customerId: number, customer: RequestCustomer) =>
	axios.put(`/api/v1/customer/${customerId}`, customer);

export const deleteCustomer = async (customerId: number) => axios.patch(`/api/v1/customer/${customerId}`);

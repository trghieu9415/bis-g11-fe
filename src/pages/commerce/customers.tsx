import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomersTable } from './customers/customers-table';
import { Customer, CustomerFilter, CustomerSort, CustomerPagination } from '@/types/customer';

// Mock data
const mockCustomers: Customer[] = [
	{
		id: '1',
		customerCode: 'CUS001',
		fullName: 'Nguyễn Văn A',
		phone: '0123456789',
		email: 'nguyenvana@example.com',
		address: '123 Đường ABC, Quận 1, TP.HCM',
		status: 'active',
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z'
	},
	{
		id: '2',
		customerCode: 'CUS002',
		fullName: 'Trần Thị B',
		phone: '0987654321',
		email: 'tranthib@example.com',
		address: '456 Đường XYZ, Quận 2, TP.HCM',
		status: 'active',
		createdAt: '2024-01-02T00:00:00Z',
		updatedAt: '2024-01-02T00:00:00Z'
	},
	{
		id: '3',
		customerCode: 'CUS003',
		fullName: 'Lê Văn C',
		phone: '0369852147',
		email: 'levanc@example.com',
		address: '789 Đường DEF, Quận 3, TP.HCM',
		status: 'inactive',
		createdAt: '2024-01-03T00:00:00Z',
		updatedAt: '2024-01-03T00:00:00Z'
	}
];

export const Customers = () => {
	const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
	const [filter, setFilter] = useState<CustomerFilter>({});
	const [sort, setSort] = useState<CustomerSort>({
		field: 'createdAt',
		direction: 'desc'
	});
	const [pagination, setPagination] = useState<CustomerPagination>({
		page: 1,
		limit: 10,
		total: mockCustomers.length
	});

	const handleSearch = (value: string) => {
		setFilter((prev: CustomerFilter) => ({ ...prev, search: value }));
		setPagination((prev: CustomerPagination) => ({ ...prev, page: 1 }));
	};

	const handleStatusChange = (value: string) => {
		setFilter((prev: CustomerFilter) => ({
			...prev,
			status: value === 'all' ? undefined : (value as Customer['status'])
		}));
		setPagination((prev: CustomerPagination) => ({ ...prev, page: 1 }));
	};

	const handleSort = (field: CustomerSort['field']) => {
		setSort((prev: CustomerSort) => ({
			field,
			direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
		}));
	};

	const handleDelete = (id: string) => {
		setCustomers(prev => prev.filter(customer => customer.id !== id));
	};

	const handleEdit = (updatedCustomer: Customer) => {
		setCustomers(prev =>
			prev.map(customer =>
				customer.id === updatedCustomer.id ? { ...updatedCustomer, updatedAt: new Date().toISOString() } : customer
			)
		);
	};

	const handlePageChange = (page: number) => {
		setPagination((prev: CustomerPagination) => ({ ...prev, page }));
	};

	return (
		<div className='space-y-4'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold'>Quản lý khách hàng</h1>
				<Button>Thêm khách hàng</Button>
			</div>

			<div className='flex gap-4'>
				<div className='flex-1'>
					<Input
						placeholder='Tìm kiếm theo tên, số điện thoại, email...'
						value={filter.search || ''}
						onChange={e => handleSearch(e.target.value)}
					/>
				</div>
				<Select value={filter.status} onValueChange={handleStatusChange}>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Trạng thái' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Tất cả</SelectItem>
						<SelectItem value='active'>Đang hoạt động</SelectItem>
						<SelectItem value='inactive'>Không hoạt động</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<CustomersTable
				customers={customers}
				sortField={sort.field}
				sortDirection={sort.direction}
				onSort={handleSort}
				onDelete={handleDelete}
				onEdit={handleEdit}
			/>
		</div>
	);
};

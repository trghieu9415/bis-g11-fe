import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { OrderStatus, OrderSort, Bill } from '@/types/order';
import { OrdersFilter } from './orders/orders-filter';
import { OrdersTable } from './orders/orders-table';
import { OrdersPagination } from './orders/orders-pagination';
import { getListBill } from '@/services/billService';

const Orders = () => {
	const navigate = useNavigate();
	const [orders, setOrders] = useState<Bill[]>([]);
	const [mockOrders, setMockOrders] = useState<Bill[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [sortField, setSortField] = useState<OrderSort['field']>('orderDate');
	const [sortDirection, setSortDirection] = useState<OrderSort['direction']>('desc');
	const itemsPerPage = 10;

	const fetchOrders = async () => {
		const res = await getListBill();
		if (res.data) {
			setMockOrders(res.data);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	useEffect(() => {
		let filteredOrders = [...mockOrders];

		// Lọc theo từ khóa tìm kiếm
		if (searchTerm) {
			filteredOrders = filteredOrders.filter(
				order =>
					order.idString.toLowerCase().includes(searchTerm.toLowerCase()) ||
					order.customerInfo.customerName.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Sắp xếp
		filteredOrders.sort((a, b) => {
			if (sortField === 'orderDate') {
				return sortDirection === 'asc'
					? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					: new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			} else {
				return sortDirection === 'asc' ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
			}
		});

		setOrders(filteredOrders);
	}, [searchTerm, statusFilter, sortField, sortDirection, mockOrders]);

	const handleSort = (field: OrderSort['field']) => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection('asc');
		}
	};

	const handleDelete = (id: string | number) => {
		if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
			return;
		}
		setOrders(orders.filter(order => order.id !== id));
	};

	// Tính toán phân trang
	const totalPages = Math.ceil(orders.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

	return (
		<div className='container mx-auto py-6'>
			<div className='mb-6 flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Quản lý đơn hàng</h1>
				<Button onClick={() => navigate('/business/new-order')} className='flex items-center'>
					<Plus className='mr-2 h-4 w-4' />
					Tạo đơn hàng mới
				</Button>
			</div>

			<OrdersFilter
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				statusFilter={statusFilter}
				onStatusChange={setStatusFilter}
			/>

			<div className='rounded-lg bg-white shadow'>
				<OrdersTable
					orders={paginatedOrders}
					sortField={sortField}
					sortDirection={sortDirection}
					onSort={handleSort}
					onDelete={handleDelete}
					onReturn={() => {}}
				/>

				<OrdersPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
			</div>
		</div>
	);
};

export default Orders;

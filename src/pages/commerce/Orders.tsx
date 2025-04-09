import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Order, OrderStatus, OrderSort } from '@/types/order';
import { OrdersFilter } from './orders/orders-filter';
import { OrdersTable } from './orders/orders-table';
import { OrdersPagination } from './orders/orders-pagination';

// Dữ liệu mẫu
const mockOrders: Order[] = [
	{
		id: '1',
		orderNumber: 'ORD001',
		orderDate: '2024-03-20',
		totalAmount: 150000,
		status: 'pending',
		customerName: 'Nguyễn Văn A',
		customerPhone: '0123456789',
		customerAddress: '123 Đường ABC, Quận 1, TP.HCM',
		items: [
			{
				id: '1',
				productId: 'P001',
				productName: 'Sản phẩm 1',
				quantity: 2,
				price: 50000,
				total: 100000
			},
			{
				id: '2',
				productId: 'P002',
				productName: 'Sản phẩm 2',
				quantity: 1,
				price: 50000,
				total: 50000
			}
		]
	},
	{
		id: '2',
		orderNumber: 'ORD002',
		orderDate: '2024-03-19',
		totalAmount: 250000,
		status: 'processing',
		customerName: 'Trần Thị B',
		customerPhone: '0987654321',
		customerAddress: '456 Đường XYZ, Quận 2, TP.HCM',
		items: [
			{
				id: '3',
				productId: 'P003',
				productName: 'Sản phẩm 3',
				quantity: 3,
				price: 50000,
				total: 150000
			},
			{
				id: '4',
				productId: 'P004',
				productName: 'Sản phẩm 4',
				quantity: 2,
				price: 50000,
				total: 100000
			}
		]
	},
	{
		id: '3',
		orderNumber: 'ORD003',
		orderDate: '2024-03-18',
		totalAmount: 350000,
		status: 'completed',
		customerName: 'Lê Văn C',
		customerPhone: '0369852147',
		customerAddress: '789 Đường DEF, Quận 3, TP.HCM',
		items: [
			{
				id: '5',
				productId: 'P005',
				productName: 'Sản phẩm 5',
				quantity: 4,
				price: 50000,
				total: 200000
			},
			{
				id: '6',
				productId: 'P006',
				productName: 'Sản phẩm 6',
				quantity: 3,
				price: 50000,
				total: 150000
			}
		]
	}
];

const Orders = () => {
	const navigate = useNavigate();
	const [orders, setOrders] = useState<Order[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [sortField, setSortField] = useState<OrderSort['field']>('orderDate');
	const [sortDirection, setSortDirection] = useState<OrderSort['direction']>('desc');
	const itemsPerPage = 10;

	useEffect(() => {
		// Lọc và sắp xếp dữ liệu
		let filteredOrders = [...mockOrders];

		// Lọc theo từ khóa tìm kiếm
		if (searchTerm) {
			filteredOrders = filteredOrders.filter(
				order =>
					order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
					order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Lọc theo trạng thái
		if (statusFilter !== 'all') {
			filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
		}

		// Sắp xếp
		filteredOrders.sort((a, b) => {
			if (sortField === 'orderDate') {
				return sortDirection === 'asc'
					? new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
					: new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
			} else {
				return sortDirection === 'asc' ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
			}
		});

		setOrders(filteredOrders);
	}, [searchTerm, statusFilter, sortField, sortDirection]);

	const handleSort = (field: OrderSort['field']) => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection('asc');
		}
	};

	const handleDelete = (id: string) => {
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
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>Quản lý đơn hàng</h1>
				<Button onClick={() => navigate('/new-order')}>
					<Plus className='w-4 h-4 mr-2' />
					Tạo đơn hàng mới
				</Button>
			</div>

			<OrdersFilter
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				statusFilter={statusFilter}
				onStatusChange={setStatusFilter}
			/>

			<div className='bg-white rounded-lg shadow'>
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

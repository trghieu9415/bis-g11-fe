import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { Order, OrderStatus, OrderSort } from '@/types/order';
import { OrderDetailDialog } from './order-detail-dialog';
import { OrderReturnDialog } from './order-return-dialog';

interface OrdersTableProps {
	orders: Order[];
	sortField: OrderSort['field'];
	sortDirection: OrderSort['direction'];
	onSort: (field: OrderSort['field']) => void;
	onDelete: (id: string) => void;
	onReturn: (id: string, reason: string) => void;
}

export const OrdersTable = ({ orders, sortField, sortDirection, onSort, onDelete, onReturn }: OrdersTableProps) => {
	const navigate = useNavigate();

	const getStatusColor = (status: OrderStatus) => {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'processing':
				return 'bg-blue-100 text-blue-800';
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: OrderStatus) => {
		switch (status) {
			case 'pending':
				return 'Chờ xử lý';
			case 'processing':
				return 'Đang xử lý';
			case 'completed':
				return 'Hoàn thành';
			case 'cancelled':
				return 'Đã hủy';
			default:
				return status;
		}
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Mã đơn hàng</TableHead>
					<TableHead className='cursor-pointer' onClick={() => onSort('orderDate')}>
						<div className='flex items-center gap-1'>
							Ngày đặt
							<ArrowUpDown className='h-4 w-4' />
							{sortField === 'orderDate' && <span className='text-xs'>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
						</div>
					</TableHead>
					<TableHead>Khách hàng</TableHead>
					<TableHead>Số điện thoại</TableHead>
					<TableHead className='cursor-pointer' onClick={() => onSort('totalAmount')}>
						<div className='flex items-center gap-1'>
							Tổng tiền
							<ArrowUpDown className='h-4 w-4' />
							{sortField === 'totalAmount' && <span className='text-xs'>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
						</div>
					</TableHead>
					<TableHead>Trạng thái</TableHead>
					<TableHead>Thao tác</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{orders.length === 0 ? (
					<TableRow>
						<TableCell colSpan={7} className='text-center py-4'>
							Không có đơn hàng nào
						</TableCell>
					</TableRow>
				) : (
					orders.map(order => (
						<TableRow key={order.id}>
							<TableCell className='font-medium'>{order.orderNumber}</TableCell>
							<TableCell>
								{format(new Date(order.orderDate), 'dd/MM/yyyy', {
									locale: vi
								})}
							</TableCell>
							<TableCell>{order.customerName}</TableCell>
							<TableCell>{order.customerPhone}</TableCell>
							<TableCell>
								{order.totalAmount.toLocaleString('vi-VN', {
									style: 'currency',
									currency: 'VND'
								})}
							</TableCell>
							<TableCell>
								<Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
							</TableCell>
							<TableCell>
								<div className='flex gap-2'>
									<OrderDetailDialog order={order} />
									<OrderReturnDialog order={order} onReturn={onReturn} />
									<Button variant='destructive' size='sm' onClick={() => onDelete(order.id)} title='Xóa đơn hàng'>
										<Trash2 className='w-4 h-4' />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
};

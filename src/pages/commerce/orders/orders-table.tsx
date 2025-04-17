import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, Clock } from 'lucide-react';
import { OrderSort, Bill } from '@/types/order';
import { OrderDetailDialog } from './order-detail-dialog';

interface OrdersTableProps {
	orders: Bill[];
	sortField: OrderSort['field'];
	sortDirection: OrderSort['direction'];
	onSort: (field: OrderSort['field']) => void;
	onDelete: (id: string | number) => void;
	onReturn: (id: string | number, reason: string) => void;
}

export const OrdersTable = ({ orders, sortField, sortDirection, onSort }: OrdersTableProps) => {
	return (
		<Table className='overflow-hidden rounded-md border border-gray-200'>
			<TableHeader>
				<TableRow className='bg-blue-50 hover:bg-blue-100'>
					<TableHead className='text-center font-bold text-blue-800'>Mã đơn hàng</TableHead>
					<TableHead className='cursor-pointer text-center font-bold text-blue-800' onClick={() => onSort('orderDate')}>
						<div className='flex items-center justify-center gap-1'>
							Thời gian đặt
							{sortField === 'orderDate' && (
								<ArrowUpDown
									className={`h-4 w-4 text-blue-600 transition-transform ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`}
								/>
							)}
						</div>
					</TableHead>
					<TableHead className='text-center font-bold text-blue-800'>Khách hàng</TableHead>
					<TableHead className='text-center font-bold text-blue-800'>Số điện thoại</TableHead>
					{/* <TableHead className='text-center font-bold text-blue-800'>Trạng thái</TableHead> */}
					<TableHead
						className='cursor-pointer text-center font-bold text-blue-800'
						onClick={() => onSort('totalAmount')}
					>
						<div className='flex items-center justify-center gap-1'>
							Tổng tiền
							{sortField === 'totalAmount' && (
								<ArrowUpDown
									className={`h-4 w-4 text-blue-600 transition-transform ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`}
								/>
							)}
						</div>
					</TableHead>
					<TableHead
						className='cursor-pointer text-center font-bold text-blue-800'
						onClick={() => onSort('totalPrice')}
					>
						<div className='flex items-center justify-center gap-1'>
							Tổng sản phẩm
							{sortField === 'totalPrice' && (
								<ArrowUpDown
									className={`h-4 w-4 text-blue-600 transition-transform ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`}
								/>
							)}
						</div>
					</TableHead>
					<TableHead className='text-center font-bold text-blue-800'>Thao tác</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody className='text-center'>
				{orders.length === 0 ? (
					<TableRow>
						<TableCell colSpan={8} className='py-8 text-center font-medium text-gray-500'>
							Không có đơn hàng nào
						</TableCell>
					</TableRow>
				) : (
					orders.map((order, index) => (
						<TableRow
							key={order.id}
							className={`transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
						>
							<TableCell className='font-medium text-blue-700'>{order.idString}</TableCell>
							<TableCell className='font-medium'>
								<div className='flex flex-col items-center'>
									<span>
										{format(new Date(order.createdAt), 'dd/MM/yyyy', {
											locale: vi
										})}
									</span>
									<span className='mt-1 flex items-center text-xs text-gray-500'>
										<Clock className='mr-1 h-3 w-3' />
										{format(new Date(order.createdAt), 'HH:mm', {
											locale: vi
										})}
									</span>
								</div>
							</TableCell>
							<TableCell className='font-medium'>{order.customerInfo.customerName}</TableCell>
							<TableCell className='font-medium'>{order.customerInfo.customerPhone}</TableCell>

							<TableCell className='font-medium text-emerald-700'>
								{order.totalPrice.toLocaleString('vi-VN', {
									style: 'currency',
									currency: 'VND'
								})}
							</TableCell>
							<TableCell className='font-medium'>{order.totalAmount}</TableCell>
							<TableCell>
								<div className='flex items-center justify-center gap-2'>
									<OrderDetailDialog order={order} />
								</div>
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
};

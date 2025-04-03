import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { Order, OrderStatus } from '@/types/order';

interface OrderDetailDialogProps {
	order: Order;
}

export const OrderDetailDialog = ({ order }: OrderDetailDialogProps) => {
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
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline' size='sm' title='Xem chi tiết'>
					<Eye className='w-4 h-4' />
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-3xl'>
				<DialogHeader>
					<DialogTitle>Chi tiết đơn hàng {order.orderNumber}</DialogTitle>
				</DialogHeader>
				<div className='space-y-6'>
					{/* Thông tin đơn hàng */}
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<h3 className='font-medium text-gray-500'>Ngày đặt</h3>
							<p>{format(new Date(order.orderDate), 'dd/MM/yyyy', { locale: vi })}</p>
						</div>
						<div>
							<h3 className='font-medium text-gray-500'>Trạng thái</h3>
							<Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
						</div>
						<div>
							<h3 className='font-medium text-gray-500'>Tổng tiền</h3>
							<p>
								{order.totalAmount.toLocaleString('vi-VN', {
									style: 'currency',
									currency: 'VND'
								})}
							</p>
						</div>
						<div>
							<h3 className='font-medium text-gray-500'>Ghi chú</h3>
							<p>{order.note || 'Không có'}</p>
						</div>
					</div>

					{/* Thông tin khách hàng */}
					<div>
						<h3 className='font-medium text-gray-500 mb-2'>Thông tin khách hàng</h3>
						<div className='bg-gray-50 p-4 rounded-lg space-y-2'>
							<p>
								<span className='font-medium'>Họ tên:</span> {order.customerName}
							</p>
							<p>
								<span className='font-medium'>Số điện thoại:</span> {order.customerPhone}
							</p>
							<p>
								<span className='font-medium'>Địa chỉ:</span> {order.customerAddress}
							</p>
						</div>
					</div>

					{/* Danh sách sản phẩm */}
					<div>
						<h3 className='font-medium text-gray-500 mb-2'>Danh sách sản phẩm</h3>
						<div className='border rounded-lg overflow-hidden'>
							<table className='w-full'>
								<thead className='bg-gray-50'>
									<tr>
										<th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Sản phẩm</th>
										<th className='px-4 py-2 text-right text-sm font-medium text-gray-500'>Số lượng</th>
										<th className='px-4 py-2 text-right text-sm font-medium text-gray-500'>Đơn giá</th>
										<th className='px-4 py-2 text-right text-sm font-medium text-gray-500'>Thành tiền</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-200'>
									{order.items.map(item => (
										<tr key={item.id}>
											<td className='px-4 py-2'>{item.productName}</td>
											<td className='px-4 py-2 text-right'>{item.quantity}</td>
											<td className='px-4 py-2 text-right'>
												{item.price.toLocaleString('vi-VN', {
													style: 'currency',
													currency: 'VND'
												})}
											</td>
											<td className='px-4 py-2 text-right'>
												{item.total.toLocaleString('vi-VN', {
													style: 'currency',
													currency: 'VND'
												})}
											</td>
										</tr>
									))}
								</tbody>
								<tfoot className='bg-gray-50'>
									<tr>
										<td colSpan={3} className='px-4 py-2 text-right font-medium'>
											Tổng cộng:
										</td>
										<td className='px-4 py-2 text-right font-medium'>
											{order.totalAmount.toLocaleString('vi-VN', {
												style: 'currency',
												currency: 'VND'
											})}
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

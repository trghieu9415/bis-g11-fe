import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Bill } from '@/types/order';

interface OrderDetailDialogProps {
	order: Bill;
}

export const OrderDetailDialog = ({ order }: OrderDetailDialogProps) => {
	// console.log(order);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline' size='sm' title='Xem chi tiết' className='bg-blue-50 text-blue-700 hover:bg-blue-100'>
					<Eye className='h-4 w-4' />
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-3xl'>
				<DialogHeader>
					<DialogTitle className='text-xl font-bold text-blue-800'>Chi tiết đơn hàng #{order.idString}</DialogTitle>
				</DialogHeader>
				<div className='space-y-6'>
					<div className='grid grid-cols-3 gap-4'>
						<div>
							<h3 className='font-bold text-black'>Ngày đặt</h3>
							<p className='font-medium'>
								{format(new Date(order.createdAt), 'dd/MM/yyyy', { locale: vi })}
								<span className='mt-1 block text-sm text-gray-500'>
									{format(new Date(order.createdAt), 'HH:mm', { locale: vi })}
								</span>
							</p>
						</div>
						<div>
							<h3 className='font-bold text-black'>Tổng tiền</h3>
							<p className='font-medium text-emerald-700'>
								{order.totalPrice.toLocaleString('vi-VN', {
									style: 'currency',
									currency: 'VND'
								})}
							</p>
						</div>
						<div>
							<h3 className='font-bold text-black'>Tổng sản phẩm</h3>
							<p className='text-left font-medium'>{order.totalAmount}</p>
						</div>
					</div>

					<div>
						<h3 className='mb-2 font-bold text-black'>Thông tin khách hàng</h3>
						<div className='space-y-2 rounded-lg bg-blue-50 p-4'>
							<p>
								<span className='font-medium'>Họ tên:</span> {order.customerInfo.customerName}
							</p>
							<p>
								<span className='font-medium'>Số điện thoại:</span> {order.customerInfo.customerPhone}
							</p>
							<p>
								<span className='font-medium'>Địa chỉ:</span> {order.customerInfo.customerAddress}
							</p>
						</div>
					</div>

					<div>
						<h3 className='mb-2 font-bold text-black'>Danh sách sản phẩm</h3>
						<div className='overflow-hidden rounded-lg border border-gray-200'>
							<table className='w-full'>
								<thead className='bg-blue-50'>
									<tr>
										<th className='px-4 py-2 text-left text-sm font-bold text-black'>Sản phẩm</th>
										<th className='px-4 py-2 text-right text-sm font-bold text-black'>Số lượng</th>
										<th className='px-4 py-2 text-right text-sm font-bold text-black'>Đơn giá</th>
										<th className='px-4 py-2 text-right text-sm font-bold text-black'>Thành tiền</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-200'>
									{order.billDetails.map(item => (
										<tr key={item.productId} className='hover:bg-gray-50'>
											<td className='px-4 py-2 font-medium'>{item.productName}</td>
											<td className='px-4 py-2 text-right'>{item.quantity}</td>
											<td className='px-4 py-2 text-right'>
												{item.subPrice?.toLocaleString('vi-VN', {
													style: 'currency',
													currency: 'VND'
												}) || 'N/A'}
											</td>
											<td className='px-4 py-2 text-right font-medium text-emerald-700'>
												{(item.subPrice * item.quantity)?.toLocaleString('vi-VN', {
													style: 'currency',
													currency: 'VND'
												}) || 'N/A'}
											</td>
										</tr>
									))}
								</tbody>
								<tfoot className='bg-gray-50'>
									<tr>
										<td colSpan={3} className='px-4 py-2 text-right font-bold text-black'>
											Tổng cộng:
										</td>
										<td className='px-4 py-2 text-right font-medium text-emerald-700'>
											{order.totalPrice.toLocaleString('vi-VN', {
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

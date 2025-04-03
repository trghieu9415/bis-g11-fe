import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import { Order } from '@/types/order';

interface OrderPaidDetailDialogProps {
	order: Order;
}

export const OrderPaidDetailDialog = ({ order }: OrderPaidDetailDialogProps) => {
	const getPaymentMethodText = (method: string) => {
		switch (method) {
			case 'cash':
				return 'Tiền mặt';
			case 'bank_transfer':
				return 'Chuyển khoản ngân hàng';
			case 'credit_card':
				return 'Thẻ tín dụng';
			case 'e_wallet':
				return 'Ví điện tử';
			default:
				return method;
		}
	};

	const getPaymentStatusColor = (status: string) => {
		switch (status) {
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'failed':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getPaymentStatusText = (status: string) => {
		switch (status) {
			case 'completed':
				return 'Đã thanh toán';
			case 'pending':
				return 'Chờ thanh toán';
			case 'failed':
				return 'Thanh toán thất bại';
			default:
				return status;
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline' size='sm' title='Xem chi tiết thanh toán'>
					<CreditCard className='w-4 h-4' />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Chi tiết thanh toán - Đơn hàng {order.orderNumber}</DialogTitle>
				</DialogHeader>
				<div className='space-y-4'>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<p className='text-sm font-medium text-gray-500'>Phương thức thanh toán</p>
							<p className='mt-1'>{getPaymentMethodText(order.paymentMethod)}</p>
						</div>
						<div>
							<p className='text-sm font-medium text-gray-500'>Trạng thái thanh toán</p>
							<div className='mt-1'>
								<Badge className={getPaymentStatusColor(order.paymentStatus)}>
									{getPaymentStatusText(order.paymentStatus)}
								</Badge>
							</div>
						</div>
						<div>
							<p className='text-sm font-medium text-gray-500'>Số tiền thanh toán</p>
							<p className='mt-1'>
								{order.totalAmount.toLocaleString('vi-VN', {
									style: 'currency',
									currency: 'VND'
								})}
							</p>
						</div>
						<div>
							<p className='text-sm font-medium text-gray-500'>Ngày thanh toán</p>
							<p className='mt-1'>
								{order.paymentDate
									? format(new Date(order.paymentDate), 'dd/MM/yyyy HH:mm', {
											locale: vi
										})
									: 'Chưa thanh toán'}
							</p>
						</div>
						{order.paymentMethod === 'bank_transfer' && (
							<>
								<div className='col-span-2'>
									<p className='text-sm font-medium text-gray-500'>Thông tin chuyển khoản</p>
									<div className='mt-1 space-y-1'>
										<p>Ngân hàng: {order.bankName}</p>
										<p>Số tài khoản: {order.bankAccount}</p>
										<p>Chủ tài khoản: {order.bankAccountName}</p>
										<p>Nội dung chuyển khoản: {order.transferContent}</p>
									</div>
								</div>
							</>
						)}
						{order.paymentMethod === 'credit_card' && (
							<>
								<div>
									<p className='text-sm font-medium text-gray-500'>Mã giao dịch</p>
									<p className='mt-1'>{order.transactionId}</p>
								</div>
								<div>
									<p className='text-sm font-medium text-gray-500'>Cổng thanh toán</p>
									<p className='mt-1'>{order.paymentGateway}</p>
								</div>
							</>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

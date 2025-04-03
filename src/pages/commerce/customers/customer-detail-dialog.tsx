import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { Customer } from '@/types/customer';

interface CustomerDetailDialogProps {
	customer: Customer;
}

export const CustomerDetailDialog = ({ customer }: CustomerDetailDialogProps) => {
	const getStatusColor = (status: Customer['status']) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'inactive':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: Customer['status']) => {
		switch (status) {
			case 'active':
				return 'Đang hoạt động';
			case 'inactive':
				return 'Không hoạt động';
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
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Chi tiết khách hàng</DialogTitle>
				</DialogHeader>
				<div className='space-y-4'>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<p className='text-sm font-medium text-gray-500'>Mã khách hàng</p>
							<p className='mt-1'>{customer.customerCode}</p>
						</div>
						<div>
							<p className='text-sm font-medium text-gray-500'>Họ tên</p>
							<p className='mt-1'>{customer.fullName}</p>
						</div>
						<div>
							<p className='text-sm font-medium text-gray-500'>Số điện thoại</p>
							<p className='mt-1'>{customer.phone}</p>
						</div>
						<div>
							<p className='text-sm font-medium text-gray-500'>Email</p>
							<p className='mt-1'>{customer.email}</p>
						</div>
						<div className='col-span-2'>
							<p className='text-sm font-medium text-gray-500'>Địa chỉ</p>
							<p className='mt-1'>{customer.address}</p>
						</div>
						<div>
							<p className='text-sm font-medium text-gray-500'>Trạng thái</p>
							<div className='mt-1'>
								<Badge className={getStatusColor(customer.status)}>{getStatusText(customer.status)}</Badge>
							</div>
						</div>
						<div>
							<p className='text-sm font-medium text-gray-500'>Ngày tạo</p>
							<p className='mt-1'>
								{format(new Date(customer.createdAt), 'dd/MM/yyyy', {
									locale: vi
								})}
							</p>
						</div>
						<div>
							<p className='text-sm font-medium text-gray-500'>Cập nhật lúc</p>
							<p className='mt-1'>
								{format(new Date(customer.updatedAt), 'dd/MM/yyyy', {
									locale: vi
								})}
							</p>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

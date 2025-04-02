import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { OrderStatus } from '@/types/order';

interface OrdersFilterProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	statusFilter: OrderStatus | 'all';
	onStatusChange: (value: OrderStatus | 'all') => void;
}

export const OrdersFilter = ({ searchTerm, onSearchChange, statusFilter, onStatusChange }: OrdersFilterProps) => {
	return (
		<div className='flex gap-4 mb-6'>
			<div className='flex-1 relative'>
				<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
				<Input
					className='pl-10'
					placeholder='Tìm kiếm theo mã đơn hàng hoặc tên khách hàng...'
					value={searchTerm}
					onChange={e => onSearchChange(e.target.value)}
				/>
			</div>
			<Select value={statusFilter} onValueChange={value => onStatusChange(value as OrderStatus | 'all')}>
				<SelectTrigger className='w-[180px]'>
					<SelectValue placeholder='Lọc theo trạng thái' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>Tất cả</SelectItem>
					<SelectItem value='pending'>Chờ xử lý</SelectItem>
					<SelectItem value='processing'>Đang xử lý</SelectItem>
					<SelectItem value='completed'>Hoàn thành</SelectItem>
					<SelectItem value='cancelled'>Đã hủy</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

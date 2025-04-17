import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { OrderStatus } from '@/types/order';

interface OrdersFilterProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	statusFilter: OrderStatus | 'all';
	onStatusChange: (value: OrderStatus | 'all') => void;
}

export const OrdersFilter = ({ searchTerm, onSearchChange }: OrdersFilterProps) => {
	return (
		<div className='mb-6 flex gap-4'>
			<div className='relative flex-1'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400' />
				<Input
					className='pl-10'
					placeholder='Tìm kiếm theo mã đơn hàng hoặc tên khách hàng...'
					value={searchTerm}
					onChange={e => onSearchChange(e.target.value)}
				/>
			</div>
		</div>
	);
};

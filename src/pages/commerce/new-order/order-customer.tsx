import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import { SelectCustomer } from './select-customer';
import CustomerZone from './customer-zone';

export default function OrderCustomer() {
	return (
		<div className='flex flex-col w-full p-3 rounded-md border shadow-md'>
			<div defaultValue='account' className='flex flex-col gap-2'>
				<div className='flex justify-between items-center'>
					<span>Thông tin người mua</span>
					<div className='flex gap-2'>
						<SelectCustomer />
						<Button variant='outline' className='rounded-none'>
							<RotateCw />
						</Button>
					</div>
				</div>
				<CustomerZone />
			</div>
		</div>
	);
}

import { Button } from '@/components/ui/button';
import { CirclePlus, Plus } from 'lucide-react';
import { SelectProduct } from './select-product';
import ProductsTable from './products-table';

export default function OrderProduct() {
	return (
		<div className='flex flex-col gap-y-5 w-full '>
			<div className='flex justify-between items-center flex-grow gap-x-5 '>
				<div className='w-[650px] flex items-center'>
					<Button variant={'default'} className='rounded-r-none border-r-0'>
						<Plus />
					</Button>
					<SelectProduct />
				</div>
				<Button variant={'outline'} className='hover:bg-green-800 hover:text-white'>
					<CirclePlus />
					<span>Tạo hóa đơn</span>
				</Button>
			</div>
			<div>
				<ProductsTable />
			</div>
		</div>
	);
}

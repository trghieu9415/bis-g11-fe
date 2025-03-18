import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download } from 'lucide-react';

export default function OrderPaid() {
	return (
		<div className='flex flex-col w-full h-full shadow-md rounded-md p-3 bg-white'>
			<div className='pb-3 text-lg uppercase font-bold'>Thông tin hóa đơn</div>
			<div className='h-full flex flex-col gap-y-3'>
				<div className='w-full'>
					<div className='w-full border-b text-md uppercase'>Sản phẩm</div>
					<div className='flex flex-col h-full gap-y-3 py-2'>
						<div className='grid grid-cols-2 end'>
							<span className='text-sm'>Tổng số lượng</span>
							<span className='text-sm span-col-2 border-b'>23</span>
						</div>
						<div className='grid grid-cols-2 items-end'>
							<span className='text-sm'>Tổng tiền</span>
							<span className='text-sm  span-col-2 border-b'>23.000</span>
						</div>
					</div>
				</div>
				<div className='w-full'>
					<div className='w-full border-b text-md uppercase'>Chi tiết</div>
					<div className='flex flex-col h-full gap-y-3 py-2'>
						<div className='grid grid-cols-2 items-end'>
							<span className='text-sm'>Ngày mua</span>
							<span className='text-sm span-col-2 border-b'>23/4/2025</span>
						</div>
						<div className='grid grid-cols-2 items-end'>
							<span className='text-sm'>Nhân viên lập</span>
							<span className='text-sm -mt-2 span-col-2 border-b'>Lê Quang Liêm</span>
						</div>
					</div>
				</div>
				<div className='w-full'>
					<div className='w-full border-b text-md uppercase'>Thanh toán</div>
					<div className='flex flex-col h-full gap-y-3 py-2'>
						<div className='grid grid-cols-2 items-end'>
							<span className='text-sm'>Khách trả</span>
							<Input className='text-sm span-col-2 border-b rounded-none h-7' value={0} />
						</div>
						<div className='grid grid-cols-2 items-end'>
							<span className='text-sm'>Tiền thừa</span>
							<span className='text-sm  span-col-2 border-b'>23.000</span>
						</div>
					</div>
				</div>
			</div>
			<div className='w-full'>
				<Button className='w-full bg-green-800' variant='default'>
					<Download color='white' />
					<span>Lưu hóa đơn</span>
				</Button>
			</div>
		</div>
	);
}

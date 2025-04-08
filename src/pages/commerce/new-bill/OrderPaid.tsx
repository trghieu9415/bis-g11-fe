import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download } from 'lucide-react';
import { SelectedProduct } from '@/types/product';

type Props = {
	products: SelectedProduct[];
	onSubmit: () => void;
	loading?: boolean;
	employeeName?: string;
	purchaseDate?: string;
};

export default function OrderPaid({ products, onSubmit, loading }: Props) {
	const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
	const totalPrice = products.reduce((sum, p) => sum + p.quantity * p.price, 0);

	return (
		<div className='flex flex-col w-full h-full shadow-md rounded-md p-3 bg-white'>
			<div className='pb-3 text-lg uppercase font-bold'>Thông tin hóa đơn</div>

			<div className='h-full flex flex-col gap-y-3'>
				<div className='w-full'>
					<div className='w-full border-b text-md uppercase'>Sản phẩm</div>
					<div className='flex flex-col h-full gap-y-3 py-2'>
						<div className='grid grid-cols-2 items-end'>
							<span className='text-sm'>Tổng số lượng</span>
							<span className='text-sm border-b text-right'>{totalQuantity}</span>
						</div>
						<div className='grid grid-cols-2 items-end'>
							<span className='text-sm'>Tổng tiền</span>
							<span className='text-sm border-b text-right'>{totalPrice.toLocaleString()} đ</span>
						</div>
					</div>
				</div>

				<div className='w-full'>
					<div className='w-full border-b text-md uppercase'>Chi tiết</div>
					<div className='flex flex-col h-full gap-y-3 py-2'>
						<div className='grid grid-cols-2 items-end'>
							<span className='text-sm'>Ngày mua</span>
							<span className='text-sm border-b text-right'>{new Date().toLocaleDateString()}</span>
						</div>
						<div className='grid grid-cols-2 items-end'>
							<span className='text-sm'>Nhân viên lập</span>
							<span className='text-sm border-b text-right'>Lê Quang Liêm</span>
						</div>
					</div>
				</div>

				<div className='w-full'>
					<div className='w-full border-b text-md uppercase'>Thanh toán</div>
					<div className='flex flex-col h-full gap-y-3 py-2'>
						<div className='grid grid-cols-2 items-end'>
							<span className='text-sm'>Khách trả</span>
							<Input
								className='text-sm border-b rounded-none h-7 text-right'
								value={totalPrice.toLocaleString()}
								readOnly
							/>
						</div>
					</div>
				</div>
			</div>

			<div className='w-full mt-4'>
				<Button
					className='w-full bg-green-800'
					variant='default'
					onClick={onSubmit}
					disabled={products.length === 0 || loading}
				>
					<Download color='white' className='mr-2' />
					<span>{loading ? 'Đang lưu...' : 'Lưu hóa đơn'}</span>
				</Button>
			</div>
		</div>
	);
}

import { createBill } from '@/services/billService';
import { Customer } from '@/types/customer';
import { SelectedProduct } from '@/types/product';
import { useState } from 'react';

import { toast } from 'react-toastify';
import OrderProduct from './new-bill/OrderProduct';
import OrderCustomer from './new-bill/OrderCustomer';
import OrderPaid from './new-bill/OrderPaid';
import { useAppSelector } from '@/redux/store';

export default function NewBill() {
	const [products, setProducts] = useState<SelectedProduct[]>([]);
	const [customer, setCustomer] = useState<Customer | null>(null);
	const [loading, setLoading] = useState(false);
	const { profile } = useAppSelector(state => state.profile);
	const userId = profile ? profile?.id : null;

	const handleSubmitOrder = async () => {
		if (!customer) {
			toast.warning('Vui lòng chọn khách hàng trước khi lưu hóa đơn!');
			return;
		}
		
		if (!userId) {
			toast.warning('Không tìm thấy userId, vui lòng đăng nhập lại!');
			return;
		}

		const payload = {
			userId,
			customerId: customer.id,
			address: customer.address || 'Không có địa chỉ',
			billDetails: products.map(product => ({
				productId: product.id,
				quantity: product.quantity,
				price: product.price
			}))
		};

		console.log('📦 Payload:', payload);

		try {
			setLoading(true);
			const response = await createBill(payload);
			console.log(' Hóa đơn tạo thành công:', response.data);
			toast.success('Tạo hóa đơn thành công!');
			setProducts([]);
			setCustomer(null);
		} catch (error) {
			console.error(' Lỗi tạo hóa đơn:', error);
			alert('Có lỗi xảy ra khi tạo hóa đơn!');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex w-full gap-5 p-2'>
			<div className='flex flex-grow flex-col gap-2'>
				<div className='flex w-full'>
					<OrderProduct products={products} setProducts={setProducts} />
				</div>
				<div className='flex'>
					<OrderCustomer onCustomerChange={setCustomer} />
				</div>
			</div>
			<div className='flex w-[350px]'>
				<OrderPaid products={products} onSubmit={handleSubmitOrder} loading={loading} />
			</div>
		</div>
	);
}

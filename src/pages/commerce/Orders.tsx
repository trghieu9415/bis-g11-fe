import OrderCustomer from './new-order/order-customer';
import OrderPaid from './new-order/order-paid';
import OrderProduct from './new-order/order-product';

export default function Orders() {
	return (
		<div className='flex w-full p-2 gap-5'>
			<div className='flex flex-col gap-2 flex-grow'>
				<div className='flex w-full'>
					<OrderProduct />
				</div>
				<div className='flex'>
					<OrderCustomer />
				</div>
			</div>
			<div className='flex w-[350px]'>
				<OrderPaid />
			</div>
		</div>
	);
}

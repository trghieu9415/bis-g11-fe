import { useEffect, useState } from 'react';
import { getListCustomers } from '@/services/customerService';
import { Customer } from '@/types/customer';
import CreateCustomerForm from '../customers/CreateCustomerForm';
import { SelectCustomer } from './SelectCustomer';
import CustomerZone from './CustomerZone';

type Props = {
	onCustomerChange: (customer: Customer | null) => void;
};

export default function OrderCustomer({ onCustomerChange }: Props) {
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
	const [refreshKey, setRefreshKey] = useState(0);
	const fetchCustomers = async () => {
		await getListCustomers();
		setRefreshKey(prev => prev + 1);
	};

	useEffect(() => {
		fetchCustomers();
	}, []);

	const handleCustomerChange = (customer: Customer | null) => {
		setSelectedCustomer(customer);
		onCustomerChange(customer);
	};

	return (
		<div className='flex flex-col w-full p-3 rounded-md border shadow-md'>
			<div className='flex flex-col gap-2'>
				<div className='flex justify-between items-center'>
					<span>Thông tin người mua</span>
					<div className='flex gap-2'>
						<CreateCustomerForm fetchCustomers={fetchCustomers} />
						<SelectCustomer onChange={handleCustomerChange} refreshKey={ refreshKey} />
					</div>
				</div>
				<CustomerZone customer={selectedCustomer} />
			</div>
		</div>
	);
}

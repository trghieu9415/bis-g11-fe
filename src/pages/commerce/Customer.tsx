import CreateCustomerForm from './customers/CreateCustomerForm';
import CustomerTable from './customers/CustomerTable';
import { useState, useEffect } from 'react';
import { getListCustomers } from '@/services/customerService';

const Customer = () => {
	const [customers, setCustomers] = useState([]);

	const fetchCustomers = async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const response: any = await getListCustomers();
		setCustomers(response.data);
	};

	useEffect(() => {
		fetchCustomers();
	}, []);

	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách khách hàng</h1>
			<CreateCustomerForm fetchCustomers={fetchCustomers} />
			<div className='mb-2'>
				<CustomerTable customers={customers} fetchCustomers={fetchCustomers} />
			</div>
		</div>
	);
};

export default Customer;

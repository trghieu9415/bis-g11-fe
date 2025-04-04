import CreateCustomerForm from './customers/CreateCustomerForm';
import CustomerTable from './customers/CustomerTable';

const Customer = () => {
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách khách hàng</h1>
			<CreateCustomerForm />
			<div className='mb-2'>
				<CustomerTable />
			</div>
		</div>
	);
};

export default Customer;

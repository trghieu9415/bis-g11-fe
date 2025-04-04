import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const CreateCustomerForm = () => {
	const openDialog = () => {};

	return (
		<div className='text-end mb-4'>
			<Button className='bg-green-800 hover:bg-green-900' onClick={openDialog}>
				<Plus />
				Thêm
			</Button>
		</div>
	);
};

export default CreateCustomerForm;

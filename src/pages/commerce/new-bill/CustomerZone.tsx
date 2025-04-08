import { Input } from '@/components/ui/input';
import { Customer } from '@/types/customer';
import { IdCard, KeyRound, Mail, Map, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
	customer: Customer | null;
};

export default function CustomerZone({ customer }: Props) {
	const [customerValue, setCustomerValue] = useState<Customer>({
		id: 0,
		idString: '',
		name: '',
		address: '',
		email: '',
		phoneNumber: '',
		status: 0,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	});

	useEffect(() => {
		if (customer) {
			setCustomerValue(customer);
		}
	}, [customer]);

	const handleChange = <K extends keyof Customer>(field: K, value: Customer[K]) => {
		setCustomerValue(prev => ({
			...prev,
			[field]: value
		}));
	};

	return (
		<div className='flex flex-col w-full gap-5 p-4 border-t border-[#d1d1d1] bg-white rounded-md'>
			<div className='grid grid-cols-12 gap-4'>
				<div className='col-span-3 flex flex-col gap-1'>
					<span className='text-sm font-medium flex items-center gap-1'>
						<KeyRound size={18} />
						ID khách hàng
					</span>
					<Input readOnly value={customerValue.idString} onChange={e => handleChange('idString', e.target.value)} />
				</div>
				<div className='col-span-9 flex flex-col gap-1'>
					<span className='text-sm font-medium flex items-center gap-1'>
						<IdCard size={18} />
						Họ và tên
					</span>
					<Input readOnly value={customerValue.name} onChange={e => handleChange('name', e.target.value)} />
				</div>
			</div>

			<div className='flex flex-col gap-1'>
				<span className='text-sm font-medium flex items-center gap-1'>
					<Map size={18} />
					Địa chỉ
				</span>
				<Input readOnly value={customerValue.address} onChange={e => handleChange('address', e.target.value)} />
			</div>

			<div className='grid grid-cols-2 gap-4'>
				<div className='flex flex-col gap-1'>
					<span className='text-sm font-medium flex items-center gap-1'>
						<Mail size={18} />
						Email liên lạc
					</span>
					<Input readOnly value={customerValue.email} onChange={e => handleChange('email', e.target.value)} />
				</div>
				<div className='flex flex-col gap-1'>
					<span className='text-sm font-medium flex items-center gap-1'>
						<Phone size={18} />
						Số điện thoại
					</span>
					<Input
						readOnly
						value={customerValue.phoneNumber}
						onChange={e => handleChange('phoneNumber', e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
}

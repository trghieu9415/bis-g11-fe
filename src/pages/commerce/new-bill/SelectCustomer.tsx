import { Check, ChevronsUpDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Customer } from '@/types/customer';
import { useEffect, useState } from 'react';
import { getListCustomers } from '@/services/customerService';

type SelectCustomerProps = {
	onChange: (customer: Customer) => void;
};
export function SelectCustomer({ onChange }: SelectCustomerProps) {
	const [open, setOpen] = useState(false);

	const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
	const [customers, setCustomers] = useState<Customer[]>([]);

	useEffect(() => {
		const fetchCustomer = async () => {
			const res = await getListCustomers();
			if (res) {
				setCustomers(res.data);
			}
		};
		fetchCustomer();
	}, []);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild className='flex-grow w-[300px]'>
				<div className='flex'>
					<div className='w-10 h-10 flex justify-center items-center bg-[#626262]'>
						<User color='white' />
					</div>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className='justify-between rounded-none flex-grow'
					>
						{selectedCustomer ? selectedCustomer.name : 'Chọn khách hàng...'}
						<ChevronsUpDown className='opacity-50' />
					</Button>
				</div>
			</PopoverTrigger>
			<PopoverContent className='p-0 w-[300px]' align='end' side='top'>
				<Command>
					<CommandInput placeholder='Tìm kiếm khách hàng...' />
					<CommandList>
						<CommandEmpty>Không tìm thấy khách hàng</CommandEmpty>
						<CommandGroup>
							{customers.map(customer => (
								<CommandItem
									key={customer.id}
									value={customer.name}
									onSelect={() => {
										setSelectedCustomer(customer);
										onChange(customer);
										setOpen(false);
									}}
								>
									{customer.name}
									<Check
										className={cn('ml-auto', selectedCustomer?.id === customer.id ? 'opacity-100' : 'opacity-0')}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

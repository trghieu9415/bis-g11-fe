'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, User } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const frameworks = [
	{
		value: 'next.js',
		label: 'Next.js'
	},
	{
		value: 'sveltekit',
		label: 'SvelteKit'
	},
	{
		value: 'nuxt.js',
		label: 'Nuxt.js'
	},
	{
		value: 'remix',
		label: 'Remix'
	},
	{
		value: 'astro',
		label: 'Astro'
	}
];

export function SelectCustomer() {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState('');

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
						{value ? frameworks.find(framework => framework.value === value)?.label : 'Chọn khách hàng...'}
						<ChevronsUpDown className='opacity-50' />
					</Button>
				</div>
			</PopoverTrigger>
			<PopoverContent className='p-0 w-[300px]' align='end' side='top'>
				<Command>
					<CommandInput placeholder='Tìm kiếm khách hàng...' />
					<CommandList>
						<CommandEmpty>No framework found.</CommandEmpty>
						<CommandGroup>
							{frameworks.map(framework => (
								<CommandItem
									key={framework.value}
									value={framework.value}
									onSelect={currentValue => {
										setValue(currentValue === value ? '' : currentValue);
										setOpen(false);
									}}
								>
									{framework.label}
									<Check className={cn('ml-auto', value === framework.value ? 'opacity-100' : 'opacity-0')} />
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

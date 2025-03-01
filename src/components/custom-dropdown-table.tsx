import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Table as ReactTable } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';

export function CustomDropdownTable<DType>({ table }: { table: ReactTable<DType> }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='ml-auto'>
					Hiển thị <ChevronDown />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='bg-white' align='end'>
				{table
					.getAllColumns()
					.filter(column => column.getCanHide())
					.map(column => {
						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className='uppercase'
								checked={column.getIsVisible()}
								onCheckedChange={value => column.toggleVisibility(!!value)}
							>
								{column.id}
							</DropdownMenuCheckboxItem>
						);
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

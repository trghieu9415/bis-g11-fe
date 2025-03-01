import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function Zxc() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline'>Open</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuLabel>Appearance</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuCheckboxItem>Status Bar</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem>Activity Bar</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem>Panel</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

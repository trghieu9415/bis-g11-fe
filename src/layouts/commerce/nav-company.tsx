import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';

export function NavCompany() {
	const { state } = useSidebar();

	const data = {
		name: 'Công ty Inverse',
		logo: '/logo/square.png',
		plan: 'Enterprise'
	};

	return (
		<SidebarMenuButton
			size='lg'
			className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
		>
			<img src={data.logo} className={`aspect-square ${state === 'expanded' ? 'size-16' : 'size-8'}`} />
			<div className='grid flex-1 text-left text-sm leading-tight'>
				<span className='truncate font-semibold'>{data.name}</span>
				<span className='truncate text-xs'>{data.plan}</span>
			</div>
		</SidebarMenuButton>
	);
}

import * as React from 'react';
import { NavPolicies } from './nav-policy';
import { NavUser } from './nav-user';
import { NavCompany } from './nav-company';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

const data = {
	user: {
		name: 'Quản trị viên',
		email: 'admin@company.com',
		avatar: '/avatars/black_cat.jpg'
	}
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader className='shadow-sm'>
				<NavCompany />
			</SidebarHeader>
			<SidebarContent className='no-scrollbar shadow-sm'>
				<NavPolicies />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

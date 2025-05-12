import { useState, useEffect } from 'react';
import { NavMain } from './nav-main';
import { NavPolicies } from './nav-policy';
import { NavUser } from './nav-user';
import { NavCompany } from './nav-company';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { useAppSelector } from '@/redux/store';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { profile } = useAppSelector(state => state.profile);

	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader className='shadow-sm'>
				<NavCompany />
			</SidebarHeader>
			<SidebarContent className='no-scrollbar shadow-sm'>
				<NavMain />
				<NavPolicies />
			</SidebarContent>
			<SidebarFooter>{<NavUser user={profile} />}</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

import { Moon, BriefcaseBusiness, Map, Clock3 } from 'lucide-react';

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/components/ui/sidebar';

export function NavPolicies() {
	const policies = [
		{
			name: 'Cơ cấu lương',
			url: '#',
			icon: Map
		},
		{
			name: 'Quy định nghỉ lễ',
			url: '#',
			icon: Moon
		},
		{
			name: 'Chính sách nghỉ phép',
			url: '#',
			icon: Clock3
		},
		{
			name: 'Vị trí công việc',
			url: '#',
			icon: BriefcaseBusiness
		}
	];

	return (
		<SidebarGroup className='group-data-[collapsible=icon]:hidden'>
			<SidebarGroupLabel>Chính sách công ty</SidebarGroupLabel>
			<SidebarMenu>
				{policies.map(item => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton asChild>
							<a href={item.url}>
								{item.icon && <item.icon />}
								<span>{item.name}</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

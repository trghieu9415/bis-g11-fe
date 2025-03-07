'use client';
import { ChevronRight, CalendarDays, UsersRound, Hourglass } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

export function NavMain() {
	const data = [
		{
			title: 'Nhân viên',
			url: '#',
			icon: UsersRound,
			isActive: true,
			items: [
				{
					title: 'Danh sách nhân sự',
					url: '/hremployee'
				},
				{
					title: 'Hợp đồng lao động',
					url: '/employee'
				},
				{
					title: 'Vi phạm',
					url: '#'
				},
				{
					title: 'Báo cáo nhân sự',
					url: '#'
				}
			]
		},
		{
			title: 'Đơn nghỉ phép',
			url: '#',
			icon: Hourglass,
			isActive: true,
			items: [
				{
					title: 'Nghỉ phép',
					url: '#',
					total: 1
				},
				{
					title: 'Nghỉ thai sản',
					url: '#',
					total: 0
				},
				{
					title: 'Nghỉ ốm',
					url: '#',
					total: 2
				},
				{
					title: 'Tất cả đơn',
					url: '#'
				}
			]
		},
		{
			title: 'Chấm công',
			url: '#',
			icon: CalendarDays,
			isActive: true,
			items: [
				{
					title: 'Hôm nay',
					url: '#'
				},
				{
					title: 'Tháng này',
					url: '#'
				}
			]
		}
	];

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Quản lý nhân sự</SidebarGroupLabel>
			<SidebarMenu>
				{data.map(item => (
					<Collapsible key={item.title} asChild defaultOpen={item.isActive} className='group/collapsible'>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip={item.title}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
									<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									{item.items?.map(subItem => (
										<SidebarMenuSubItem key={subItem.title}>
											<SidebarMenuSubButton asChild>
												<NavLink to={subItem.url} className='flex justify-between'>
													<span>{subItem.title}</span>
													{subItem.total ? (
														<Badge className='w-1 flex justify-center bg-red-800'>{subItem.total}</Badge>
													) : null}
												</NavLink>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

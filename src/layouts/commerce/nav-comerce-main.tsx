'use client';
import { CalendarDays, ChevronRight, Hourglass, UsersRound, PartyPopper, BadgeDollarSign, UserCog } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
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

import { fetchAllLeaveRequests } from '@/redux/slices/leaveRequestsSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { ElementType, useEffect } from 'react';
import { useSelector } from 'react-redux';

export function NavMain() {
	const dispatch = useAppDispatch();
	const { leaveRequests } = useSelector((state: RootState) => state.leaveRequests);

	useEffect(() => {
		if (leaveRequests?.length == 0) {
			dispatch(fetchAllLeaveRequests());
		}
	}, [dispatch]);

	const leaveStats = {
		sick: leaveRequests.filter(req => req.leaveReason === 0 && req.status === 2).length,
		leave: leaveRequests.filter(req => req.leaveReason === 1 && req.status === 2).length,
		maternity: leaveRequests.filter(req => req.leaveReason === 2 && req.status === 2).length,
		all: leaveRequests.filter(req => req.status === 2).length
	};

	const data: {
		title: string;
		url: string;
		icon?: ElementType;
		isActive: boolean;
		total?: number;
		items: { title: string; url: string; total?: number }[];
	}[] = [
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
					url: '/contracts'
				}
				// {
				// 	title: 'Vi phạm',
				// 	url: '#'
				// },
				// {
				// 	title: 'Báo cáo nhân sự',
				// 	url: '#'
				// }
			]
		},
		{
			title: 'Đơn nghỉ phép',
			url: '/leave-requests',
			icon: Hourglass,
			isActive: true,
			total: leaveStats.all,
			items: [
				// {
				// 	title: 'Nghỉ phép',
				// 	url: '/leave-requests/paid',
				// 	total: leaveStats.leave
				// },
				// {
				// 	title: 'Nghỉ thai sản',
				// 	url: '/leave-requests/maternity',
				// 	total: leaveStats.maternity
				// },
				// {
				// 	title: 'Nghỉ bệnh',
				// 	url: '/leave-requests/sick',
				// 	total: leaveStats.sick
				// },
				// {
				// 	title: 'Tất cả đơn',
				// 	url: '/leave-requests',
				// 	total: leaveStats.all
				// }
			]
		},
		{
			title: 'Chấm công',
			url: '/time-tracking/today',
			icon: CalendarDays,
			isActive: true,
			items: [
				// {
				// 	title: 'Theo ngày',
				// 	url: '/time-tracking/today'
				// }
				// {
				// 	title: 'Theo tháng',
				// 	url: '/time-tracking/month'
				// }
			]
		},
		{
			title: 'Bảng lương',
			url: '#',
			icon: BadgeDollarSign,
			isActive: true,
			items: [
				{
					title: 'Theo tháng',
					url: '/salary/month'
				},
				{
					title: 'Theo năm',
					url: '/salary/year'
				}
			]
		},
		{
			title: 'Chức vụ & Cấp bậc',
			url: '/roles',
			icon: UserCog,
			isActive: true,
			items: []
		},
		{
			title: 'Lịch nghỉ lễ',
			url: '/holiday',
			icon: PartyPopper,
			isActive: true,
			items: []
		}
	];

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Quản lý nhân sự</SidebarGroupLabel>
			<SidebarMenu>
				{data.map(item =>
					item.items?.length > 0 ? (
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
										{item.items.map(subItem => (
											<SidebarMenuSubItem key={subItem.title}>
												<SidebarMenuSubButton asChild>
													<NavLink to={subItem.url} className='flex justify-between'>
														<span>{subItem.title}</span>
														{/* {subItem?.total && (
															<Badge className='w-1 flex justify-center bg-red-800'>{subItem.total}</Badge>
														)} */}
													</NavLink>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					) : (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton tooltip={item.title} asChild>
								<div className='flex items-center justify-between'>
									<NavLink to={item.url} className='flex  items-center gap-2 w-full'>
										{item.icon && <item.icon size={16} />}
										<span>{item.title}</span>
									</NavLink>
									{typeof item.total === 'number' && item.total > 0 && (
										<Badge className='w-1 flex justify-center bg-red-800'>{item.total}</Badge>
									)}
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
					)
				)}
			</SidebarMenu>
		</SidebarGroup>
	);
}

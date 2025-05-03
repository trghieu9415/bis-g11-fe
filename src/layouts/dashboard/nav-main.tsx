'use client';
import { useState } from 'react';
import {
	CalendarDays,
	ChevronRight,
	Hourglass,
	UsersRound,
	PartyPopper,
	BadgeDollarSign,
	UserCog,
	ClipboardPlus,
	ShoppingCart,
	Users,
	BookCopy,
	Library,
	BookUser,
	PackagePlus,
	ChartLine
} from 'lucide-react';
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

type ResContractDTO = {
	baseSalary: number;
	endDate: string;
	expiryDate: string;
	fullName: string;
	id: number;
	idString: string;
	levelName: string;
	roleName: string;
	salaryCoefficient: number;
	seniorityId: number;
	startDate: string;
	status: number;
	userId: number;
};

type UserInfo = {
	id: number;
	idString: string;
	fullName: string;
	email: string;
	phoneNumber: string;
	gender: 'MALE' | 'FEMALE' | string;
	dateOfBirth: string;
	address: string;
	username: string;
	createdAt: string;
	status: number;
	resContractDTO?: ResContractDTO;
};

interface MenuItem {
	title: string;
	url: string;
	icon?: ElementType;
	isActive: boolean;
	total?: number;
	items: { title: string; url: string; total?: number }[];
}

export function NavMain() {
	const dispatch = useAppDispatch();
	const { leaveRequests } = useSelector((state: RootState) => state.leaveRequests);
	const { isHideSidebar } = useSelector((state: RootState) => state.isHideSidebar);

	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	useEffect(() => {
		const profile = localStorage.getItem('profile');
		if (profile) {
			setUserInfo(JSON.parse(profile));
		}

		if (leaveRequests?.length == 0) {
			dispatch(fetchAllLeaveRequests());
		}
	}, [dispatch]);

	console.log(userInfo);

	const leaveStats = {
		sick: Array.isArray(leaveRequests)
			? leaveRequests.filter(req => req.leaveReason === 0 && req.status === 2).length
			: 0,
		leave: Array.isArray(leaveRequests)
			? leaveRequests.filter(req => req.leaveReason === 1 && req.status === 2).length
			: 0,
		maternity: Array.isArray(leaveRequests)
			? leaveRequests.filter(req => req.leaveReason === 2 && req.status === 2).length
			: 0,
		all: Array.isArray(leaveRequests) ? leaveRequests.filter(req => req.status === 2).length : 0
	};

	const hremployee = [
		{
			title: 'Nhân viên',
			url: '#',
			icon: UsersRound,
			isActive: true,
			items: [
				{
					title: 'Danh sách nhân sự',
					url: '/hr/hremployee'
				},
				{
					title: 'Hợp đồng lao động',
					url: '/hr/contracts'
				}
			]
		},
		{
			title: 'Đơn nghỉ phép',
			url: '/hr/leave-requests',
			icon: Hourglass,
			isActive: true,
			total: leaveStats.all,
			items: []
		},
		{
			title: 'Chấm công',
			url: '/hr/time-tracking/today',
			icon: CalendarDays,
			isActive: true,
			items: []
		},
		{
			title: 'Bảng lương',
			url: '#',
			icon: BadgeDollarSign,
			isActive: true,
			items: [
				{
					title: 'Theo tháng',
					url: '/hr/salary/month'
				},
				{
					title: 'Theo năm',
					url: '/hr/salary/year'
				}
			]
		},
		{
			title: 'Chức vụ & Cấp bậc',
			url: '/hr/roles',
			icon: UserCog,
			isActive: true,
			items: []
		},
		{
			title: 'Lịch nghỉ lễ',
			url: '/hr/holiday',
			icon: PartyPopper,
			isActive: true,
			items: []
		}
	];

	const warehouse_manager = [
		{
			title: 'Sản phẩm',
			url: '/warehouse/products',
			icon: BookCopy,
			isActive: true,
			items: []
		},
		{
			title: 'Nhà cung cấp',
			url: '/warehouse/suppliers',
			icon: Library,
			isActive: true,
			items: []
		},
		{
			title: 'Tác giả',
			url: '/warehouse/author',
			icon: BookUser,
			isActive: true,
			items: []
		},
		{
			title: 'Danh mục',
			url: '/warehouse/category',
			icon: BookUser,
			isActive: true,
			items: []
		},
		{
			title: 'Nhập sách',
			url: '/warehouse/inventory',
			icon: PackagePlus,
			isActive: true,
			items: []
		}
	];

	const business_manager = [
		{
			title: 'Đơn hàng mới',
			url: '/business/new-order',
			icon: ClipboardPlus,
			isActive: true,
			items: []
		},
		{
			title: 'Danh sách đơn',
			url: '/business/orders',
			icon: ShoppingCart,
			isActive: true,
			items: []
		},
		{
			title: 'Khách hàng',
			url: '/business/customers',
			icon: Users,
			isActive: true,
			items: []
		},
		{
			title: 'Thống kê',
			url: '/business/statistics',
			icon: ChartLine,
			isActive: true,
			items: []
		}
	];

	let trueDataForRenderMenu: MenuItem[] = [];
	let title = '';

	switch (userInfo?.resContractDTO?.roleName) {
		case 'HR_MANAGER':
			trueDataForRenderMenu = hremployee;
			title = 'Quản lý nhân sự';
			break;
		case 'WAREHOUSE_MANAGER':
			trueDataForRenderMenu = warehouse_manager;
			title = 'Quản lý kho';
			break;
		case 'BUSINESS_MANAGER':
			trueDataForRenderMenu = business_manager;
			title = 'Quản lý kinh doanh';
			break;
		case 'ADMIN':
			trueDataForRenderMenu = [...hremployee, ...warehouse_manager, ...business_manager];
			title = 'Quản lý hệ thống';
			break;
		default:
			trueDataForRenderMenu = [];
			break;
	}

	const data: MenuItem[] = trueDataForRenderMenu;

	console.log(data);

	return (
		<>
			{data?.length > 0 && (
				<SidebarGroup>
					<SidebarGroupLabel>{title}</SidebarGroupLabel>
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
															{/* {subItem?.total && (
															<Badge className='w-1 flex justify-center bg-red-800'>{subItem.total}</Badge>
														)} */}
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
											<NavLink to={item.url} className={`flex w-full items-center gap-2`}>
												{item.icon && <item.icon size={16} />}
												<span className={`${isHideSidebar && 'hidden'}`}>{item.title}</span>
											</NavLink>
											{typeof item.total === 'number' && item.total > 0 && (
												<Badge className='flex w-1 justify-center bg-red-800'>{item.total}</Badge>
											)}
										</div>
									</SidebarMenuButton>
								</SidebarMenuItem>
							)
						)}
					</SidebarMenu>
				</SidebarGroup>
			)}
		</>
	);
}

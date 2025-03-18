import { ShoppingCart, Users, PackagePlus, ChartLine, Library, BookCopy, ClipboardPlus } from 'lucide-react';

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavLink } from 'react-router-dom';

export function NavPolicies() {
	const items = [
		{
			name: 'Đơn hàng mới',
			url: '/new-order',
			icon: ClipboardPlus,
			isActivated: true
		},
		{
			name: 'Danh sách đơn',
			url: '/orders',
			icon: ShoppingCart,
			isActivated: false
		},
		{
			name: 'Khách hàng',
			url: '/customers',
			icon: Users,
			isActivated: false
		},
		{
			name: 'Sản phẩm',
			url: '/products',
			icon: BookCopy,
			isActivated: false
		},
		{
			name: 'Nhà cung cấp',
			url: '/suppliers',
			icon: Library,
			isActivated: false
		},
		{
			name: 'Nhập sách',
			url: '/receipts',
			icon: PackagePlus,
			isActivated: false
		},
		{
			name: 'Thống kê',
			url: '/statistics',
			icon: ChartLine,
			isActivated: false
		}
	];

	return (
		<SidebarGroup className='group-data-[collapsible=icon]:show'>
			<SidebarMenu>
				{items.map(item => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton
							asChild
							className={`py-5 ${item.isActivated ? '!bg-[#37373d] !text-white' : ''}`}
							disabled={item.isActivated}
						>
							<NavLink to={item.url}>
								{item.icon && <item.icon />}
								<span>{item.name}</span>
							</NavLink>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

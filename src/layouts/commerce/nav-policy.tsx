import { ShoppingCart, Users, PackagePlus, ChartLine, Library, BookCopy, ClipboardPlus } from 'lucide-react';
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavLink, useLocation } from 'react-router-dom';

export function NavPolicies() {
	const location = useLocation(); // Lấy URL hiện tại

	const items = [
		{ name: 'Đơn hàng mới', url: '/new-order', icon: ClipboardPlus },
		{ name: 'Danh sách đơn', url: '/orders', icon: ShoppingCart },
		{ name: 'Khách hàng', url: '/customers', icon: Users },
		{ name: 'Sản phẩm', url: '/products', icon: BookCopy },
		{ name: 'Nhà cung cấp', url: '/suppliers', icon: Library },
		{ name: 'Nhập sách', url: '/receipts', icon: PackagePlus },
		{ name: 'Thống kê', url: '/statistics', icon: ChartLine }
	];

	return (
		<SidebarGroup className='group-data-[collapsible=icon]:show'>
			<SidebarMenu>
				{items.map(item => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton
							asChild
							className={`py-5 ${location.pathname === item.url ? '!bg-[#37373d] !text-white' : ''}`}
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

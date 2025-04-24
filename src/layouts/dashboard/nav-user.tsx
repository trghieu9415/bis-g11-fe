'use client';
import { useNavigate } from 'react-router-dom';
import { ChevronsUpDown, LogOut, ShieldQuestion, SquareUser } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';

import EmployeeTimeTracking from '@/pages/dashboard/Employee/EmployeeTimeTracking/employee-time-tracking';
import EmployeeLeaveRequest from '@/pages/dashboard/Employee/employee-leave-request';
import EmployeeSalaryCal from '@/pages/dashboard/Employee/employee-payroll';
import { NavLink } from 'react-router-dom';

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

export function NavUser({ user }: { user: UserInfo }) {
	const navigate = useNavigate();
	const { isMobile } = useSidebar();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size='lg'
							className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
						>
							<Avatar className='h-8 w-8 rounded-lg'>
								<AvatarImage src={`./avatars/black_cat.jpg`} alt={user.fullName} />
								<AvatarFallback className='rounded-lg'>CN</AvatarFallback>
							</Avatar>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-semibold'>{user.fullName}</span>
								<span className='truncate text-xs'>{user.email}</span>
							</div>
							<ChevronsUpDown className='ml-auto size-4' />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
						side={isMobile ? 'bottom' : 'right'}
						align='end'
						sideOffset={4}
					>
						<DropdownMenuLabel className='p-0 font-normal'>
							<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
								<Avatar className='h-8 w-8 rounded-lg'>
									<AvatarImage src={`./avatars/black_cat.jpg`} alt={user.fullName} />
									<AvatarFallback className='rounded-lg'>CN</AvatarFallback>
								</Avatar>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-semibold'>{user.fullName}</span>
									<span className='truncate text-xs'>{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<NavLink to={`/user`}>
								<DropdownMenuItem className='hover:cursor-pointer hover:bg-gray-100'>
									<SquareUser />
									Thông tin cá nhân
								</DropdownMenuItem>
							</NavLink>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<EmployeeTimeTracking />
							<EmployeeLeaveRequest />
							<EmployeeSalaryCal />
							{/* <DropdownMenuItem>
								<ShieldQuestion />
								Quyền lợi nhân viên
							</DropdownMenuItem> */}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className='hover:cursor-pointer hover:bg-gray-100'
							onClick={() => {
								localStorage.removeItem('accessToken');
								localStorage.removeItem('profile');
								localStorage.removeItem('refreshToken');
								navigate('/login');
							}}
						>
							<LogOut />
							Đăng xuất
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

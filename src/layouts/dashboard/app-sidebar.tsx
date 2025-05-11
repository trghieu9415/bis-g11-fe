import { useState, useEffect } from 'react';
import { NavMain } from './nav-main';
import { NavPolicies } from './nav-policy';
import { NavUser } from './nav-user';
import { NavCompany } from './nav-company';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { useAppSelector } from '@/redux/store';

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
			<SidebarFooter>{profile && <NavUser user={profile} />}</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

import { useState, useEffect } from 'react';
import { NavMain } from './nav-main';
import { NavPolicies } from './nav-policy';
import { NavUser } from './nav-user';
import { NavCompany } from './nav-company';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

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
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	useEffect(() => {
		const profile = localStorage.getItem('profile');
		if (profile) {
			setUserInfo(JSON.parse(profile));
		}
	}, []);

	// const data = {
	// 	user: {
	// 		id: userInfo?.id,
	// 		name: userInfo?.resContractDTO?.roleName,
	// 		email: userInfo?.email,
	// 		avatar: './avatars/black_cat.jpg'
	// 	},
	// 	team: {
	// 		name: 'Công ty INKVERSE',
	// 		logo: './logo/square.png',
	// 		plan: 'Enterprise'
	// 	}
	// };

	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader className='shadow-sm'>
				<NavCompany />
			</SidebarHeader>
			<SidebarContent className='no-scrollbar shadow-sm'>
				<NavMain />
				<NavPolicies />
			</SidebarContent>
			<SidebarFooter>{userInfo && <NavUser user={userInfo} />}</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

import { useState, useEffect } from 'react';

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import UserInformationDetail from '@/pages/dashboard/UserInformation/user-information-detail';
import UserInformationContractsHistory from './UserInformation/user-information-contracts-history';
import UserInformationLeaveRequestsHistory from './UserInformation/user-information-leave-requests-history';

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

export default function UserInformation() {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	useEffect(() => {
		const profile = localStorage.getItem('profile');
		if (profile) {
			setUserInfo(JSON.parse(profile));
		}
	}, []);

	return (
		userInfo && (
			<div className='mb-2 flex max-h-[calc(100vh-60px)] w-full items-start justify-between gap-4'>
				{/* Thông tin User */}
				<UserInformationDetail userInfo={userInfo} />

				{/* Khung chứa lịch sử */}
				<div className='flex h-full flex-1 flex-col gap-4'>
					<PanelGroup direction='vertical' className='h-full w-full rounded-sm'>
						{/* Panel Contract */}
						<Panel defaultSize={50} minSize={20} maxSize={80} className='overflow-auto'>
							<UserInformationContractsHistory userInfo={userInfo} />
						</Panel>

						{/* Scroll */}
						<PanelResizeHandle className='h-2 cursor-ns-resize' />

						{/* Panel Leave Request */}
						<Panel defaultSize={50} minSize={20} maxSize={80} className='overflow-auto'>
							<UserInformationLeaveRequestsHistory userInfo={userInfo} />
						</Panel>
					</PanelGroup>
				</div>
			</div>
		)
	);
}

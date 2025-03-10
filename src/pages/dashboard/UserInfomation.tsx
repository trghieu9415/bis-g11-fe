import UserInfomationDetail from '@/pages/dashboard/UserInfomation/userinfomation-detail';
import UserInfomationContractsHistory from './UserInfomation/userinfomation-contracts-history';
import UserInfomationLeaveRequestsHistory from './UserInfomation/userinfomation-leave-requests-history';

export default function UserInfomation() {
	return (
		<div className='flex items-start justify-between w-full max-h-[calc(100vh-60px)] mb-2 gap-4'>
			<UserInfomationDetail />

			<div className='flex flex-col items-center justify-between flex-1 gap-4 h-full'>
				<div className='flex flex-col gap-4 w-full h-full'>
					<UserInfomationContractsHistory />
					<UserInfomationLeaveRequestsHistory />
				</div>
			</div>
		</div>
	);
}

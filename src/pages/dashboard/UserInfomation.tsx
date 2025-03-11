import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import UserInfomationDetail from '@/pages/dashboard/UserInfomation/userinfomation-detail';
import UserInfomationContractsHistory from './UserInfomation/userinfomation-contracts-history';
import UserInfomationLeaveRequestsHistory from './UserInfomation/userinfomation-leave-requests-history';

export default function UserInfomation() {
	return (
		<div className='flex items-start justify-between w-full max-h-[calc(100vh-60px)] mb-2 gap-4'>
			{/* Thông tin User */}
			<UserInfomationDetail />

			{/* Khung chứa lịch sử */}
			<div className='flex flex-col flex-1 gap-4 h-full'>
				<PanelGroup direction='vertical' className='w-full h-full rounded-sm'>
					{/* Panel Contract */}
					<Panel defaultSize={50} minSize={20} maxSize={80} className='overflow-auto'>
						<UserInfomationContractsHistory />
					</Panel>

					{/* Scroll */}
					<PanelResizeHandle className='h-2 cursor-ns-resize' />

					{/* Panel Leave Request */}
					<Panel defaultSize={50} minSize={20} maxSize={80} className='overflow-auto'>
						<UserInfomationLeaveRequestsHistory />
					</Panel>
				</PanelGroup>
			</div>
		</div>
	);
}

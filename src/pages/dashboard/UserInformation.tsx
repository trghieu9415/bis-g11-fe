import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import UserInformationDetail from '@/pages/dashboard/UserInformation/user-information-detail';
import UserInformationContractsHistory from './UserInformation/user-information-contracts-history';
import UserInformationLeaveRequestsHistory from './UserInformation/user-information-leave-requests-history';

export default function UserInformation() {
	return (
		<div className='flex items-start justify-between w-full max-h-[calc(100vh-60px)] mb-2 gap-4'>
			{/* Thông tin User */}
			<UserInformationDetail />

			{/* Khung chứa lịch sử */}
			<div className='flex flex-col flex-1 gap-4 h-full'>
				<PanelGroup direction='vertical' className='w-full h-full rounded-sm'>
					{/* Panel Contract */}
					<Panel defaultSize={50} minSize={20} maxSize={80} className='overflow-auto'>
						<UserInformationContractsHistory />
					</Panel>

					{/* Scroll */}
					<PanelResizeHandle className='h-2 cursor-ns-resize' />

					{/* Panel Leave Request */}
					<Panel defaultSize={50} minSize={20} maxSize={80} className='overflow-auto'>
						<UserInformationLeaveRequestsHistory />
					</Panel>
				</PanelGroup>
			</div>
		</div>
	);
}

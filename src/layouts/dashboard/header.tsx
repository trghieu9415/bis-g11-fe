import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardBreadcrumb } from './breadcrumb';

import { RootState, useAppDispatch } from '@/redux/store';
import { useSelector } from 'react-redux';
import { postToggleSidebar } from '@/redux/slices/toggleSideBarSlice';

export default function Header() {
	const dispatch = useAppDispatch();
	const { isHideSidebar } = useSelector((state: RootState) => state.isHideSidebar);
	
	const handleHideSideBar = () => {
		dispatch(postToggleSidebar(!isHideSidebar));
	};

	return (
		<div className='pt-3 z-50 bg-white shadow-sm flex justify-between items-center '>
			<div className='flex items-center gap-x-3'>
				<SidebarTrigger onClick={handleHideSideBar} />
				<DashboardBreadcrumb />
			</div>
		</div>
	);
}

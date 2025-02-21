import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardBreadcrumb } from './breadcrumb';

export default function Header() {
	return (
		<div className='pt-3 z-50 bg-white shadow-sm flex justify-between items-center'>
			<div className='flex items-center gap-x-3'>
				<SidebarTrigger />
				<DashboardBreadcrumb />
			</div>
		</div>
	);
}

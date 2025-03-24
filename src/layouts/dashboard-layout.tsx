import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './dashboard/app-sidebar';
import Header from '@/layouts/dashboard/header';

export default function DashboardLayout({ mainContent }: { mainContent: React.ReactNode }) {
	return (
		<SidebarProvider className='max-w-full overflow-hidden bg-[#F2F7FA]'>
			<AppSidebar />
			<main className='flex flex-col mx-3 overflow-hidden flex-grow'>
				<div className='sticky top-0'>
					<Header />
				</div>
				<div className='flex mt-3 overflow-hidden flex-1'>{mainContent}</div>
			</main>
		</SidebarProvider>
	);
}

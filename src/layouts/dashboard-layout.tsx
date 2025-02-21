import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './dashboard/app-sidebar';
import Header from '@/layouts/dashboard/header';

export default function DashboardLayout({
	mainContent,
	hScreen = false
}: {
	mainContent: React.ReactNode;
	hScreen?: boolean;
}) {
	return (
		<SidebarProvider className='scrollbar-hide'>
			<AppSidebar />
			<main className={`flex flex-col mx-3 w-full ${hScreen ? 'h-screen' : ''}`}>
				<div className={`${hScreen ? '' : 'bg-white sticky'}`}>
					<Header />
				</div>
				<div className={`flex mt-3 ${hScreen ? 'flex-1' : ''}`}>{mainContent}</div>
			</main>
		</SidebarProvider>
	);
}

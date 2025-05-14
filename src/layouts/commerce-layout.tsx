import { SidebarProvider } from '@/components/ui/sidebar';
// import { AppSidebar } from './commerce/app-sidebar';
// import Header from '@/layouts/commerce/header';
import { AppSidebar } from './dashboard/app-sidebar';
import Header from '@/layouts/dashboard/header';

export default function CommerceLayout({ mainContent }: { mainContent: React.ReactNode }) {
	return (
		<SidebarProvider className='max-w-full overflow-hidden bg-[#F2F7FA]'>
			<AppSidebar />
			<main className='mx-3 flex flex-grow flex-col overflow-hidden'>
				<div className='sticky top-0'>
					<Header />
				</div>
				<div className='mt-3 flex overflow-hidden'>{mainContent}</div>
			</main>
		</SidebarProvider>
	);
}

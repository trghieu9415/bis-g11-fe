import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './commerce/app-sidebar';
import Header from '@/layouts/commerce/header';

export default function CommerceLayout({ mainContent }: { mainContent: React.ReactNode }) {
	return (
		<SidebarProvider className='max-w-full overflow-hidden'>
			<AppSidebar />
			<main className='flex flex-col mx-3 overflow-hidden flex-grow'>
				<div className='sticky top-0'>
					<Header title='Hóa đơn khách hàng' />
				</div>
				<div className='flex mt-3 overflow-hidden'>{mainContent}</div>
			</main>
		</SidebarProvider>
	);
}

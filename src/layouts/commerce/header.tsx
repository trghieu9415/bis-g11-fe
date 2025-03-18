import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Header({ title }: { title: string }) {
	return (
		<div className='pt-3 z-50 bg-white shadow-sm flex justify-between items-center'>
			<div className='flex items-center gap-x-3'>
				<SidebarTrigger />
				<div className='uppercase text-md'>{title}</div>
			</div>
		</div>
	);
}

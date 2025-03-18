export default function NoneLayout({ mainContent }: { mainContent: React.ReactNode }) {
	return <main className='h-screen w-screen'>{mainContent}</main>;
}

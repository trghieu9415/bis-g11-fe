import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<div className='flex h-screen items-center justify-center p-8'>
			<Alert variant='destructive' className='max-w-2xl'>
				<AlertCircle className='h-5 w-5' />
				<AlertTitle className='text-lg font-semibold'>Không tìm thấy trang</AlertTitle>
				<AlertDescription className='mt-2 text-base'>
					Trang bạn đang tìm không tồn tại hoặc không đủ quyền truy cập. Vui lòng kiểm tra lại đường dẫn hoặc vào lại{' '}
					<Link to='/' className='text-blue-400 underline hover:text-blue-500'>
						trang chủ
					</Link>
					.
				</AlertDescription>
			</Alert>
		</div>
	);
};

export default NotFound;

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
// import { useDispatch } from 'react-redux';
// import { fetchProducts } from '@/redux/slices/productSlice';
type ProductsStatusProps = {
	isLoading: boolean;
	error: string | null;
};
const ProductsStatus: React.FC<ProductsStatusProps> = ({ isLoading, error }) => {
	if (isLoading) {
		return (
			<div className='flex items-center justify-center gap-3'>
				<Spinner size='large' />
			</div>
		);
	}
	if (error) {
		return (
			<Alert variant='destructive'>
				<AlertCircle className='h-4 w-4' />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>Tải dữ liệu thất bại. Vui lòng thử lại sau. Mã lỗi ({error.slice(-3)})</AlertDescription>
			</Alert>
		);
	}
	return <div></div>;
};

export default ProductsStatus;

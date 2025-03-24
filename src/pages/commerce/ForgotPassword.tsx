import { motion } from 'framer-motion';
import ForgotPasswordForm from './forgot-password/ForgotPasswordForm';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
	return (
		<div className='relative flex min-h-screen items-center justify-center bg-black'>
			<div className="absolute inset-0 bg-cover bg-center bg-[url('./assets/bg.jpg')]" />

			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='relative z-10 w-full max-w-md'
			>
				<div className='flex flex-col items-center gap-2 text-white mb-3'>
					<span className='text-4xl font-bold'>Khôi phục mật khẩu</span>
					<span className='text-center w-lg'>Sử dụng email đã đăng ký của bạn để đặt mật khẩu mới</span>
				</div>
				<ForgotPasswordForm />
				<div className='text-white w-full text-center mt-4'>
					Trở về{' '}
					<Link to={'/home'} className='hover:underline'>
						Trang chủ
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default ForgotPassword;

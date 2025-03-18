import { motion } from 'framer-motion';
import LoginForm from './login/LoginForm';
import { Link } from 'react-router-dom';

const Login = () => {
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
					<span className='text-4xl font-bold'>Đăng nhập InkVerse</span>
					<span className='text'>Sử dụng email và mật khẩu của bạn để đăng nhập</span>
				</div>
				<LoginForm />
				<div className='text-white w-full text-center'>
					Trở về{' '}
					<Link to={'/new-order'} className='hover:underline'>
						Trang chủ
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default Login;

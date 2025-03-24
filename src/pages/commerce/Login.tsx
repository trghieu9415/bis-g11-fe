import { motion } from 'framer-motion';
import LoginForm from './login/LoginForm';
import { Link } from 'react-router-dom';

const Login = () => {
	return (
		<div className='relative flex min-h-screen items-center justify-center bg-black'>
			<div className="absolute inset-0 bg-cover bg-center bg-[url('./assets/bg.jpg')] opacity-50" />

			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='relative z-10 w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-lg'
			>
				<div className='flex flex-col items-center gap-2 text-white mb-5'>
					<span className='text-3xl font-bold'>Đăng nhập InkVerse</span>
					<span className='text-sm opacity-80'>Sử dụng Username và mật khẩu của bạn để đăng nhập</span>
				</div>

				<LoginForm />

				<div className='text-white text-center mt-4'>
					<Link to='/forgot-password' className='text-blue-400 hover:underline'>
						Quên mật khẩu?
					</Link>
				</div>

				<div className='text-white text-center mt-2'>
					Trở về{' '}
					<Link to='/new-order' className='text-blue-400 hover:underline'>
						Trang chủ
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default Login;

import { motion } from 'framer-motion';
import LoginForm from './login/LoginForm';

const Login = () => {
	return (
		<div className='relative flex min-h-screen items-center justify-center'>
			<div className="absolute inset-0 bg-[url('./assets/bg.jpg')] bg-cover bg-center" />

			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='z-10 w-full max-w-md rounded-lg p-6'
			>
				<div className='mb-5 flex flex-col items-center gap-2 text-white'>
					<span className='text-3xl font-bold'>Đăng nhập InkVerse</span>
					<span className='text-sm opacity-80'>Sử dụng Username và mật khẩu của bạn để đăng nhập</span>
				</div>

				<div className='relative'>
					<LoginForm />

					<div className='absolute left-0 top-0 z-10 h-full w-full rounded-2xl border border-black bg-black opacity-40 shadow-md' />
				</div>

				{/* <div className='mt-2 text-center text-white'>
					Trở về{' '}
					<Link to='/new-order' className='hover:underline'>
						Trang chủ
					</Link>
				</div> */}
			</motion.div>
		</div>
	);
};

export default Login;

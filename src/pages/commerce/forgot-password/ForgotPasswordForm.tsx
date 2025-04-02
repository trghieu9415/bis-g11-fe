import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ForgotPasswordEmailForm from './ForgotPasswordEmailForm';
import ForgotPasswordResetForm from './ForgotPasswordResetForm';

export default function ForgotPasswordForm() {
	const motionProps = {
		initial: { opacity: 0, y: -20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 20 },
		transition: { duration: 0.5 }
	};

	// Lấy token từ query params
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const token = queryParams.get('token') || '';

	return (
		<motion.div className='relative w-full max-w-md p-6' {...motionProps}>
			<div className='absolute inset-0 bg-black opacity-40 border border-black shadow-md rounded-2xl z-10' />

			<div className='relative z-20'>
				{token ? <ForgotPasswordResetForm token={token} /> : <ForgotPasswordEmailForm />}
			</div>
		</motion.div>
	);
}

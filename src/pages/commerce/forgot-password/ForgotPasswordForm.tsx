import { useState } from 'react';
import { motion } from 'framer-motion';
import ForgotPasswordEmailForm from './ForgotPasswordEmailForm';
import ForgotPasswordOTPForm from './ForgotPasswordOTPForm';
import ForgotPasswordResetForm from './ForgotPasswordResetForm';
import { Link } from 'react-router-dom';

export default function ForgotPasswordForm() {
	const [step, setStep] = useState(1);

	const motionProps = {
		initial: { opacity: 0, y: -20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 20 },
		transition: { duration: 0.5 }
	};

	return (
		<motion.div className='relative w-full max-w-md p-6' {...motionProps}>
			<div className='absolute inset-0 bg-black opacity-40 border border-black shadow-md rounded-2xl z-10' />

			<div className='relative z-20'>
				{step === 1 && <ForgotPasswordEmailForm onNext={() => setStep(2)} />}
				{step === 2 && <ForgotPasswordOTPForm onNext={() => setStep(3)} />}
				{step === 3 && <ForgotPasswordResetForm />}

				<div className='mt-4 text-center text-sm text-white'>
					Không có tài khoản?{' '}
					<Link to={'/register'} className='hover:underline'>
						Đăng ký ngay
					</Link>
				</div>
			</div>
		</motion.div>
	);
}

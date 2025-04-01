/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { loginAccount } from '@/services/authService';
import { toast } from 'react-toastify';

const formSchema = z.object({
	username: z.string(),
	password: z.string().min(8, { message: 'Mật khẩu cần ít nhất 8 ký tự' })
	// .regex(/(?=.*[A-Za-z])(?=.*\d)/, {
	// 	message: 'Cần ít nhất 1 ký tự chữ và 1 ký tự số'
	// })
});

const LoginForm = () => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm({
		resolver: zodResolver(formSchema)
	});

	const onSubmit = async (values: any) => {
		console.log('Logging in with:', values);
		const payload = { ...values, platform: 'WEB' };
		const response = await loginAccount(payload);
		console.log(response);
		localStorage.setItem('accessToken', response.data.accessToken);
		localStorage.setItem('refreshToken', response.data.refreshToken);
		localStorage.setItem('roleUser', response.data.roleInfo.name);
		toast.success('Đăng nhập thành công!');
		navigate('/dashboard');
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-screen'>
			<form onSubmit={handleSubmit(onSubmit)} className='p-6 bg-gray-800 rounded-lg shadow-md w-96'>
				<h2 className='text-white text-2xl mb-4'>Đăng nhập</h2>

				{/* Email Field */}
				<div className='mb-4'>
					<label className='block text-white mb-1'>Username</label>
					<input type='text' {...register('username')} className='w-full p-2 rounded bg-gray-700 text-white' />
					{errors.username && <p className='text-red-400'>{errors.username.message}</p>}
				</div>

				{/* Password Field */}
				<div className='mb-4'>
					<label className='block text-white mb-1'>Mật khẩu</label>
					<input type='password' {...register('password')} className='w-full p-2 rounded bg-gray-700 text-white' />
					{errors.password && <p className='text-red-400'>{errors.password.message}</p>}
				</div>

				{/* Submit Button */}
				<button type='submit' className='w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded'>
					Đăng nhập
				</button>
			</form>
		</div>
	);
};

export default LoginForm;

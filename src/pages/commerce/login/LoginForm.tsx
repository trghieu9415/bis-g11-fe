/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
		try {
			console.log('Logging in with:', values);
			const payload = { ...values, platform: 'WEB' };
			// Gọi API đăng nhập
			const response = await axios.post('http://localhost:8080/api/v1/auth/access', payload);

			// Lưu token vào localStorage
			localStorage.setItem('accessToken', response.data.data.accessToken);
			localStorage.setItem('refreshToken', response.data.data.refreshToken);
			localStorage.setItem('roleUser', response.data.data.roleInfo.name);
			alert('Đăng nhập thành công!');

			// Chuyển hướng sang trang Dashboard
			navigate('/dashboard');
		} catch (error) {
			console.error('Login error:', error);
			alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
		}
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

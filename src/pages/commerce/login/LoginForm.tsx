/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { loginUser } from '@/redux/slices/authSlice';

const formSchema = z.object({
	username: z.string().min(1, { message: 'Username không được để trống' }),
	password: z.string().min(8, { message: 'Mật khẩu cần ít nhất 8 ký tự' })
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { isAuthenticated, isLoading, error } = useAppSelector(state => state.auth);

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema)
	});

	useEffect(() => {
		// Redirect if already authenticated
		if (isAuthenticated) {
			navigate('/dashboard');
		}
	}, [isAuthenticated, navigate]);

	const onSubmit = async (values: FormValues) => {
		try {
			const payload = { ...values, platform: 'WEB' };
			console.log('Submitting login form:', payload);
			
			// This will handle both login and profile fetch
			const profile = await dispatch(loginUser(payload)).unwrap();
			console.log('Login successful with profile:', profile);
			
			toast.success('Đăng nhập thành công!');
			navigate('/dashboard');
		} catch (err: any) {
			console.error('Login error:', err);
			toast.error(typeof err === 'string' ? err : (error || 'Đăng nhập thất bại, vui lòng thử lại!'));
		}
	};

	return (
		<div className='flex min-h-screen flex-col items-center justify-center'>
			<form onSubmit={handleSubmit(onSubmit)} className='w-96 rounded-lg bg-gray-800 p-6 shadow-md'>
				<h2 className='mb-4 text-2xl text-white'>Đăng nhập</h2>

				{/* Username Field */}
				<div className='mb-4'>
					<label className='mb-1 block text-white'>Username</label>
					<input type='text' {...register('username')} className='w-full rounded bg-gray-700 p-2 text-white' />
					{errors.username && <p className='text-red-400'>{errors.username.message}</p>}
				</div>

				{/* Password Field */}
				<div className='mb-4'>
					<label className='mb-1 block text-white'>Mật khẩu</label>
					<input type='password' {...register('password')} className='w-full rounded bg-gray-700 p-2 text-white' />
					{errors.password && <p className='text-red-400'>{errors.password.message}</p>}
				</div>

				{/* Submit Button */}
				<button
					type='submit'
					className='w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600'
					disabled={isLoading}
				>
					{isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
				</button>

				{error && <p className='mt-2 text-red-400'>{error}</p>}
			</form>
		</div>
	);
};

export default LoginForm;

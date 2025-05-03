/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
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
	const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema)
	});

	// Handle redirection after successful authentication
	useEffect(() => {
		if (hasAttemptedLogin && isAuthenticated) {
			// Get user role from localStorage to determine where to redirect
			const profile = localStorage.getItem('profile');
			let redirectPath = '/';

			if (profile) {
				const parsedProfile = JSON.parse(profile);
				const role = parsedProfile?.resContractDTO?.roleName;

				// Redirect based on role
				if (role === 'HR_MANAGER') {
					redirectPath = '/hr';
				} else if (role === 'BUSINESS_MANAGER') {
					redirectPath = '/business';
				} else if (role === 'WAREHOUSE_MANAGER') {
					redirectPath = '/warehouse';
				} else if (role === 'EMPLOYEE') {
					redirectPath = '/employee';
				} else if (role === 'ADMIN') {
					redirectPath = '/hr';
				}
			}

			toast.success('Đăng nhập thành công!');
			navigate(redirectPath);
		}
	}, [isAuthenticated, hasAttemptedLogin, navigate]);

	const onSubmit = async (values: FormValues) => {
		try {
			const payload = { ...values, platform: 'WEB' };

			setHasAttemptedLogin(true);
			await dispatch(loginUser(payload)).unwrap();

			// Navigation will be handled by the useEffect
		} catch (err: any) {
			console.error('Login error:', err);
			toast.error(typeof err === 'string' ? err : error || 'Đăng nhập thất bại, vui lòng thử lại!');
			setHasAttemptedLogin(false);
		}
	};

	return (
		<div className='relative left-0 top-0 z-50 flex flex-col items-center justify-center'>
			<form onSubmit={handleSubmit(onSubmit)} className='w-96 p-6'>
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

				{/* Forgot password */}
				<div className='w-100 pb-4 pt-4 text-end text-white underline'>
					<Link to='/forgot-password' className='hover:text-blue-400'>
						Quên mật khẩu?
					</Link>
				</div>

				{error && <p className='mt-2 text-center text-red-400'>{error}</p>}
			</form>
		</div>
	);
};

export default LoginForm;

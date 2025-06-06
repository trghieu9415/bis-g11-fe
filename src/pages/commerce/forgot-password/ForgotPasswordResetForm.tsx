/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { resetPassword } from '@/services/authService';

const passwordSchema = z
	.object({
		password: z
			.string()
			.min(8, { message: 'Mật khẩu cần ít nhất 8 ký tự' })
			.regex(/(?=.*[A-Za-z])(?=.*\d)/, {
				message: 'Cần ít nhất 1 chữ cái và 1 số'
			}),
		confirmPassword: z.string()
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Mật khẩu xác nhận không khớp',
		path: ['confirmPassword']
	});

interface Props {
	token: string;
}

export default function ForgotPasswordResetForm({ token }: Props) {
	const form = useForm({
		resolver: zodResolver(passwordSchema),
		defaultValues: { password: '', confirmPassword: '' }
	});

	async function onSubmit(values: any) {
		try {
			const response = await resetPassword({
				secretKey: token, // Token từ props
				password: values.password,
				confirmPassword: values.confirmPassword
			});

			toast.success('Mật khẩu đã được đặt lại!');
			window.location.href = '/login';
		} catch (error: any) {
			// Xử lý lỗi
			const errorMessage = error.response?.message || 'Có lỗi xảy ra!';
			toast.error(errorMessage);
		}
	}

	return (
		<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='!text-white'>Mật khẩu mới</FormLabel>
								<FormControl>
									<Input
										type='password'
										className='bg-white text-black'
										placeholder='Nhập mật khẩu mới của bạn'
										{...field}
									/>
								</FormControl>
								<FormMessage className='text-red-400' />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='confirmPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='!text-white'>Xác nhận mật khẩu</FormLabel>
								<FormControl>
									<Input
										type='password'
										className='bg-white text-black'
										placeholder='Xác nhận lại mật khẩu'
										{...field}
									/>
								</FormControl>
								<FormMessage className='text-red-400' />
							</FormItem>
						)}
					/>

					<Button type='submit' className='w-full'>
						Đặt lại mật khẩu
					</Button>
				</form>
			</Form>
		</motion.div>
	);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { forgotPassword } from '@/services/authService';

const emailSchema = z.object({
	email: z.string().email({ message: 'Sai định dạng email' })
});

export default function ForgotPasswordEmailForm() {
	const form = useForm({
		resolver: zodResolver(emailSchema),
		defaultValues: { email: '' }
	});

	async function onSubmit(values: { email: string }) {
		try {
			const response = await forgotPassword(values.email);
			toast.success('Link đặt lại mật khẩu đã được gửi đến email của bạn!');
		} catch (error: any) {
			console.log(error);

			// Kiểm tra xem có response từ server không
			if (error.response) {
				// Lấy thông tin lỗi từ response
				const errorMessage = error.response.data.message || 'Có lỗi xảy ra, vui lòng thử lại!';
				toast.error(errorMessage);
			} else {
				// Nếu không có response từ server (lỗi network hoặc server không phản hồi)
				toast.error('Không thể kết nối đến server, vui lòng kiểm tra lại!');
			}
			console.error('Error sending password reset email:', error);
		}
	}

	return (
		<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='!text-white'>Email</FormLabel>
								<FormControl>
									<Input type='email' placeholder='johndoe@mail.com' className='bg-white text-black' {...field} />
								</FormControl>
								<FormMessage className='text-red-400' />
							</FormItem>
						)}
					/>
					<Button type='submit' className='w-full'>
						Xác nhận
					</Button>
				</form>
			</Form>
		</motion.div>
	);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const otpSchema = z.object({
	otp: z.string().length(6, { message: 'Mã OTP phải có 6 chữ số' })
});

export default function ForgotPasswordOTPForm({ onNext }: { onNext: () => void }) {
	const form = useForm({
		resolver: zodResolver(otpSchema),
		defaultValues: { otp: '' }
	});

	function onSubmit(values: any) {
		console.log(values);
		toast.success('Mã OTP hợp lệ! Chuyển đến bước đổi mật khẩu...');
		onNext();
	}

	return (
		<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<FormField
						control={form.control}
						name='otp'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='!text-white'>Mã OTP</FormLabel>
								<FormControl>
									<Input type='text' placeholder='123456' maxLength={6} className='bg-white text-black' {...field} />
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

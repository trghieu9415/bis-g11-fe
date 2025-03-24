/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const emailSchema = z.object({
	email: z.string().email({ message: 'Sai định dạng email' })
});

export default function ForgotPasswordEmailForm({ onNext }: { onNext: () => void }) {
	const form = useForm({
		resolver: zodResolver(emailSchema),
		defaultValues: { email: '' }
	});

	function onSubmit(values: any) {
		console.log(values);
		toast.success('Email hợp lệ! Chuyển đến bước nhập OTP...');
		onNext();
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

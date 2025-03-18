'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
	email: z.string().email({ message: 'Sai định dạng email' }),
	password: z
		.string()
		.min(8, { message: 'Mật khẩu cần ít nhất 8 ký tự' })
		.regex(/(?=.*[A-Za-z])(?=.*\d)/, {
			message: 'Cần ít nhất 1 ký tự chữ và 1 ký tự số'
		})
});

const LoginForm = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			console.log(values);
			toast(
				<pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
					<code className='text-white'>{JSON.stringify(values, null, 2)}</code>
				</pre>
			);
		} catch (error) {
			console.error('Form submission error', error);
			toast.error('Failed to submit the form. Please try again.');
		}
	}

	return (
		<div className='flex flex-col min-h-[50vh] h-full w-full items-center justify-center px-4'>
			<Card className='mx-2 w-full bg-transparent border-none text-white relative pt-6'>
				<div className='opacity-40 w-full h-full absolute bg-black rounded-2xl top-0 shadow-md' />
				<CardContent className='relative z-10 border-none shadow-none'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
							<div className='grid gap-4'>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem className='grid gap-2'>
											<FormLabel htmlFor='email' className='!text-white'>
												Email
											</FormLabel>
											<FormControl>
												<Input
													id='email'
													placeholder='johndoe@mail.com'
													type='email'
													autoComplete='email'
													className='bg-white text-black'
													{...field}
												/>
											</FormControl>
											<FormMessage className='text-red-400' />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem className='grid gap-2'>
											<div className='flex justify-between items-center'>
												<FormLabel htmlFor='password' className='!text-white'>
													Mật khẩu
												</FormLabel>
											</div>
											<FormControl>
												<Input
													id='password'
													placeholder='Nhập mật khẩu'
													type='password'
													autoComplete='new-password'
													className='bg-white text-black'
													{...field}
												/>
											</FormControl>
											<FormMessage className='text-red-400' />
										</FormItem>
									)}
								/>
								<Button type='submit' className='w-full'>
									Đăng nhập
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default LoginForm;
